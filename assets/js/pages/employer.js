import { V, $, $$, esc, icon, store, user, toast, deskNav, url, pay, num, money, province, shift, target, company, modal, closeModal, mono } from '../core.js';
import { go } from '../router.js';

const CO = 'long-hai';
const STAGES = [['new', 'Mới'], ['called', 'Đã gọi'], ['interview', 'Hẹn PV / nhận đồng phục'], ['hired', 'Đi làm'], ['rejected', 'Loại']];
const STATUS = { draft: ['st-draft', 'Nháp'], pending: ['st-wait', 'Chờ duyệt'], live: ['st-live', 'Đang hiển thị'], soon: ['st-soon', 'Sắp hết hạn'], off: ['st-off', 'Hết hạn'], hidden: ['st-off', 'Đã ẩn'] };

/* ---- Kiểm tra rủi ro: chỉ cảnh báo, không tự sửa nội dung ---- */
export function riskCheck(f) {
  const text = `${f.title || ''} ${f.desc || ''}`.toLowerCase();
  const out = [];
  if (/(phí|đóng tiền|nộp tiền|thu tiền).{0,20}(đồng phục|hồ sơ|đào tạo)|đồng phục.{0,12}(phí|\d+ ?k|\d{3}\.?000)/.test(text)) out.push('Có nội dung thu phí đồng phục hoặc hồ sơ. Quy chế cấm thu tiền người xin việc.');
  if (/(đặt )?cọc|giữ (bằng|cccd|căn cước)/.test(text)) out.push('Có nội dung đặt cọc hoặc giữ giấy tờ gốc.');
  if (Number(f.salaryMax) > 25) out.push(`Lương ${f.salaryMax} triệu cao bất thường so với mặt bằng (7 – 14 triệu).`);
  if (!f.address || f.address.length < 8) out.push('Thiếu địa chỉ mục tiêu cụ thể.');
  return out;
}

/* ---- Bóc tách mô tả tự nhiên. Không đoán: thiếu thì hỏi lại ---- */
function parse(text, cur) {
  const t = text.toLowerCase();
  const f = { ...cur };
  const p = V.provinces.find((x) => [x.name, x.short, x.slug.replace(/-/g, ' ')].some((n) => t.includes(n.toLowerCase())) || (x.slug === 'tp-hcm' && /(sài gòn|hcm|sg\b)/.test(t)) || (x.slug === 'ha-noi' && /hn\b/.test(t)));
  if (p) f.province = p.slug;
  const pv = V.provinces.find((x) => x.slug === f.province);
  const d = (pv ? pv.districts : V.provinces.flatMap((x) => x.districts)).find((x) => t.includes(x.toLowerCase()));
  if (d) { f.district = d; if (!f.province) f.province = V.provinces.find((x) => x.districts.includes(d)).slug; }
  const tg = [['ngan-hang', /ngân hàng/], ['kcn', /(kcn|khu công nghiệp|nhà máy|kho)/], ['toa-nha', /(tòa nhà|chung cư|văn phòng)/], ['su-kien', /sự kiện|triển lãm/], ['ve-si', /vệ sĩ/], ['truong-hoc', /trường|bệnh viện/]].find(([, r]) => r.test(t));
  if (tg) f.target = tg[0];
  const sh = /24\/24|24 ?(tiếng|h)/.test(t) ? '24h' : /ca đêm|trực đêm/.test(t) ? 'dem' : /ca gãy/.test(t) ? 'gay' : /12 ?(tiếng|h)/.test(t) ? '12h' : /8 ?(tiếng|h)|hành chính/.test(t) ? '8h' : '';
  if (sh) f.shift = sh;
  const m = t.match(/(\d+(?:[.,]\d+)?)\s*(?:-|–|đến)\s*(\d+(?:[.,]\d+)?)\s*(?:tr|triệu)/) || t.match(/(\d+(?:[.,]\d+)?)\s*(?:tr|triệu)/);
  if (m) { f.salaryMin = parseFloat(m[1].replace(',', '.')); f.salaryMax = parseFloat((m[2] || m[1]).replace(',', '.')); }
  const q = t.match(/(\d+)\s*(?:người|bảo vệ|nhân viên|bv)/);
  if (q) f.qty = Number(q[1]);
  if (/bao ở|ký túc|chỗ ở/.test(t)) f.housing = true;
  if (/bao ăn|bao cơm|ăn trưa|ăn ca/.test(t)) f.meals = true;
  const addr = text.match(/(?:địa chỉ|tại|ở)\s*[:：]?\s*([^,.;\n]{8,80}(?:,[^,.;\n]{2,40}){0,2})/i);
  if (addr && !/^(quận|huyện)?\s*\d*$/i.test(addr[1].trim())) f.address = addr[1].trim();
  f.desc = [cur.desc, text].filter(Boolean).join('\n');
  return f;
}
const ASK = [
  ['province', 'Mục tiêu ở tỉnh/thành và quận nào?'],
  ['target', 'Đây là loại mục tiêu gì: tòa nhà, nhà máy/KCN, ngân hàng, sự kiện hay vệ sĩ?'],
  ['shift', 'Làm ca mấy tiếng: 8 tiếng, 12 tiếng, ca đêm, ca gãy hay 24/24?'],
  ['salaryMin', 'Lương bao nhiêu một tháng? Ví dụ "8 – 9 triệu".'],
  ['address', 'Địa chỉ mục tiêu cụ thể là ở đâu? Ứng viên cần biết chỗ làm.']
];

export default function ({ params: [tab = ''], query }) {
  const u = user();
  if (!u) return { redirect: '/dang-nhap?vai-tro=nha-tuyen-dung&tiep=/nha-tuyen-dung' };
  if (u.role !== 'employer') return { redirect: '/ung-vien' };
  const c = company(CO);
  const mine = store.get('myJobs', []);
  const jobs = [...mine.map((j) => ({ ...j, own: true })), ...V.jobs.filter((j) => j.company === CO).map((j) => ({ ...j, status: j.daysLeft < 0 ? 'off' : j.daysLeft <= 3 ? 'soon' : 'live' }))];
  const ats = store.get('ats', null) || V.candidates.map((x, i) => ({ ...x, id: i + 1 }));
  const points = store.get('points', 20);
  const verify = store.get('verify', 'done');
  const tabs = [['', 'Tổng quan', 'chart'], ['dang-tin', 'Đăng tin', 'plus'], ['tin-dang', 'Tin đã đăng', 'list', jobs.length], ['ung-vien', 'Ứng viên', 'users', ats.filter((x) => x.status === 'new').length || ''], ['tim-ung-vien', 'Tìm ứng viên', 'search'], ['xac-thuc', 'Xác thực công ty', 'shield'], ['thanh-toan', 'Gói & thanh toán', 'card']];
  if (!tabs.some((t) => t[0] === tab)) return { redirect: '/nha-tuyen-dung' };

  const count = (s) => jobs.filter((j) => j.status === s).length;
  const statusCell = (s) => `<span class="${STATUS[s][0]}"><b>${STATUS[s][1]}</b></span>`;

  const views = {
    '': () => {
      const week = [42, 58, 51, 73, 66, 88, 97];
      const max = Math.max(...week);
      return `
      <div class="desk-title"><div><h1>Chào ${esc(u.name || c.short)}</h1><p>Số liệu 7 ngày qua của ${esc(c.name)}.</p></div><a class="btn btn-primary" href="/nha-tuyen-dung/dang-tin">${icon('plus')}Đăng tin mới</a></div>
      <div class="kpis">
        <div><span>Lượt xem tin</span><b>${num(jobs.reduce((a, j) => a + (j.views || 0), 0))}</b><small><span class="up">+18%</span> so với tuần trước</small></div>
        <div><span>Lượt gọi</span><b>${num(jobs.reduce((a, j) => a + (j.calls || 0), 0))}</b><small><span class="up">+9%</span></small></div>
        <div><span>Ứng viên mới</span><b>${ats.filter((x) => x.status === 'new').length}</b><small>chưa gọi lại</small></div>
        <div><span>Điểm còn lại</span><b>${points}</b><small>mở được ${points} hồ sơ</small></div>
      </div>
      <section class="panel"><div class="panel-h"><h2>Vòng đời tin</h2><span class="mute">Nhắc gia hạn trước 3 ngày</span></div>
        <div class="life">${['draft', 'pending', 'live', 'soon', 'off'].map((s) => `<div class="${s === 'soon' ? 'warn' : ''}"><b>${count(s)}</b><span>${STATUS[s][1]}</span></div>`).join('')}</div>
      </section>
      <div class="two">
        <section class="panel"><div class="panel-h"><h2>Lượt gọi theo ngày</h2></div>
          <div class="bars">${week.map((v) => `<div><span>${v}</span><i style="height:${(v / max) * 100}%"></i></div>`).join('')}</div>
          <div class="bars-x">${['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => `<span>${d}</span>`).join('')}</div>
        </section>
        <section class="panel"><div class="panel-h"><h2>Ứng viên mới nhất</h2><a class="more" href="/nha-tuyen-dung/ung-vien">Mở bảng ${icon('arrow', 'ico-s')}</a></div>
          <ul class="notes">${ats.slice(0, 4).map((x) => `<li><div><b>${esc(x.name)}</b><p>${x.age} tuổi · ${esc(x.exp)}</p></div><time class="mute">${esc(x.time)}</time></li>`).join('')}</ul>
        </section>
      </div>`;
    },
    'dang-tin': () => {
      const src = query.get('sao-chep') ? jobs.find((j) => String(j.id) === query.get('sao-chep')) : null;
      const f = src || {};
      return `
      <div class="desk-title"><div><h1>${src ? 'Sao chép tin' : 'Đăng tin tuyển'}</h1><p>Kể bằng lời như nhắn Zalo, trợ lý sẽ điền vào form. Trợ lý chỉ điền điều bạn nói, thiếu thì hỏi lại.</p></div></div>
      <div class="compose">
        <div class="chat">
          <div class="chat-head"><b>Trợ lý đăng tin</b><span>Không tự bịa thông tin</span></div>
          <div class="chat-body" id="cb"><div class="msg msg-bot"><b>Trợ lý</b>Anh/chị cần tuyển bảo vệ ở đâu, làm ca nào, lương bao nhiêu? Ví dụ: <i>"Cần 3 bảo vệ ngân hàng ở Cầu Giấy, Hà Nội, ca 8 tiếng, lương 9 – 11 triệu, bao ăn trưa, địa chỉ 25 Trần Duy Hưng"</i>.</div></div>
          <form class="chat-form" id="cf"><input class="input" name="m" placeholder="Nhập mô tả…" autocomplete="off" aria-label="Mô tả công việc"><button class="btn btn-primary" type="submit" aria-label="Gửi">${icon('send')}</button></form>
        </div>
        <form class="formcard" id="jf">
          <h3>Nội dung tin</h3>
          <label class="field" style="margin-bottom:16px"><span>Tiêu đề</span><input class="input" name="title" required value="${esc(f.title || '')}" placeholder="Tuyển bảo vệ tòa nhà Quận 1, ca 12 tiếng"></label>
          <div class="grid2">
            <label class="field"><span>Tỉnh/thành</span><select class="select" name="province" required><option value="">Chọn</option>${V.provinces.map((p) => `<option value="${p.slug}" ${f.province === p.slug ? 'selected' : ''}>${p.name}</option>`).join('')}</select></label>
            <label class="field"><span>Quận/huyện</span><select class="select" name="district" required>${districtOpts(f.province, f.district)}</select></label>
          </div>
          <label class="field" style="margin-bottom:16px"><span>Địa chỉ mục tiêu</span><input class="input" name="address" value="${esc(f.address || '')}" placeholder="Số nhà, đường, tên tòa nhà/KCN"></label>
          <div class="grid3">
            <label class="field"><span>Loại mục tiêu</span><select class="select" name="target" required><option value="">Chọn</option>${V.targets.map((x) => `<option value="${x.id}" ${f.target === x.id ? 'selected' : ''}>${x.name}</option>`).join('')}</select></label>
            <label class="field"><span>Ca làm</span><select class="select" name="shift" required><option value="">Chọn</option>${V.shifts.map((x) => `<option value="${x.id}" ${f.shift === x.id ? 'selected' : ''}>${x.name}</option>`).join('')}</select></label>
            <label class="field"><span>Số lượng</span><input class="input" name="qty" type="number" min="1" value="${f.qty || 1}"></label>
          </div>
          <div class="grid2">
            <label class="field"><span>Lương từ (triệu)</span><input class="input" name="salaryMin" type="number" step="0.5" min="1" required value="${f.salaryMin || ''}"></label>
            <label class="field"><span>Đến (triệu)</span><input class="input" name="salaryMax" type="number" step="0.5" min="1" required value="${f.salaryMax || ''}"></label>
          </div>
          <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px"><label class="check"><input type="checkbox" name="housing" ${f.housing ? 'checked' : ''}>Bao ở</label><label class="check"><input type="checkbox" name="meals" ${f.meals ? 'checked' : ''}>Bao ăn</label><label class="check"><input type="checkbox" name="urgent" ${f.urgent ? 'checked' : ''}>Tin gấp (149.000đ)</label></div>
          <label class="field"><span>Mô tả, yêu cầu</span><textarea class="textarea" name="desc" rows="4" placeholder="Tuổi, chiều cao, giấy tờ cần mang…">${esc(f.desc || '')}</textarea></label>
          <div id="risk" style="margin-top:16px"></div>
          <div class="form-foot"><button class="btn btn-quiet" type="button" id="draft">Lưu nháp</button><button class="btn btn-primary" type="submit">Gửi duyệt</button></div>
        </form>
      </div>`;
    },
    'tin-dang': () => `
      <div class="desk-title"><div><h1>Tin đã đăng</h1><p>${count('live')} tin đang hiển thị · ${count('soon')} tin sắp hết hạn</p></div><a class="btn btn-primary" href="/nha-tuyen-dung/dang-tin">${icon('plus')}Đăng tin</a></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tin</th><th>Trạng thái</th><th class="num">Xem</th><th class="num">Gọi</th><th class="num">Còn</th><th class="num">Thao tác</th></tr></thead><tbody>
      ${jobs.map((j) => `<tr><td>${j.status === 'live' || j.status === 'soon' ? `<a href="${url.job(j)}"><b>${esc(j.title)}</b></a>` : `<b>${esc(j.title)}</b>`}<br><small class="mute">${esc(j.district || '')} · ${pay(j)} triệu</small></td><td>${statusCell(j.status)}</td><td class="num">${num(j.views || 0)}</td><td class="num">${num(j.calls || 0)}</td><td class="num">${j.daysLeft < 0 ? '–' : (j.daysLeft ?? 30) + ' ngày'}</td>
        <td><div class="acts">
          <button class="btn btn-quiet btn-s" type="button" data-renew="${j.id}" title="Gia hạn 30 ngày">${icon('refresh')}<span class="sr">Gia hạn</span></button>
          <a class="btn btn-quiet btn-s" href="/nha-tuyen-dung/dang-tin?sao-chep=${j.id}" title="Sao chép">${icon('copy')}<span class="sr">Sao chép</span></a>
          ${j.own ? `<button class="btn btn-quiet btn-s" type="button" data-hide="${j.id}" title="${j.status === 'hidden' ? 'Hiện lại' : 'Ẩn tin'}">${icon(j.status === 'hidden' ? 'eye' : 'pause')}<span class="sr">Ẩn/hiện</span></button>` : ''}
        </div></td></tr>`).join('')}
      </tbody></table></div>`,
    'ung-vien': () => `
      <div class="desk-title"><div><h1>Ứng viên</h1><p>Kéo thẻ sang cột kế tiếp, hoặc chọn trạng thái trên thẻ.</p></div></div>
      <div class="ats">${STAGES.map(([k, l]) => `<div class="ats-col" data-col="${k}"><h3>${l}<span>${ats.filter((x) => x.status === k).length}</span></h3>
        ${ats.filter((x) => x.status === k).map((x) => `<div class="cand" draggable="true" data-id="${x.id}"><b>${esc(x.name)}</b><p>${x.age} tuổi · ${esc(x.height)} · ${esc(x.area)}</p><p>${esc(x.exp)}</p>
          <div class="row">${x.certs.map((t) => `<span class="tag tag-ok">${esc(t)}</span>`).join('')}<select aria-label="Chuyển trạng thái" data-move="${x.id}">${STAGES.map(([s, n]) => `<option value="${s}" ${s === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div></div>`).join('')}
      </div>`).join('')}</div>`,
    'tim-ung-vien': () => {
      const pool = [
        ['Phạm Văn Đức', 31, '1m71', 'Gò Vấp, TP.HCM', 'Xuất ngũ · 3 năm bảo vệ siêu thị', 2.1],
        ['Đỗ Thành Nam', 26, '1m74', 'Quận 12, TP.HCM', 'Công an nghĩa vụ · Võ thuật', 3.4],
        ['Huỳnh Tấn Lộc', 48, '1m65', 'Bình Thạnh, TP.HCM', '10 năm chỉ huy mục tiêu · PCCC', 4.8],
        ['Võ Minh Khang', 23, '1m69', 'Thủ Đức, TP.HCM', 'Mới vào nghề · Có xe máy', 6.2],
        ['Ngô Văn Sang', 39, '1m67', 'Tân Bình, TP.HCM', 'Bảo vệ ngân hàng 6 năm', 7.5]
      ];
      const open = store.get('unlocked', []);
      return `
      <div class="desk-title"><div><h1>Tìm ứng viên</h1><p>Ứng viên đã bật "cho công ty tìm thấy". Mở số điện thoại tốn 1 điểm.</p></div><span class="tag tag-vip">Còn ${points} điểm</span></div>
      <form class="bar-tools" id="near">
        <label class="field"><span>Gần địa chỉ</span><input class="input" name="addr" value="Saigon Centre, Quận 1"></label>
        <label class="field" style="max-width:150px"><span>Bán kính</span><select class="select" name="r"><option value="3">3 km</option><option value="5" selected>5 km</option><option value="10">10 km</option></select></label>
        <button class="btn btn-primary" type="submit">${icon('search')}Tìm</button>
      </form>
      <div class="people">${pool.map(([n, a, h, area, exp, km], i) => `<div class="person" data-km="${km}">${mono({ initials: n.split(' ').pop()[0] }, '')}<div><b>${n}</b><p>${a} tuổi · ${h} · ${area} · cách ${String(km).replace('.', ',')} km</p><p class="mute">${exp}</p></div>
        <div class="acts">${open.includes(i) ? `<a class="btn btn-call btn-s" href="tel:0909${String(100000 + i * 7311).slice(0, 6)}">${icon('phone')}0909 ${String(100000 + i * 7311).slice(0, 3)} ${String(100000 + i * 7311).slice(3, 6)}</a>` : `<span class="phone-mask">0909 *** ***</span><button class="btn btn-line btn-s" type="button" data-unlock="${i}">${icon('lock')}Mở số · 1 điểm</button>`}</div></div>`).join('')}</div>`;
    },
    'xac-thuc': () => `
      <div class="desk-title"><div><h1>Xác thực công ty</h1><p>Tin của công ty đã xác thực được gắn dấu và ưu tiên hiển thị.</p></div>${verify === 'done' ? `<span class="verified">${icon('check')}Đã xác thực</span>` : '<span class="tag tag-off">Đang chờ duyệt</span>'}</div>
      <form class="formcard" id="vf">
        <div class="grid2">
          <label class="field"><span>Tên công ty</span><input class="input" value="${esc(c.name)}" required></label>
          <label class="field"><span>Mã số thuế</span><input class="input" value="${esc(c.mst)}" inputmode="numeric" required></label>
        </div>
        <div class="grid2">
          <label class="field"><span>Giấy chứng nhận đủ điều kiện ANTT</span><input class="input" value="${esc(c.license)}" required></label>
          <label class="field"><span>Người đại diện</span><input class="input" value="Nguyễn Văn Hải" required></label>
        </div>
        <div class="grid2">
          <div class="upload">${icon('file')}<br>Giấy phép kinh doanh (PDF, ảnh)<br><input type="file" accept=".pdf,image/*" aria-label="Tải giấy phép kinh doanh"></div>
          <div class="upload">${icon('file')}<br>Giấy chứng nhận ANTT<br><input type="file" accept=".pdf,image/*" aria-label="Tải giấy chứng nhận ANTT"></div>
        </div>
        <div class="form-foot"><button class="btn btn-primary" type="submit">Gửi xác thực lại</button></div>
      </form>`,
    'thanh-toan': () => {
      const inv = store.get('invoices', [{ no: 'HD-2026-0981', item: 'Gói VIP · 1 tin', amount: 299000, date: '02/11/2026' }, { no: 'HD-2026-0742', item: '50 điểm xem hồ sơ', amount: 450000, date: '18/10/2026' }]);
      const pick = query.get('goi');
      return `
      <div class="desk-title"><div><h1>Gói & thanh toán</h1><p>Giá đã gồm VAT. Hóa đơn điện tử gửi về email công ty.</p></div><a class="more" href="/bang-gia">So sánh các gói ${icon('arrow', 'ico-s')}</a></div>
      <div class="tbl-wrap" style="margin-bottom:28px"><table class="tbl"><thead><tr><th>Gói</th><th>Mô tả</th><th class="num">Giá</th><th></th></tr></thead><tbody>
        ${V.packages.filter((p) => p.price).map((p) => `<tr${p.id === pick ? ' style="background:var(--paper)"' : ''}><td><b>${esc(p.name)}</b></td><td class="mute">${esc(p.desc)}</td><td class="num"><b>${money(p.price)}</b></td><td class="num"><button class="btn ${p.id === pick ? 'btn-primary' : 'btn-line'} btn-s" type="button" data-buy="${p.id}">Mua</button></td></tr>`).join('')}
        <tr><td><b>Gói 50 điểm</b></td><td class="mute">Mở số điện thoại 50 ứng viên, hạn 12 tháng</td><td class="num"><b>${money(450000)}</b></td><td class="num"><button class="btn btn-line btn-s" type="button" data-buy="points">Mua</button></td></tr>
      </tbody></table></div>
      <section class="panel"><div class="panel-h"><h2>Hóa đơn</h2></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Số</th><th>Nội dung</th><th>Ngày</th><th class="num">Số tiền</th><th></th></tr></thead><tbody>
        ${inv.map((x) => `<tr><td>${x.no}</td><td>${esc(x.item)}</td><td>${x.date}</td><td class="num"><b>${money(x.amount)}</b></td><td class="num"><button class="btn btn-quiet btn-s" type="button" data-toast="Bản mẫu: hóa đơn PDF sẽ tải về ở bản chính thức.">${icon('download')}PDF</button></td></tr>`).join('')}
        </tbody></table></div>
      </section>`;
    }
  };

  const html = `<div class="wrap desk">${deskNav('/nha-tuyen-dung', tabs, tab, `<b>${esc(c.short)}</b><small>${verify === 'done' ? 'Đã xác thực' : 'Chờ xác thực'} · ${points} điểm</small>`)}<div>${views[tab]()}</div></div>`;

  function mount(root) {
    const reload = () => go(location.pathname + location.search, { replace: true, keepScroll: true });

    /* Đăng tin */
    const jf = $('#jf', root);
    if (jf) {
      let draft = {};
      const fill = (f) => {
        ['title', 'address', 'qty', 'salaryMin', 'salaryMax', 'desc'].forEach((k) => { if (f[k] !== undefined && f[k] !== '') jf[k].value = f[k]; });
        ['province', 'target', 'shift'].forEach((k) => { if (f[k]) jf[k].value = f[k]; });
        if (f.province) jf.district.innerHTML = districtOpts(f.province, f.district);
        ['housing', 'meals'].forEach((k) => { if (f[k]) jf[k].checked = true; });
        if (!jf.title.value && f.target && f.district) jf.title.value = `Tuyển ${f.qty > 1 ? f.qty + ' ' : ''}bảo vệ ${target(f.target).name.toLowerCase()} ${f.district}${f.shift ? ', ' + shift(f.shift).name.toLowerCase() : ''}`;
        showRisk();
      };
      const cb = $('#cb', root);
      const say = (cls, h) => { cb.insertAdjacentHTML('beforeend', `<div class="msg ${cls}">${h}</div>`); cb.scrollTop = cb.scrollHeight; };
      $('#cf', root).addEventListener('submit', (e) => {
        e.preventDefault();
        const m = e.target.m.value.trim();
        if (!m) return;
        e.target.m.value = '';
        say('msg-me', esc(m));
        say('msg-bot typing-row', '<span class="typing"><span></span><span></span><span></span></span>');
        setTimeout(() => {
          cb.lastElementChild.remove();
          draft = parse(m, draft);
          fill(draft);
          const got = [['Khu vực', draft.district ? `${draft.district}, ${province(draft.province).short}` : draft.province && province(draft.province).name], ['Mục tiêu', draft.target && target(draft.target).name], ['Ca', draft.shift && shift(draft.shift).name], ['Lương', draft.salaryMin && `${draft.salaryMin}${draft.salaryMax !== draft.salaryMin ? ' – ' + draft.salaryMax : ''} triệu`], ['Chế độ', [draft.housing && 'Bao ở', draft.meals && 'Bao ăn'].filter(Boolean).join(', ')], ['Địa chỉ', draft.address]].filter(([, v]) => v);
          const miss = ASK.find(([k]) => !draft[k]);
          const risks = riskCheck(draft);
          say('msg-bot', `<b>Đã điền</b>${got.length ? `<dl>${got.map(([k, v]) => `<dt>${k}</dt><dd>${esc(String(v))}</dd>`).join('')}</dl>` : 'Chưa nhận ra thông tin nào.'}
            ${risks.length ? `<p style="margin:8px 0 0;color:var(--signal)"><b style="color:inherit">Cần xem lại</b>${esc(risks[0])}</p>` : ''}
            <p style="margin:8px 0 0">${miss ? esc(miss[1]) : 'Đủ thông tin rồi. Anh/chị xem lại form bên cạnh rồi bấm <b style="display:inline;color:inherit;letter-spacing:0;text-transform:none;font-size:inherit">Gửi duyệt</b>.'}</p>`);
        }, 700);
      });
      const showRisk = () => {
        const r = riskCheck(Object.fromEntries(new FormData(jf)));
        $('#risk', root).innerHTML = r.length ? `<div class="risk hi"><h4>${icon('alert')}Tin sẽ được kiểm duyệt thủ công</h4><ul>${r.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : jf.title.value ? `<div class="risk lo"><h4>${icon('shield')}Không thấy dấu hiệu rủi ro</h4></div>` : '';
        return r;
      };
      jf.province.addEventListener('change', () => (jf.district.innerHTML = districtOpts(jf.province.value)));
      jf.addEventListener('input', showRisk);
      const save = (status) => {
        const f = Object.fromEntries(new FormData(jf));
        const risks = riskCheck(f);
        const j = { id: Date.now() % 1e7, title: f.title, company: CO, province: f.province, district: f.district, address: f.address, target: f.target, shift: f.shift, qty: Number(f.qty) || 1, salaryMin: Number(f.salaryMin), salaryMax: Number(f.salaryMax) || Number(f.salaryMin), housing: !!f.housing, meals: !!f.meals, urgent: !!f.urgent, tier: f.urgent ? 'urgent' : 'normal', posted: 0, daysLeft: 30, views: 0, calls: 0, age: 'Theo mô tả', height: 'Theo mô tả', desc: f.desc, risks, status: status === 'draft' ? 'draft' : risks.length ? 'pending' : 'live' };
        store.set('myJobs', [j, ...store.get('myJobs', [])]);
        toast(j.status === 'live' ? 'Tin đã được duyệt tự động và đang hiển thị.' : j.status === 'pending' ? 'Tin cần kiểm duyệt thủ công, thường xong trong 2 giờ.' : 'Đã lưu nháp.');
        go('/nha-tuyen-dung/tin-dang');
      };
      jf.addEventListener('submit', (e) => { e.preventDefault(); save('submit'); });
      $('#draft', root).addEventListener('click', () => { if (!jf.title.value) { toast('Cần có tiêu đề để lưu nháp.', 'alert'); return; } save('draft'); });
      showRisk();
    }

    /* Tin đã đăng */
    root.addEventListener('click', (e) => {
      const rn = e.target.closest('[data-renew]');
      const hd = e.target.closest('[data-hide]');
      const ul = e.target.closest('[data-unlock]');
      const by = e.target.closest('[data-buy]');
      if (rn) {
        const list = store.get('myJobs', []);
        const j = list.find((x) => String(x.id) === rn.dataset.renew);
        if (j) { j.daysLeft = 30; if (j.status === 'off' || j.status === 'soon') j.status = 'live'; store.set('myJobs', list); reload(); }
        toast('Đã gia hạn thêm 30 ngày.');
      }
      if (hd) {
        const list = store.get('myJobs', []);
        const j = list.find((x) => String(x.id) === hd.dataset.hide);
        j.status = j.status === 'hidden' ? 'live' : 'hidden';
        store.set('myJobs', list);
        toast(j.status === 'hidden' ? 'Đã ẩn tin.' : 'Tin đã hiển thị lại.');
        reload();
      }
      if (ul) {
        if (points < 1) { toast('Hết điểm. Mua thêm trong mục Gói & thanh toán.', 'alert'); return; }
        store.set('points', points - 1);
        store.set('unlocked', [...store.get('unlocked', []), Number(ul.dataset.unlock)]);
        toast('Đã mở số. Còn ' + (points - 1) + ' điểm.');
        reload();
      }
      if (by) checkout(by.dataset.buy, reload);
    });

    $('#near', root)?.addEventListener('submit', (e) => {
      e.preventDefault();
      const r = Number(e.target.r.value);
      $$('.person', root).forEach((p) => (p.hidden = Number(p.dataset.km) > r));
      toast(`${$$('.person:not([hidden])', root).length} ứng viên trong bán kính ${r} km.`, 'pin');
    });

    $('#vf', root)?.addEventListener('submit', (e) => { e.preventDefault(); store.set('verify', 'pending'); toast('Đã gửi hồ sơ xác thực. Kết quả trong 1 ngày làm việc.'); reload(); });

    /* ATS */
    const move = (id, st) => {
      const it = ats.find((x) => String(x.id) === String(id));
      if (!it || it.status === st) return;
      it.status = st;
      store.set('ats', ats);
      toast(`${it.name} → ${STAGES.find((s) => s[0] === st)[1]}`);
      reload();
    };
    $$('[data-move]', root).forEach((s) => s.addEventListener('change', () => move(s.dataset.move, s.value)));
    $$('.cand', root).forEach((cd) => cd.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', cd.dataset.id)));
    $$('.ats-col', root).forEach((col) => {
      col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drop'); });
      col.addEventListener('dragleave', () => col.classList.remove('drop'));
      col.addEventListener('drop', (e) => { e.preventDefault(); col.classList.remove('drop'); move(e.dataTransfer.getData('text/plain'), col.dataset.col); });
    });
  }

  return { nav: 'employer', html, mount, title: tabs.find((t) => t[0] === tab)[1] + ' – Nhà tuyển dụng', noindex: true };
}

function districtOpts(p, sel) {
  const pv = V.provinces.find((x) => x.slug === p);
  return pv ? `<option value="">Chọn</option>${pv.districts.map((d) => `<option ${d === sel ? 'selected' : ''}>${esc(d)}</option>`).join('')}` : '<option value="">Chọn tỉnh trước</option>';
}

function qrSvg(seed) {
  let s = [...seed].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0;
  const rnd = () => ((s = (s * 1103515245 + 12345) >>> 0) / 2 ** 32);
  const n = 25;
  const finder = (x, y) => [[0, 0], [n - 7, 0], [0, n - 7]].some(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
  const fill = (x, y) => { const [a, b] = [[0, 0], [n - 7, 0], [0, n - 7]].find(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7); const dx = x - a, dy = y - b; return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4); };
  let r = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (finder(x, y) ? fill(x, y) : rnd() > 0.52) r += `M${x} ${y}h1v1h-1z`;
  return `<svg class="qr" viewBox="0 0 ${n} ${n}" role="img" aria-label="Mã QR chuyển khoản"><path d="${r}" fill="#0d1530"/></svg>`;
}

function checkout(id, done) {
  const p = id === 'points' ? { name: 'Gói 50 điểm', price: 450000 } : V.packages.find((x) => x.id === id);
  const code = 'VLBV' + String(Date.now()).slice(-6);
  const box = modal(`
    <h2>Thanh toán ${esc(p.name)}</h2>
    <p class="mute">Số tiền <b style="color:var(--ink)">${money(p.price)}</b> · Nội dung chuyển khoản <b style="color:var(--ink)">${code}</b></p>
    <div class="pay-tabs" role="radiogroup" aria-label="Phương thức">${['QR ngân hàng', 'VNPay', 'MoMo'].map((m, i) => `<label class="pill"><input type="radio" name="pm" value="${m}" ${i ? '' : 'checked'}><span>${m}</span></label>`).join('')}</div>
    <div id="pmBody" style="text-align:center">${qrSvg(code)}<p class="mute" style="font-size:14px">Quét bằng app ngân hàng bất kỳ. Gói kích hoạt tự động khi nhận tiền.</p></div>
    <div class="form-foot"><button class="btn btn-quiet" data-close>Hủy</button><button class="btn btn-primary" id="paid">Tôi đã thanh toán</button></div>`);
  $$('input[name=pm]', box).forEach((r) => r.addEventListener('change', () => {
    $('#pmBody', box).innerHTML = r.value === 'QR ngân hàng' ? `${qrSvg(code)}<p class="mute" style="font-size:14px">Quét bằng app ngân hàng bất kỳ.</p>` : `<p style="padding:28px 0">Bạn sẽ được chuyển sang cổng <b>${r.value}</b> để thanh toán.<br><span class="mute">Bản mẫu: không có giao dịch thật.</span></p>`;
  }));
  $('#paid', box).addEventListener('click', () => {
    const inv = store.get('invoices', [{ no: 'HD-2026-0981', item: 'Gói VIP · 1 tin', amount: 299000, date: '02/11/2026' }, { no: 'HD-2026-0742', item: '50 điểm xem hồ sơ', amount: 450000, date: '18/10/2026' }]);
    inv.unshift({ no: 'HD-2026-' + code.slice(-4), item: p.name, amount: p.price, date: new Date().toLocaleDateString('vi-VN') });
    store.set('invoices', inv);
    if (id === 'points') store.set('points', store.get('points', 20) + 50);
    closeModal();
    toast('Thanh toán thành công. Hóa đơn đã được tạo.');
    done();
  });
}
