import { V, $, $$, esc, icon, store, user, toast, deskNav, job, jobRow, isExpired, url, pay, province, modal, closeModal } from '../core.js';
import { go } from '../router.js';

const EXP = ['Xuất ngũ', 'Công an nghĩa vụ', 'Chứng chỉ PCCC', 'Võ thuật', 'Đã làm bảo vệ', 'Có xe máy', 'Biết vi tính'];

export default function ({ params: [tab = ''] }) {
  const u = user();
  if (!u) return { redirect: '/dang-nhap?tiep=/ung-vien' };
  if (u.role === 'employer') return { redirect: '/nha-tuyen-dung' };
  const p = store.get('profile', { name: u.name, phone: u.phone, exp: [], areas: [] });
  const applied = store.get('applied', []);
  const saved = store.get('saved', []);
  const tabs = [['', 'Hồ sơ của tôi', 'user'], ['da-ung-tuyen', 'Đã ứng tuyển', 'send', applied.length || ''], ['da-luu', 'Việc đã lưu', 'bookmark', saved.length || ''], ['thong-bao', 'Thông báo', 'bell', 2], ['cai-dat', 'Cài đặt', 'settings']];
  if (!tabs.some((t) => t[0] === tab)) return { redirect: '/ung-vien' };

  const done = ['name', 'phone', 'year', 'height', 'area'].filter((k) => p[k]).length + (p.exp.length ? 1 : 0);
  const views = {
    '': () => `
      <div class="desk-title"><div><h1>Hồ sơ nhanh</h1><p>Hoàn thiện ${done}/6 mục. Công ty chỉ thấy số của bạn khi bạn ứng tuyển.</p></div>
        <button class="btn btn-quiet" type="button" id="voice">${icon('mic')}Nói để điền</button></div>
      <form class="formcard" id="pf">
        <div class="grid2">
          <label class="field"><span>Họ tên</span><input class="input" name="name" value="${esc(p.name || '')}" required autocomplete="name"></label>
          <label class="field"><span>Số điện thoại / Zalo</span><input class="input" name="phone" value="${esc(p.phone || '')}" inputmode="tel" autocomplete="tel"></label>
        </div>
        <div class="grid3">
          <label class="field"><span>Năm sinh</span><input class="input" name="year" inputmode="numeric" maxlength="4" value="${esc(p.year || '')}" placeholder="1995"></label>
          <label class="field"><span>Chiều cao (cm)</span><input class="input" name="height" inputmode="numeric" value="${esc(p.height || '')}" placeholder="168"></label>
          <label class="field"><span>Cân nặng (kg)</span><input class="input" name="weight" inputmode="numeric" value="${esc(p.weight || '')}" placeholder="62"></label>
        </div>
        <div class="field" style="margin-bottom:16px"><span>Kinh nghiệm, chứng chỉ</span>
          <div class="pills">${EXP.map((e) => `<label class="pill"><input type="checkbox" name="exp" value="${e}" ${p.exp.includes(e) ? 'checked' : ''}><span>${e}</span></label>`).join('')}</div></div>
        <div class="grid2">
          <label class="field"><span>Muốn làm ở</span><select class="select" name="area"><option value="">Chọn tỉnh/thành</option>${V.provinces.map((x) => `<option value="${x.slug}" ${p.area === x.slug ? 'selected' : ''}>${x.name}</option>`).join('')}</select></label>
          <label class="field"><span>Ca mong muốn</span><select class="select" name="shift"><option value="">Ca nào cũng được</option>${V.shifts.map((s) => `<option value="${s.id}" ${p.shift === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select></label>
        </div>
        <label class="check"><input type="checkbox" name="stay" ${p.stay ? 'checked' : ''}>Cần chỗ ở</label>
        <div class="form-foot"><button class="btn btn-primary" type="submit">Lưu hồ sơ</button></div>
      </form>`,
    'da-ung-tuyen': () => `
      <div class="desk-title"><div><h1>Đã ứng tuyển</h1><p>Công ty thường gọi lại trong 24 giờ.</p></div></div>
      ${applied.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Công việc</th><th>Lương</th><th>Ngày</th><th>Trạng thái</th></tr></thead><tbody>
        ${applied.map((a, i) => { const j = job(a.id); if (!j) return ''; const st = isExpired(j) ? ['st-off', 'Tin đã đóng'] : [['st-wait', 'Đã gửi'], ['st-live', 'Công ty đã xem'], ['st-soon', 'Hẹn phỏng vấn']][i % 3]; return `<tr><td><a href="${url.job(j)}"><b>${esc(j.title)}</b></a><br><small class="mute">${esc(j.district)}, ${esc(province(j.province).short)}</small></td><td><b>${pay(j)}</b> tr</td><td>${esc(a.at || '')}</td><td class="${st[0]}"><b>${st[1]}</b></td></tr>`; }).join('')}
      </tbody></table></div>` : empty('Bạn chưa ứng tuyển việc nào', 'Bấm "Ứng tuyển" ở tin bất kỳ, hồ sơ sẽ gửi tới công ty.')}`,
    'da-luu': () => {
      const js = saved.map(job).filter(Boolean);
      return `<div class="desk-title"><div><h1>Việc đã lưu</h1><p>Tin hết hạn sẽ tự đánh dấu.</p></div></div>
      ${js.length ? `<div class="jlist">${js.map(jobRow).join('')}</div>` : empty('Chưa lưu việc nào', 'Bấm biểu tượng lưu ở mỗi tin để xem lại sau.')}`;
    },
    'thong-bao': () => `
      <div class="desk-title"><div><h1>Thông báo</h1></div><button class="btn btn-quiet btn-s" type="button" data-toast="Đã đánh dấu đọc hết.">Đánh dấu đã đọc</button></div>
      <ul class="notes">
        <li class="unread"><div><b>3 việc mới gần khu bạn chọn</b><p>Bảo vệ tòa nhà, ca 12 tiếng, lương 8,5 – 9,5 triệu.</p></div><time class="mute">2 giờ trước</time></li>
        <li class="unread"><div><b>Công ty Long Hải đã xem hồ sơ của bạn</b><p>Hãy để ý điện thoại, công ty có thể gọi trong hôm nay.</p></div><time class="mute">Hôm qua</time></li>
        <li><div><b>Tin bạn lưu sắp hết hạn</b><p>Còn 3 ngày để ứng tuyển.</p></div><time class="mute">3 ngày trước</time></li>
      </ul>`,
    'cai-dat': () => `
      <div class="desk-title"><div><h1>Cài đặt</h1></div></div>
      <div class="panel"><div class="panel-h"><h2>Nhận thông báo</h2></div>
        ${[['Việc mới gần tôi', 'Qua Zalo, tối đa 1 tin mỗi ngày', true], ['Công ty xem hồ sơ', 'Báo ngay khi có công ty xem', true], ['Tin đã lưu sắp hết hạn', 'Nhắc trước 3 ngày', false]].map(([b, s, on]) => `<label class="switch"><span><b>${b}</b><small>${s}</small></span><input type="checkbox" ${on ? 'checked' : ''} data-toast="Đã lưu cài đặt."></label>`).join('')}
      </div>
      <div class="panel"><div class="panel-h"><h2>Dữ liệu cá nhân</h2></div>
        <p class="mute">Theo Nghị định 13/2023, bạn có quyền tải về hoặc xóa toàn bộ dữ liệu của mình.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-line" type="button" id="export">${icon('download')}Tải dữ liệu của tôi</button><button class="btn btn-danger" type="button" id="del">${icon('trash')}Xóa tài khoản</button></div>
      </div>`
  };

  const html = `<div class="wrap desk">${deskNav('/ung-vien', tabs, tab, `<b>${esc(u.name || 'Ứng viên')}</b><small>${esc(u.phone || 'Tài khoản ứng viên')}</small>`)}<div>${views[tab]()}</div></div>`;

  function mount(root) {
    const pf = $('#pf', root);
    if (pf) {
      pf.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(pf);
        store.set('profile', { ...Object.fromEntries(f), exp: f.getAll('exp'), stay: !!f.get('stay') });
        toast('Đã lưu hồ sơ.');
        go('/ung-vien', { replace: true, keepScroll: true });
      });
      $('#voice', root).addEventListener('click', () => {
        const box = modal(`<h2>Nói để điền hồ sơ</h2><p class="mute">Ví dụ: "Tôi tên Minh, sinh năm 1994, cao 1m70, đã xuất ngũ, muốn làm ở Bình Dương."</p><div class="chat"><div class="chat-body" id="vb"><div class="msg msg-bot"><b>Trợ lý</b>Đang nghe…<span class="typing"><span></span><span></span><span></span></span></div></div></div><div class="form-foot"><button class="btn btn-quiet" data-close>Hủy</button><button class="btn btn-primary" id="vok" disabled>Điền vào hồ sơ</button></div>`);
        setTimeout(() => {
          $('#vb', box).innerHTML = `<div class="msg msg-me">Tôi tên Minh, sinh năm 1994, cao 1m70, đã xuất ngũ, muốn làm ở Bình Dương.</div><div class="msg msg-bot"><b>Đã hiểu</b><dl><dt>Họ tên</dt><dd>Minh</dd><dt>Năm sinh</dt><dd>1994</dd><dt>Chiều cao</dt><dd>170 cm</dd><dt>Kinh nghiệm</dt><dd>Xuất ngũ</dd><dt>Khu vực</dt><dd>Bình Dương</dd></dl></div>`;
          $('#vok', box).disabled = false;
        }, 1400);
        $('#vok', box).addEventListener('click', () => {
          pf.name.value ||= 'Minh'; pf.year.value = '1994'; pf.height.value = '170'; pf.area.value = 'binh-duong';
          $$('input[name=exp]', pf).forEach((c) => { if (c.value === 'Xuất ngũ') c.checked = true; });
          closeModal(); toast('Đã điền. Kiểm tra lại rồi bấm Lưu.');
        });
      });
    }
    $('#export', root)?.addEventListener('click', () => {
      const data = { user: u, profile: store.get('profile', {}), applied, saved };
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })), download: 'du-lieu-cua-toi.json' });
      a.click(); URL.revokeObjectURL(a.href);
    });
    $('#del', root)?.addEventListener('click', () => {
      const box = modal(`<h2>Xóa tài khoản?</h2><p>Hồ sơ, việc đã lưu và lịch sử ứng tuyển sẽ bị xóa vĩnh viễn. Không thể khôi phục.</p><div class="form-foot"><button class="btn btn-quiet" data-close>Giữ lại</button><button class="btn btn-danger" id="delok">Xóa vĩnh viễn</button></div>`);
      $('#delok', box).addEventListener('click', () => { ['user', 'profile', 'applied', 'saved'].forEach(store.del); closeModal(); toast('Đã xóa tài khoản.'); go('/'); });
    });
  }

  return { nav: '', html, mount, title: tabs.find((t) => t[0] === tab)[1], noindex: true };
}

const empty = (h, p) => `<div class="empty"><h3>${h}</h3><p>${p}</p><a class="btn btn-primary" href="/viec-lam">Tìm việc</a></div>`;
