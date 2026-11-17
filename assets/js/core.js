// Hàm dùng chung cho mọi trang
export const V = window.VLBV;

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const SITE = 'https://vieclambaove.vn';
export const company = (id) => V.companies.find((c) => c.id === id);
export const province = (s) => V.provinces.find((p) => p.slug === s);
export const shift = (id) => V.shifts.find((s) => s.id === id);
export const target = (id) => V.targets.find((t) => t.id === id);
export const districtBySlug = (p, ds) => p?.districts.find((d) => slug(d) === ds);

/* ---------- Lưu trữ cục bộ (bản tĩnh thay cho API) ---------- */
export const store = {
  get(k, d = null) { try { const v = localStorage.getItem('vlbv2_' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { localStorage.setItem('vlbv2_' + k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem('vlbv2_' + k); }
};
export const user = () => store.get('user');

/* Tin của nhà tuyển dụng (tạo trong trình duyệt) được gộp vào danh sách chung */
export function allJobs() {
  const mine = store.get('myJobs', []).filter((j) => j.status === 'live');
  return [...mine, ...V.jobs];
}
export const job = (id) => allJobs().find((j) => j.id === Number(id)) || store.get('myJobs', []).find((j) => j.id === Number(id));
export const isExpired = (j) => j.daysLeft < 0;
export const activeJobs = () => allJobs().filter((j) => !isExpired(j));

/* ---------- Định dạng ---------- */
export const num = (n) => Number(n).toLocaleString('vi-VN');
export const money = (n) => (n === 0 ? '0đ' : num(n) + 'đ');
const tr = (n) => String(n).replace('.', ',');
export const pay = (j) => (j.salaryMin === j.salaryMax ? tr(j.salaryMin) : `${tr(j.salaryMin)}–${tr(j.salaryMax)}`);
export const ago = (d) => (d <= 0 ? 'Hôm nay' : d === 1 ? 'Hôm qua' : `${d} ngày trước`);
export const dateIn = (days) => { const t = new Date(); t.setDate(t.getDate() + days); return t.toLocaleDateString('vi-VN'); };

/* ---------- URL sạch ---------- */
export const url = {
  job: (j) => `/tin/${slug(j.title)}-${j.id}`,
  area: (p, d) => '/viec-lam' + (p ? '/' + p : '') + (d ? '/' + slug(d) : ''),
  company: (c) => `/cong-ty/${c.id}`,
  post: (p) => `/cam-nang/${p.id}`
};

/* ---------- Icon (nét mảnh, tự vẽ) ---------- */
const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  locate: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bed: '<path d="M3 18V7M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11" r="2"/>',
  meal: '<path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8a2 2 0 0 1-2 2M17 3c-2 2-2 6 0 8v10"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
  flag: '<path d="M5 21V4h11l-1.5 4L16 12H5"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.6 3.5-5.5 6.5-5.5s5.5 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.8.8 3 2.5 3.5 5.2"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18M7 15h4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  send: '<path d="M21 3 3 10.5l7 3 3 7z"/><path d="m10 13.5 4-4"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V4H4v12h4"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.6-4.5M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5M20 20v-4h-4"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  building: '<path d="M4 21V5l8-2v18M12 8h8v13M2 21h20M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a2 2 0 0 0-2 2 2 2 0 0 0-2-2H4z"/><path d="M12 5v16"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/>',
  google: '<path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5a4.3 4.3 0 0 1-1.9 2.8v2.3h3A9 9 0 0 0 21 12.2z"/><path d="M12 21c2.5 0 4.6-.8 6.1-2.3l-3-2.3c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H3.8v2.4A9 9 0 0 0 12 21z"/><path d="M6.9 13.5a5.4 5.4 0 0 1 0-3.4V7.7H3.8a9 9 0 0 0 0 8.2z"/><path d="M12 6.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6A9 9 0 0 0 3.8 7.7l3.1 2.4C7.6 8.1 9.6 6.6 12 6.6z"/>'
};
export const icon = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

export const mono = (c, cls = '') => `<span class="mono ${cls}" style="background:${c.color}" aria-hidden="true">${c.initials}</span>`;

/* ---------- Dòng tin tuyển dụng ---------- */
export const isSaved = (id) => store.get('saved', []).includes(Number(id));
export function toggleSave(id) {
  id = Number(id);
  const s = store.get('saved', []);
  const i = s.indexOf(id);
  i > -1 ? s.splice(i, 1) : s.unshift(id);
  store.set('saved', s);
  return i === -1;
}

export function jobRow(j) {
  const c = company(j.company);
  const p = province(j.province);
  const off = isExpired(j);
  const chips = [
    `<li>${icon("pin", "ico-s")}${esc(j.district)}, ${esc(p.short)}</li>`,
    `<li>${icon("clock", "ico-s")}${esc(shift(j.shift).name)}</li>`,
    j.housing ? `<li class="hi">${icon("bed", "ico-s")}Bao ở</li>` : "",
    j.meals ? `<li class="hi">${icon("meal", "ico-s")}Bao ăn</li>` : "",
    `<li>${icon("users", "ico-s")}${j.qty} người</li>`
  ].join("");
  const flags = off ? "<span class=\"tag tag-off\">Hết hạn</span>"
    : (j.tier === "vip" ? "<span class=\"tag tag-vip\">VIP</span>" : "") + (j.urgent ? "<span class=\"tag tag-urgent\">Tuyển gấp</span>" : "");
  return `<article class="jrow${j.tier === "vip" && !off ? " is-vip" : ""}${off ? " is-off" : ""}">
    ${mono(c, "j-logo")}
    <div class="j-main">
      <div class="j-flags">${flags}</div>
      <h3><a href="${url.job(j)}">${esc(j.title)}</a></h3>
      <p class="j-co"><span>${esc(c.name)}</span>${c.verified ? `<span class="verified" title="Đã xác thực giấy phép">${icon("shield", "ico-s")}Đã xác thực</span>` : ""}</p>
      <ul class="j-facts">${chips}</ul>
    </div>
    <div class="j-side">
      <div class="j-pay">${pay(j)} <small>triệu/tháng</small></div>
      <time>${ago(j.posted)}</time>
      <button class="savebtn" type="button" data-save="${j.id}" aria-pressed="${isSaved(j.id)}" aria-label="Lưu tin">${icon("bookmark")}</button>
    </div>
  </article>`;
}

export const adRow = (i = 0) => {
  const ads = [
    ['Đồng phục bảo vệ may sẵn', 'giao trong 48 giờ, đủ size, xuất hóa đơn cho công ty.', 'Xem mẫu'],
    ['Bộ đàm Kenwood chính hãng', 'cho đội bảo vệ tòa nhà, bảo hành 24 tháng.', 'Nhận báo giá'],
    ['Khóa huấn luyện nghiệp vụ bảo vệ', 'cấp chứng chỉ, học cuối tuần tại TP.HCM và Hà Nội.', 'Đăng ký']
  ];
  const [b, t, a] = ads[i % ads.length];
  return `<aside class="jrow-ad" aria-label="Quảng cáo"><span class="adlabel">Quảng cáo</span><p><b>${b}</b> – ${t}</p><a href="/bang-gia#quang-cao">${a}</a></aside>`;
};

/* ---------- Toast, modal ---------- */
export function toast(msg, ic = 'check') {
  let box = $('.toasts');
  if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); document.body.append(box); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = icon(ic) + `<span>${esc(msg)}</span>`;
  box.append(t);
  setTimeout(() => t.remove(), 3200);
}

let lastFocus = null;
export function modal(html) {
  closeModal();
  lastFocus = document.activeElement;
  const m = document.createElement('div');
  m.className = 'modal';
  m.innerHTML = `<div class="modal-bg" data-close></div><div class="modal-box" role="dialog" aria-modal="true"><button class="modal-x" type="button" data-close aria-label="Đóng">${icon('x')}</button>${html}</div>`;
  document.body.append(m);
  m.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  (m.querySelector('input, select, textarea, .btn') || m.querySelector('.modal-x')).focus();
  return m.querySelector('.modal-box');
}
export function closeModal() {
  const m = $('.modal');
  if (m) { m.remove(); lastFocus?.focus?.(); }
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); document.dispatchEvent(new Event('vlbv:esc')); } });

/* ---------- Hành động dùng chung: ứng tuyển, báo cáo ---------- */
export function applyJob(id) {
  const j = job(id);
  const u = user();
  const box = modal(`<h2>Ứng tuyển nhanh</h2><p>${esc(j.title)}</p>
    <form class="stack" id="applyForm">
      <label class="field"><span>Họ và tên</span><input class="input" name="name" required autocomplete="name" value="${esc(u?.name || '')}"></label>
      <label class="field"><span>Số điện thoại / Zalo</span><input class="input" name="phone" required inputmode="tel" autocomplete="tel" value="${esc(u?.phone || '')}"></label>
      <div class="grid2">
        <label class="field"><span>Năm sinh</span><input class="input" name="year" inputmode="numeric" placeholder="1990" value="${esc(u?.year || '')}"></label>
        <label class="field"><span>Chiều cao</span><input class="input" name="height" placeholder="1m68" value="${esc(u?.height || '')}"></label>
      </div>
      <p class="mute" style="margin:0;font-size:14px">Nhà tuyển dụng sẽ gọi lại cho bạn. Không công ty nào được thu phí khi nhận hồ sơ.</p>
      <button class="btn btn-primary btn-l" type="submit">Gửi hồ sơ</button>
    </form>`);
  box.querySelector('#applyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const list = store.get('applied', []);
    if (!list.find((a) => a.id === j.id)) list.unshift({ id: j.id, at: new Date().toLocaleDateString('vi-VN'), status: 'Đã gửi' });
    store.set('applied', list);
    if (!u) store.set('profileDraft', f);
    closeModal();
    toast('Đã gửi hồ sơ. Công ty thường gọi lại trong 24 giờ.');
  });
}

export function reportJob(id) {
  const reasons = ['Thu phí đồng phục, phí giữ chỗ', 'Yêu cầu đặt cọc giấy tờ gốc', 'Lương thực tế khác tin đăng', 'Không liên lạc được', 'Tin trùng lặp, sai thông tin', 'Lý do khác'];
  const box = modal(`<h2>Báo cáo tin này</h2><p>Đội kiểm duyệt xem xét trong 24 giờ. Danh tính người báo cáo được giữ kín.</p>
    <form class="stack" id="repForm">
      <div>${reasons.map((r, i) => `<label class="check"><input type="radio" name="r" value="${i}" ${i === 0 ? 'checked' : ''}>${r}</label>`).join('')}</div>
      <label class="field"><span>Mô tả thêm (không bắt buộc)</span><textarea class="textarea" name="note" rows="3"></textarea></label>
      <button class="btn btn-primary" type="submit">Gửi báo cáo</button>
    </form>`);
  box.querySelector('#repForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const r = store.get('reports', []);
    r.unshift({ job: Number(id), reason: reasons[e.target.r.value], at: new Date().toLocaleString('vi-VN') });
    store.set('reports', r);
    closeModal();
    toast('Cảm ơn bạn. Báo cáo đã được ghi nhận.');
  });
}

/* Giao diện tab trong trang quản trị/khu vực cá nhân */
export function deskNav(base, items, active, who) {
  return `<aside class="desk-nav">
    ${who ? `<div class="desk-who">${who}</div>` : ''}
    <nav aria-label="Mục">${items.map(([k, label, ic, badge]) => `<a href="${base}${k ? '/' + k : ''}" class="${k === active ? 'on' : ''}"${k === active ? ' aria-current="page"' : ''}>${icon(ic)}${label}${badge ? `<em>${badge}</em>` : ''}</a>`).join('')}</nav>
  </aside>`;
}

export const crumbs = (items) => `<ol class="crumbs">${items.map(([t, h]) => `<li>${h ? `<a href="${h}">${esc(t)}</a>` : `<span aria-current="page">${esc(t)}</span>`}</li>`).join('')}</ol>`;
