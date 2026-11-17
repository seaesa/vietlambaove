import { V, $, $$, esc, icon, store, toast, deskNav, url, pay, num, money, company, province, modal, closeModal } from '../core.js';
import { go } from '../router.js';

const QUEUE = [
  { id: 9001, title: 'Tuyển gấp 30 bảo vệ, lương 22 triệu, đóng phí đồng phục 850k', company: 'sao-viet', province: 'tp-hcm', district: 'Quận 12', salaryMin: 18, salaryMax: 22, risks: ['Thu phí đồng phục 850.000đ', 'Lương cao bất thường'], score: 92, at: '10 phút trước' },
  { id: 9002, title: 'Bảo vệ siêu thị Gò Vấp, ca 12 tiếng', company: 'hai-au', province: 'tp-hcm', district: 'Gò Vấp', salaryMin: 8, salaryMax: 9, risks: ['Thiếu địa chỉ mục tiêu'], score: 41, at: '35 phút trước' },
  { id: 9003, title: 'Bảo vệ kho lạnh KCN Tân Uyên – nhận cọc giữ chỗ 500k', company: 'sao-viet', province: 'binh-duong', district: 'Tân Uyên', salaryMin: 9, salaryMax: 10, risks: ['Có nội dung đặt cọc'], score: 88, at: '1 giờ trước' }
];
const REPORTS = [
  { job: 108, reason: 'Thu tiền đồng phục khi đến phỏng vấn', by: '0912 *** 418', at: 'Hôm nay', n: 3 },
  { job: 104, reason: 'Gọi không ai nghe máy', by: '0868 *** 102', at: 'Hôm qua', n: 1 },
  { job: 112, reason: 'Lương thực tế thấp hơn tin đăng', by: '0977 *** 551', at: '2 ngày trước', n: 2 }
];

export default function ({ params: [tab = ''] }) {
  const mine = store.get('myJobs', []).filter((j) => j.status === 'pending');
  const done = store.get('adminDone', []);
  const queue = [...mine.map((j) => ({ ...j, score: 70, at: 'Vừa gửi' })), ...QUEUE].filter((j) => !done.includes(j.id));
  const reports = REPORTS.filter((r) => !done.includes('r' + r.job));
  const tabs = [['', 'Thống kê', 'chart'], ['duyet-tin', 'Duyệt tin', 'check', queue.length || ''], ['bao-cao', 'Báo cáo vi phạm', 'flag', reports.length || ''], ['nguoi-dung', 'Người dùng & công ty', 'users'], ['danh-muc', 'Danh mục', 'list'], ['quang-cao', 'Gói & quảng cáo', 'card'], ['blog-ai', 'Viết blog AI', 'sparkle']];
  if (!tabs.some((t) => t[0] === tab)) return { redirect: '/quan-tri' };

  const views = {
    '': () => {
      const rev = [38, 44, 41, 56, 62, 71, 68, 83, 79, 94, 102, 118];
      const max = Math.max(...rev);
      return `
      <div class="desk-title"><div><h1>Thống kê</h1><p>Tháng 11/2026</p></div></div>
      <div class="kpis">
        <div><span>Tin đang hiển thị</span><b>${num(5240)}</b><small><span class="up">+312</span> tháng này</small></div>
        <div><span>Ứng viên</span><b>${num(48120)}</b><small><span class="up">+6,4%</span></small></div>
        <div><span>Công ty xác thực</span><b>${V.companies.filter((c) => c.verified).length * 61}</b><small>${queue.length} tin chờ duyệt</small></div>
        <div><span>Doanh thu</span><b>118tr</b><small><span class="up">+15%</span> so với tháng 10</small></div>
      </div>
      <div class="two">
        <section class="panel"><div class="panel-h"><h2>Doanh thu 12 tháng (triệu)</h2></div>
          <div class="bars">${rev.map((v) => `<div><span>${v}</span><i style="height:${(v / max) * 100}%"></i></div>`).join('')}</div>
          <div class="bars-x">${rev.map((_, i) => `<span>${i + 1}</span>`).join('')}</div>
        </section>
        <section class="panel"><div class="panel-h"><h2>Tin theo khu vực</h2></div>
          <div class="tbl-wrap"><table class="tbl"><tbody>${V.provinces.map((p, i) => `<tr><td>${p.name}</td><td class="num"><b>${num([1840, 1120, 860, 610, 420, 390][i] || 100)}</b></td></tr>`).join('')}</tbody></table></div>
        </section>
      </div>`;
    },
    'duyet-tin': () => `
      <div class="desk-title"><div><h1>Duyệt tin</h1><p>Sắp theo điểm rủi ro AI. Tin không có cờ được duyệt tự động.</p></div></div>
      ${queue.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tin</th><th>Cờ AI</th><th class="num">Rủi ro</th><th class="num">Quyết định</th></tr></thead><tbody>
        ${queue.sort((a, b) => b.score - a.score).map((j) => `<tr><td><b>${esc(j.title)}</b><br><small class="mute">${esc(company(j.company)?.short || '')} · ${esc(j.district)}, ${esc(province(j.province).short)} · ${pay(j)} triệu · ${j.at}</small></td>
          <td>${(j.risks || []).map((r) => `<span class="tag tag-urgent" style="margin:2px 4px 2px 0">${esc(r)}</span>`).join('') || '<span class="mute">Không</span>'}</td>
          <td class="num"><b class="${j.score > 70 ? 'st-soon' : 'st-wait'}">${j.score}</b></td>
          <td><div class="acts"><button class="btn btn-call btn-s" type="button" data-ok="${j.id}">${icon('check')}Duyệt</button><button class="btn btn-danger btn-s" type="button" data-no="${j.id}">${icon('x')}Từ chối</button></div></td></tr>`).join('')}
      </tbody></table></div>` : '<div class="empty"><h3>Hết tin chờ duyệt</h3><p>Tin mới gửi sẽ hiện ở đây.</p></div>'}`,
    'bao-cao': () => `
      <div class="desk-title"><div><h1>Báo cáo vi phạm</h1><p>Báo cáo từ người dùng. Tin bị báo cáo từ 3 lần tự ẩn chờ xử lý.</p></div></div>
      ${reports.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tin</th><th>Lý do</th><th>Người báo</th><th class="num">Số lần</th><th class="num"></th></tr></thead><tbody>
        ${reports.map((r) => { const j = V.jobs.find((x) => x.id === r.job); return `<tr><td><a href="${url.job(j)}"><b>${esc(j.title)}</b></a><br><small class="mute">${esc(company(j.company).short)} · ${r.at}</small></td><td>${esc(r.reason)}</td><td>${r.by}</td><td class="num"><b class="${r.n >= 3 ? 'st-soon' : ''}">${r.n}</b></td>
          <td><div class="acts"><button class="btn btn-danger btn-s" type="button" data-rep="${r.job}" data-act="Đã gỡ tin và cảnh cáo công ty.">Gỡ tin</button><button class="btn btn-quiet btn-s" type="button" data-rep="${r.job}" data-act="Đã bỏ qua báo cáo.">Bỏ qua</button></div></td></tr>`; }).join('')}
      </tbody></table></div>` : '<div class="empty"><h3>Không còn báo cáo</h3></div>'}`,
    'nguoi-dung': () => `
      <div class="desk-title"><div><h1>Công ty</h1><p>${V.companies.length} công ty · ${V.companies.filter((c) => !c.verified).length} chờ xác thực</p></div></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Công ty</th><th>MST</th><th>Giấy phép</th><th>Trạng thái</th><th class="num"></th></tr></thead><tbody>
        ${V.companies.map((c) => `<tr><td><a href="${url.company(c)}"><b>${esc(c.name)}</b></a></td><td>${esc(c.mst)}</td><td>${esc(c.license)}</td><td>${c.verified ? '<span class="st-live"><b>Đã xác thực</b></span>' : '<span class="st-wait"><b>Chờ duyệt</b></span>'}</td>
          <td><div class="acts">${c.verified ? `<button class="btn btn-quiet btn-s" type="button" data-toast="Đã khóa tài khoản ${esc(c.short)}.">${icon('lock')}Khóa</button>` : `<button class="btn btn-call btn-s" type="button" data-toast="Đã xác thực ${esc(c.short)}.">${icon('check')}Xác thực</button>`}</div></td></tr>`).join('')}
      </tbody></table></div>`,
    'danh-muc': () => `
      <div class="desk-title"><div><h1>Danh mục</h1><p>Dùng cho bộ lọc, URL khu vực và form đăng tin.</p></div></div>
      <div class="two">
        ${[['Loại mục tiêu', V.targets], ['Ca làm', V.shifts]].map(([h, list]) => `<section class="panel"><div class="panel-h"><h2>${h}</h2><button class="btn btn-quiet btn-s" type="button" data-toast="Bản mẫu: thêm mục ở bản chính thức.">${icon('plus')}Thêm</button></div>
          <div class="tbl-wrap"><table class="tbl"><tbody>${list.map((x) => `<tr><td><b>${esc(x.name)}</b></td><td class="mute">${x.id}</td></tr>`).join('')}</tbody></table></div></section>`).join('')}
      </div>
      <section class="panel"><div class="panel-h"><h2>Khu vực</h2></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tỉnh/thành</th><th>URL</th><th class="num">Quận/huyện</th></tr></thead><tbody>${V.provinces.map((p) => `<tr><td><b>${p.name}</b></td><td><a href="${url.area(p.slug)}">${url.area(p.slug)}</a></td><td class="num">${p.districts.length}</td></tr>`).join('')}</tbody></table></div>
      </section>`,
    'quang-cao': () => `
      <div class="desk-title"><div><h1>Gói & quảng cáo</h1><p>Vị trí quảng cáo không được đặt cạnh nút Gọi, Zalo, Ứng tuyển.</p></div></div>
      <section class="panel"><div class="panel-h"><h2>Gói dịch vụ</h2></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Gói</th><th class="num">Giá</th><th class="num">Đã bán tháng này</th></tr></thead><tbody>${V.packages.map((p, i) => `<tr><td><b>${esc(p.name)}</b></td><td class="num">${p.price ? money(p.price) : 'Miễn phí'}</td><td class="num">${[1260, 184, 241, 9][i]}</td></tr>`).join('')}</tbody></table></div>
      </section>
      <section class="panel"><div class="panel-h"><h2>Vị trí quảng cáo</h2></div>
        ${[['Banner trang chủ', 'Khóa PCCC Hà Nội · đến 30/11', true], ['Dòng tài trợ trong danh sách tin', 'Google AdSense · sau tin thứ 4', true], ['Cột phải trang bài viết', 'Đang trống', false], ['Trang chi tiết tin', 'Tắt theo quy định, tránh che nút ứng tuyển', false]].map(([b, s, on]) => `<label class="switch"><span><b>${b}</b><small>${s}</small></span><input type="checkbox" ${on ? 'checked' : ''} data-toast="Đã lưu."></label>`).join('')}
      </section>`,
    'blog-ai': () => `
      <div class="desk-title"><div><h1>Viết blog với AI</h1><p>AI viết nháp từ số liệu tin đăng. Biên tập viên duyệt trước khi đăng.</p></div></div>
      <form class="formcard" id="bf">
        <label class="field" style="margin-bottom:16px"><span>Chủ đề</span><input class="input" name="topic" value="Lương bảo vệ ca đêm ở Bình Dương tháng 11/2026" required></label>
        <div class="grid2"><label class="field"><span>Dữ liệu dùng</span><select class="select"><option>Tin đăng 30 ngày qua</option><option>Toàn bộ tin năm 2026</option></select></label><label class="field"><span>Độ dài</span><select class="select"><option>Khoảng 800 chữ</option><option>Khoảng 1.500 chữ</option></select></label></div>
        <div class="form-foot"><button class="btn btn-primary" type="submit">${icon('sparkle')}Viết nháp</button></div>
      </form>
      <div id="bo"></div>`
  };

  const html = `<div class="wrap desk">${deskNav('/quan-tri', tabs, tab, '<b>Quản trị</b><small>Ban kiểm duyệt</small>')}<div>${views[tab]()}</div></div>`;

  function mount(root) {
    const reload = () => go(location.pathname, { replace: true, keepScroll: true });
    const finish = (id, msg) => { store.set('adminDone', [...store.get('adminDone', []), id]); toast(msg); reload(); };
    root.addEventListener('click', (e) => {
      const ok = e.target.closest('[data-ok]');
      const no = e.target.closest('[data-no]');
      const rp = e.target.closest('[data-rep]');
      if (ok) {
        const id = Number(ok.dataset.ok);
        const list = store.get('myJobs', []);
        const j = list.find((x) => x.id === id);
        if (j) { j.status = 'live'; store.set('myJobs', list); }
        finish(id, 'Đã duyệt. Tin đang hiển thị.');
      }
      if (no) {
        const id = Number(no.dataset.no);
        const box = modal(`<h2>Lý do từ chối</h2><p class="mute">Lý do sẽ gửi cho nhà tuyển dụng.</p><div class="stack">${['Thu phí người lao động', 'Thông tin sai lệch', 'Thiếu địa chỉ mục tiêu', 'Trùng tin'].map((r, i) => `<label class="check"><input type="radio" name="why" value="${r}" ${i ? '' : 'checked'}>${r}</label>`).join('')}</div><div class="form-foot"><button class="btn btn-quiet" data-close>Hủy</button><button class="btn btn-danger" id="rej">Từ chối tin</button></div>`);
        $('#rej', box).addEventListener('click', () => {
          const list = store.get('myJobs', []);
          const j = list.find((x) => x.id === id);
          if (j) { j.status = 'draft'; store.set('myJobs', list); }
          closeModal();
          finish(id, 'Đã từ chối: ' + $('input[name=why]:checked', box).value);
        });
      }
      if (rp) finish('r' + rp.dataset.rep, rp.dataset.act);
    });
    $('#bf', root)?.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = e.target.topic.value;
      const bs = V.jobs.filter((j) => j.province === 'binh-duong');
      $('#bo', root).innerHTML = `<section class="panel" style="margin-top:24px"><div class="panel-h"><h2>Bản nháp</h2><span class="tag tag-vip">Chờ biên tập</span></div>
        <article class="formcard prose"><h2 style="margin-top:0">${esc(t)}</h2>
        <p>Dựa trên ${bs.length} tin đang tuyển tại Bình Dương, lương bảo vệ dao động ${Math.min(...bs.map((j) => j.salaryMin))} – ${Math.max(...bs.map((j) => j.salaryMax))} triệu đồng/tháng. ${bs.filter((j) => j.housing).length} trên ${bs.length} tin có bao ở.</p>
        <p class="mute">[Biên tập viên: kiểm tra số liệu, bổ sung trích dẫn luật về phụ cấp ca đêm trước khi đăng.]</p></article>
        <div class="form-foot"><button class="btn btn-quiet" type="button" data-toast="Đã lưu nháp.">Lưu nháp</button><button class="btn btn-primary" type="button" data-toast="Đã chuyển cho biên tập viên.">Gửi biên tập</button></div></section>`;
    });
  }

  return { nav: '', html, mount, title: tabs.find((t) => t[0] === tab)[1] + ' – Quản trị', noindex: true };
}
