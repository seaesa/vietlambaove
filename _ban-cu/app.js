/* ViecLamBaoVe.vn – script dùng chung: header, footer, icon, job card, lưu tin, toast, modal */
(function () {
  const V = window.VLBV;

  /* ---------- Icons (inline SVG, stroke) ---------- */
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
    bed: '<path d="M3 18V7"/><path d="M3 14h18v4"/><path d="M21 14v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11" r="2"/>',
    meal: '<path d="M7 3v8a2 2 0 0 0 2 2v8"/><path d="M11 3v8a2 2 0 0 1-2 2"/><path d="M17 3c-2 2-2 6 0 8v10"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    heart: '<path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6z"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    shieldcheck: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5.5 5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
    factory: '<path d="M3 21V10l6 4V10l6 4V6h6v15z"/><path d="M7 17h2M12 17h2M17 17h2"/>',
    bank: '<path d="m3 9 9-5 9 5"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    school: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    ai: '<path d="M9.5 3 11 7.5 15.5 9 11 10.5 9.5 15 8 10.5 3.5 9 8 7.5z"/><path d="M18 13l.9 2.6 2.6.9-2.6.9L18 20l-.9-2.6-2.6-.9 2.6-.9z"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    file: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h7z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    logout: '<path d="M15 4h4v16h-4M10 17l5-5-5-5M15 12H3"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    radio: '<rect x="7" y="7" width="10" height="15" rx="2"/><path d="M10 7V2M10 12h4M10 16h4"/>',
    google: '<path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5a4.3 4.3 0 0 1-1.9 2.8v2.3h3A9 9 0 0 0 21 12.2z"/><path d="M12 21a8.9 8.9 0 0 0 6.1-2.2l-3-2.3a5.6 5.6 0 0 1-8.3-2.9H3.7v2.4A9 9 0 0 0 12 21z"/><path d="M6.8 13.6a5.4 5.4 0 0 1 0-3.4V7.8H3.7a9 9 0 0 0 0 8.1z"/><path d="M12 6.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6A9 9 0 0 0 3.7 7.8l3.1 2.4A5.4 5.4 0 0 1 12 6.6z"/>'
  };
  V.icon = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || ''}</svg>`;

  /* ---------- Helpers ---------- */
  V.$ = (s, r = document) => r.querySelector(s);
  V.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  V.qs = (k) => new URLSearchParams(location.search).get(k);
  V.company = (id) => V.companies.find((c) => c.id === id);
  V.province = (slug) => V.provinces.find((p) => p.slug === slug);
  V.shift = (id) => V.shifts.find((s) => s.id === id);
  V.target = (id) => V.targets.find((t) => t.id === id);
  V.job = (id) => V.jobs.find((j) => j.id === +id);
  V.money = (n) => n.toLocaleString('vi-VN') + 'đ';
  V.salary = (j) => (j.salaryMin === j.salaryMax ? `${j.salaryMin}` : `${j.salaryMin} – ${j.salaryMax}`) + ' triệu';
  V.ago = (d) => (d === 0 ? 'Hôm nay' : d === 1 ? 'Hôm qua' : `${d} ngày trước`);
  V.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  V.activeJobs = () => V.jobs.filter((j) => j.daysLeft >= 0);
  V.logo = (c, cls = '') => `<div class="logo-box ${cls}" style="background:${c.color}" aria-hidden="true">${c.initials}</div>`;

  /* ---------- Local state (prototype: lưu trên trình duyệt) ---------- */
  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem('vlbv_' + k)) ?? d; } catch (e) { return d; } },
    set: (k, v) => localStorage.setItem('vlbv_' + k, JSON.stringify(v))
  };
  V.store = store;
  V.isSaved = (id) => store.get('saved', []).includes(id);
  V.toggleSave = (id) => {
    const s = store.get('saved', []);
    const i = s.indexOf(id);
    i > -1 ? s.splice(i, 1) : s.push(id);
    store.set('saved', s);
    V.toast(i > -1 ? 'Đã bỏ lưu tin' : 'Đã lưu tin – xem lại trong Khu vực ứng viên', 'heart');
    return i === -1;
  };
  V.user = () => store.get('user', null);

  /* ---------- Job card ---------- */
  V.jobCard = (j) => {
    const c = V.company(j.company);
    const p = V.province(j.province);
    const saved = V.isSaved(j.id);
    const badges = [
      j.tier === 'vip' ? '<span class="badge badge-vip">' + V.icon('star', 'ico-sm') + ' VIP</span>' : '',
      j.urgent ? '<span class="badge badge-urgent">' + V.icon('bolt', 'ico-sm') + ' Tuyển gấp</span>' : '',
      j.daysLeft < 0 ? '<span class="badge badge-gray">Đã hết hạn</span>' : ''
    ].join('');
    return `<article class="job-card ${j.tier === 'vip' ? 'vip' : ''} ${j.daysLeft < 0 ? 'expired' : ''}">
      ${V.logo(c)}
      <div>
        ${badges ? `<div class="head">${badges}</div>` : ''}
        <h3><a href="chi-tiet.html?id=${j.id}">${V.esc(j.title)}</a></h3>
        <div class="company">${V.esc(c.short)} ${c.verified ? `<span class="vf" title="Đã xác thực">${V.icon('shieldcheck', 'ico-sm')}</span>` : ''}</div>
        <div class="job-meta">
          <span>${V.icon('pin')}${V.esc(j.district)}, ${p.short}</span>
          <span>${V.icon('clock')}${V.shift(j.shift).name}</span>
          ${j.housing || j.meals ? `<span>${V.icon('bed')}${[j.housing && 'Bao ở', j.meals && 'Bao ăn'].filter(Boolean).join(' · ')}</span>` : ''}
          <span>${V.icon('users')}${j.qty} người</span>
        </div>
      </div>
      <div class="job-side">
        <div><div class="salary">${V.salary(j)}<small>/tháng</small></div><div class="time">${V.ago(j.posted)}</div></div>
        <div class="actions">
          <button class="icon-btn ${saved ? 'active' : ''}" data-save="${j.id}" aria-label="Lưu tin">${V.icon('heart')}</button>
          ${j.daysLeft >= 0 ? `<a class="btn btn-call btn-sm" href="tel:${c.phone.replace(/\s/g, '')}">${V.icon('phone', 'ico-sm')} Gọi</a>` : ''}
        </div>
      </div>
    </article>`;
  };

  V.postCard = (p, i) => `<a class="post-card" href="bai-viet.html?id=${p.id}">
    <div class="post-thumb th-${(i % 6) + 1}"><span class="badge badge-navy">${p.cat}</span>${V.icon(['book', 'alert', 'shield', 'chat', 'file', 'star'][i % 6])}</div>
    <div class="body"><h3>${p.title}</h3><p>${p.excerpt}</p>
    <div class="meta"><span>${p.date} · ${p.read} phút đọc</span><span>${p.views.toLocaleString('vi-VN')} lượt đọc</span></div></div></a>`;

  /* ---------- Layout: header / footer / bottom nav ---------- */
  const page = document.body.dataset.page || '';
  const nav = [
    ['index.html', 'home', 'Trang chủ'],
    ['viec-lam.html', 'jobs', 'Tìm việc'],
    ['nha-tuyen-dung.html#dang-tin', 'post', 'Đăng tin AI'],
    ['cam-nang.html', 'blog', 'Cẩm nang'],
    ['bang-gia.html', 'pricing', 'Bảng giá']
  ];
  const brand = `<a class="brand" href="index.html" aria-label="ViecLamBaoVe.vn – Trang chủ">
      <img src="assets/img/logo-shield.webp" width="44" height="45" alt="">
      <span class="brand-text"><span class="w1">VIECLAM</span><span class="w2">BAOVE<small>.vn</small></span></span></a>`;

  function renderLayout() {
    const u = V.user();
    const acct = u
      ? `<a class="btn btn-outline btn-sm hide-md" href="${u.role === 'employer' ? 'nha-tuyen-dung.html' : 'ung-vien.html'}">${V.icon('user', 'ico-sm')} ${V.esc(u.name || 'Tài khoản')}</a>`
      : `<a class="btn btn-ghost btn-sm hide-md" href="dang-nhap.html">Đăng nhập</a>`;
    const header = `
    <div class="topbar"><div class="container">
      <div class="trust">${V.icon('shieldcheck', 'ico-sm')} 100% công ty được xác thực giấy phép ANTT · Không thu phí người lao động</div>
      <div class="hide-sm">Hotline hỗ trợ: <a href="tel:19001234">1900 1234</a></div>
    </div></div>
    <header class="site-header"><div class="container">
      ${brand}
      <nav class="main-nav" aria-label="Điều hướng chính">
        ${nav.map(([h, k, t]) => `<a href="${h}" class="${page === k ? 'active' : ''}">${t}</a>`).join('')}
      </nav>
      <div class="header-actions">
        ${acct}
        <a class="btn btn-primary btn-sm hide-md" href="nha-tuyen-dung.html#dang-tin">${V.icon('ai', 'ico-sm')} Đăng tin tuyển dụng</a>
        <button class="icon-btn menu-toggle" aria-label="Mở menu" data-open-drawer>${V.icon('menu')}</button>
      </div>
    </div></header>
    <div class="mobile-drawer" id="drawer"><div class="backdrop" data-close-drawer></div><div class="panel">
      <div class="row between" style="margin-bottom:10px">${brand}<button class="icon-btn" data-close-drawer aria-label="Đóng">${V.icon('x')}</button></div>
      <a href="index.html">${V.icon('home')} Trang chủ</a>
      <a href="viec-lam.html">${V.icon('search')} Tìm việc làm</a>
      <a href="ung-vien.html">${V.icon('user')} Khu vực ứng viên</a>
      <a href="nha-tuyen-dung.html">${V.icon('briefcase')} Nhà tuyển dụng</a>
      <a href="bang-gia.html">${V.icon('money')} Bảng giá dịch vụ</a>
      <a href="cam-nang.html">${V.icon('book')} Cẩm nang</a>
      <a href="chinh-sach.html">${V.icon('file')} Chính sách & Liên hệ</a>
      <a href="quan-tri.html">${V.icon('settings')} Trang quản trị (demo)</a>
      <div style="margin-top:auto;display:grid;gap:10px;padding-top:16px">
        <a class="btn btn-primary" href="nha-tuyen-dung.html#dang-tin">${V.icon('ai', 'ico-sm')} Đăng tin bằng AI</a>
        <a class="btn btn-outline" href="dang-nhap.html">Đăng nhập / Đăng ký</a>
      </div>
    </div></div>`;
    document.body.insertAdjacentHTML('afterbegin', header);

    const footer = `
    <footer class="site-footer"><div class="container">
      <div class="footer-grid">
        <div>
          ${brand}
          <p style="margin-top:16px;max-width:340px">Nền tảng tuyển dụng chuyên ngành bảo vệ – vệ sĩ. Kết nối trực tiếp ứng viên với công ty bảo vệ đã xác thực, có AI hỗ trợ viết tin trong 1 phút.</p>
          <p class="small">${V.icon('pin', 'ico-sm')} Tầng 8, 123 Nguyễn Văn Linh, Quận 7, TP.HCM<br>${V.icon('phone', 'ico-sm')} 1900 1234 · ${V.icon('mail', 'ico-sm')} hotro@vieclambaove.vn</p>
        </div>
        <div><h4>Việc làm theo khu vực</h4>
          ${V.provinces.slice(0, 5).map((p) => `<a href="viec-lam.html?tinh=${p.slug}">Việc làm bảo vệ tại ${p.name}</a>`).join('')}
        </div>
        <div><h4>Việc làm theo loại</h4>
          <a href="viec-lam.html?ca=dem">Bảo vệ ca đêm</a>
          <a href="viec-lam.html?muc-tieu=ngan-hang">Bảo vệ ngân hàng</a>
          <a href="viec-lam.html?muc-tieu=kcn">Bảo vệ khu công nghiệp</a>
          <a href="viec-lam.html?bao-o=1">Bảo vệ bao ăn ở</a>
          <a href="viec-lam.html?muc-tieu=ve-si">Tuyển vệ sĩ</a>
        </div>
        <div><h4>Về chúng tôi</h4>
          <a href="nha-tuyen-dung.html">Dành cho nhà tuyển dụng</a>
          <a href="bang-gia.html">Bảng giá dịch vụ</a>
          <a href="cam-nang.html">Cẩm nang nghề bảo vệ</a>
          <a href="chinh-sach.html#dieu-khoan">Điều khoản sử dụng</a>
          <a href="chinh-sach.html#bao-mat">Chính sách bảo mật</a>
          <a href="chinh-sach.html#quy-che">Quy chế đăng tin</a>
          <a href="chinh-sach.html#lien-he">Liên hệ</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 ViecLamBaoVe.vn. Bảo mật dữ liệu theo Nghị định 13/2023/NĐ-CP.</span>
        <span>Website không thu bất kỳ khoản phí nào từ người lao động.</span>
      </div>
    </div></footer>
    <nav class="bottom-nav" aria-label="Điều hướng nhanh"><div class="inner">
      <a href="index.html" class="${page === 'home' ? 'active' : ''}">${V.icon('home')}Trang chủ</a>
      <a href="viec-lam.html" class="${page === 'jobs' ? 'active' : ''}">${V.icon('search')}Tìm việc</a>
      <a href="nha-tuyen-dung.html#dang-tin" class="post"><span class="ic">${V.icon('plus')}</span>Đăng tin</a>
      <a href="ung-vien.html#da-luu" class="${page === 'candidate' ? 'active' : ''}">${V.icon('heart')}Đã lưu</a>
      <a href="${u ? 'ung-vien.html' : 'dang-nhap.html'}" class="${page === 'auth' ? 'active' : ''}">${V.icon('user')}Tài khoản</a>
    </div></nav>
    <div class="toast-wrap" id="toasts" aria-live="polite"></div>`;
    document.body.insertAdjacentHTML('beforeend', footer);
  }

  /* ---------- Toast & modal ---------- */
  V.toast = (msg, icon = 'check') => {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = V.icon(icon) + '<span>' + msg + '</span>';
    V.$('#toasts').appendChild(t);
    setTimeout(() => t.remove(), 3200);
  };
  V.modal = (html) => {
    let m = V.$('#modal');
    if (!m) {
      document.body.insertAdjacentHTML('beforeend', '<div class="modal" id="modal" role="dialog" aria-modal="true"><div class="backdrop" data-close-modal></div><div class="dialog"><button class="icon-btn close" data-close-modal aria-label="Đóng">' + V.icon('x') + '</button><div class="content"></div></div></div>');
      m = V.$('#modal');
    }
    m.querySelector('.content').innerHTML = html;
    m.classList.add('open');
    return m;
  };
  V.closeModal = () => V.$('#modal')?.classList.remove('open');

  /* Báo cáo tin lừa đảo */
  V.reportJob = (id) => {
    V.modal(`<h3>${V.icon('flag')} Báo cáo tin tuyển dụng</h3>
      <p class="muted small">Quản trị viên sẽ kiểm tra trong vòng 24 giờ. Thông tin của bạn được giữ bí mật.</p>
      <form id="reportForm" class="stack">
        ${['Thu phí đồng phục / đặt cọc / phí giữ chỗ', 'Lương, chế độ không đúng thực tế', 'Công ty không tồn tại / mạo danh', 'Số điện thoại không liên lạc được', 'Lý do khác'].map((r, i) => `<label class="check"><input type="radio" name="r" ${i === 0 ? 'checked' : ''}> ${r}</label>`).join('')}
        <textarea class="textarea" placeholder="Mô tả thêm (không bắt buộc)"></textarea>
        <button class="btn btn-navy btn-block">Gửi báo cáo</button>
      </form>`);
    V.$('#reportForm').onsubmit = (e) => { e.preventDefault(); V.closeModal(); V.toast('Đã gửi báo cáo tin #' + id + '. Cảm ơn bạn!', 'shieldcheck'); };
  };

  /* Ứng tuyển 1 chạm */
  V.applyJob = (id) => {
    const prof = store.get('profile', null);
    const j = V.job(id);
    if (prof && prof.name) {
      const ap = store.get('applied', []);
      if (!ap.includes(id)) { ap.push(id); store.set('applied', ap); }
      V.toast('Đã gửi hồ sơ nhanh tới ' + V.company(j.company).short, 'send');
      return;
    }
    V.modal(`<h3>Ứng tuyển nhanh</h3><p class="muted small">Chỉ cần 3 thông tin – nhà tuyển dụng sẽ gọi lại cho bạn.</p>
      <form id="quickApply" class="stack">
        <div class="field"><label>Họ và tên</label><input class="input" name="name" required placeholder="VD: Nguyễn Văn An"></div>
        <div class="field"><label>Số điện thoại / Zalo</label><input class="input" name="phone" required inputmode="tel" pattern="[0-9 ]{9,12}" placeholder="09xx xxx xxx"></div>
        <div class="field"><label>Năm sinh</label><input class="input" name="year" inputmode="numeric" placeholder="1990"></div>
        <label class="check small"><input type="checkbox" required> Tôi đồng ý chia sẻ thông tin với nhà tuyển dụng theo <a href="chinh-sach.html#bao-mat" target="_blank">chính sách bảo mật</a></label>
        <button class="btn btn-primary btn-block btn-lg">${V.icon('send', 'ico-sm')} Gửi hồ sơ</button>
      </form>`);
    V.$('#quickApply').onsubmit = (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      store.set('profile', { ...(store.get('profile', {}) || {}), ...f });
      const ap = store.get('applied', []); ap.push(id); store.set('applied', ap);
      V.closeModal();
      V.toast('Đã gửi hồ sơ! Nhà tuyển dụng sẽ liên hệ sớm.', 'send');
    };
  };

  /* ---------- Global events ---------- */
  document.addEventListener('click', (e) => {
    const s = e.target.closest('[data-save]');
    if (s) { e.preventDefault(); const on = V.toggleSave(+s.dataset.save); s.classList.toggle('active', on); return; }
    if (e.target.closest('[data-open-drawer]')) V.$('#drawer').classList.add('open');
    if (e.target.closest('[data-close-drawer]')) V.$('#drawer').classList.remove('open');
    if (e.target.closest('[data-close-modal]')) V.closeModal();
    const r = e.target.closest('[data-report]');
    if (r) V.reportJob(r.dataset.report);
    const a = e.target.closest('[data-apply]');
    if (a) V.applyJob(+a.dataset.apply);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { V.closeModal(); V.$('#drawer')?.classList.remove('open'); } });

  /* Tabs dùng chung: [data-tabs] > button[data-tab] ; panel [data-panel] */
  V.initTabs = (root, onChange) => {
    const btns = V.$$('[data-tab]', root);
    const show = (id) => {
      btns.forEach((b) => b.classList.toggle('active', b.dataset.tab === id));
      V.$$('[data-panel]').forEach((p) => p.classList.toggle('active', p.dataset.panel === id));
      onChange && onChange(id);
    };
    btns.forEach((b) => b.addEventListener('click', () => { show(b.dataset.tab); history.replaceState(null, '', '#' + b.dataset.tab); }));
    const fromHash = () => { const h = location.hash.slice(1); if (btns.some((b) => b.dataset.tab === h)) show(h); };
    window.addEventListener('hashchange', fromHash);
    show(btns[0].dataset.tab); fromHash();
    return show;
  };

  renderLayout();
})();
