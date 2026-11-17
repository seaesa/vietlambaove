import { V, $, $$, esc, icon, url, jobRow, adRow, activeJobs, province, shift, target, districtBySlug, crumbs, SITE, company } from '../core.js';
import { go } from '../router.js';

const PAY = [['', 'Mọi mức lương'], ['duoi-8', 'Dưới 8 triệu'], ['8-10', '8 – 10 triệu'], ['10-15', '10 – 15 triệu'], ['tren-15', 'Trên 15 triệu']];
const payTest = { 'duoi-8': (j) => j.salaryMin < 8, '8-10': (j) => j.salaryMax >= 8 && j.salaryMin <= 10, '10-15': (j) => j.salaryMax >= 10 && j.salaryMin <= 15, 'tren-15': (j) => j.salaryMax > 15 };
const SORT = [['moi', 'Mới nhất'], ['luong', 'Lương cao nhất'], ['han', 'Sắp hết hạn']];
const PER = 8;
const list = (q, k) => (q.get(k) || '').split(',').filter(Boolean);

function filterJobs(all, s) {
  let r = all.filter((j) =>
    (!s.tinh || j.province === s.tinh) &&
    (!s.quan || j.district === s.quan) &&
    (!s.luong || payTest[s.luong]?.(j)) &&
    (!s.ca.length || s.ca.includes(j.shift)) &&
    (!s.mt.length || s.mt.includes(j.target)) &&
    (!s.cd.includes('o') || j.housing) &&
    (!s.cd.includes('an') || j.meals) &&
    (!s.gap || j.urgent) &&
    (!s.q || (j.title + ' ' + j.district + ' ' + company(j.company).name).toLowerCase().includes(s.q.toLowerCase()))
  );
  const vip = (j) => (j.tier === 'vip' ? 0 : 1);
  if (s.sx === 'luong') r.sort((a, b) => b.salaryMax - a.salaryMax);
  else if (s.sx === 'han') r.sort((a, b) => a.daysLeft - b.daysLeft);
  else r.sort((a, b) => vip(a) - vip(b) || a.posted - b.posted);
  return r;
}

function buildHref(s, page = 1) {
  const q = new URLSearchParams();
  if (s.q) q.set('q', s.q);
  if (s.luong) q.set('luong', s.luong);
  if (s.ca.length) q.set('ca', s.ca.join(','));
  if (s.mt.length) q.set('muc-tieu', s.mt.join(','));
  if (s.cd.length) q.set('che-do', s.cd.join(','));
  if (s.gap) q.set('gap', '1');
  if (s.sx && s.sx !== 'moi') q.set('sap-xep', s.sx);
  if (page > 1) q.set('trang', page);
  const qs = q.toString().replace(/%2C/g, ',');
  return url.area(s.tinh, s.quan) + (qs ? '?' + qs : '');
}

export default function ({ params: [ps, ds], query }) {
  let near = false;
  if (query.get('gan-toi') && !ps) { ps = 'tp-hcm'; near = true; }
  const p = ps ? province(ps) : null;
  if (ps && !p) return { redirect: '/viec-lam' };
  const d = ds ? districtBySlug(p, ds) : null;
  if (ds && !d) return { redirect: url.area(ps) };

  const s = { tinh: p?.slug || '', quan: d || '', q: query.get('q') || '', luong: query.get('luong') || '', ca: list(query, 'ca'), mt: list(query, 'muc-tieu'), cd: list(query, 'che-do'), gap: query.get('gap') === '1', sx: query.get('sap-xep') || 'moi' };
  const all = activeJobs();
  const res = filterJobs(all, s);
  const pages = Math.max(1, Math.ceil(res.length / PER));
  const page = Math.min(pages, Math.max(1, Number(query.get('trang')) || 1));
  const shown = res.slice((page - 1) * PER, page * PER);

  // Tiêu đề SEO theo bộ lọc
  const place = d ? `${d}, ${p.name}` : p ? p.name : 'toàn quốc';
  const what = (s.mt.length === 1 ? ' ' + target(s.mt[0]).name.toLowerCase() : '') + (s.ca.length === 1 ? ', ' + shift(s.ca[0]).name.toLowerCase() : '');
  const h1 = s.gap ? `Việc bảo vệ tuyển gấp${what} tại ${place}` : `Việc làm bảo vệ${what} tại ${place}`;
  const base = d ? res : filterJobs(all, { ...s, quan: '' });

  const cnt = (fn) => base.filter(fn).length;
  const chk = (name, val, label, on, n) => `<label class="check"><input type="checkbox" name="${name}" value="${val}" ${on ? 'checked' : ''}>${label}${n !== undefined ? `<em>${n}</em>` : ''}</label>`;

  const chips = [];
  if (s.q) chips.push(['q', `"${s.q}"`]);
  if (s.luong) chips.push(['luong', PAY.find((x) => x[0] === s.luong)[1]]);
  s.ca.forEach((c) => chips.push(['ca:' + c, shift(c).name]));
  s.mt.forEach((m) => chips.push(['mt:' + m, target(m).name]));
  if (s.cd.includes('o')) chips.push(['cd:o', 'Bao ở']);
  if (s.cd.includes('an')) chips.push(['cd:an', 'Bao ăn']);
  if (s.gap) chips.push(['gap', 'Tuyển gấp']);

  const sal = res.length ? [Math.min(...res.map((j) => j.salaryMin)), Math.max(...res.map((j) => j.salaryMax))] : null;
  const crumb = [['Trang chủ', '/'], ['Việc làm', p ? '/viec-lam' : null]];
  if (p) crumb.push([p.name, d ? url.area(p.slug) : null]);
  if (d) crumb.push([d, null]);

  const html = `
  <div class="phead"><div class="wrap">
    ${crumbs(crumb)}
    <h1>${esc(h1)}</h1>
    <p>${res.length ? `${res.length} tin đang tuyển${sal ? `, lương từ ${String(sal[0]).replace('.', ',')} đến ${String(sal[1]).replace('.', ',')} triệu/tháng` : ''}.` : 'Chưa có tin phù hợp với bộ lọc.'}${near ? ' Đang hiển thị theo vị trí gần đúng của bạn (TP.HCM).' : ''}</p>
  </div></div>

  <div class="wrap listing">
    <form class="filters" id="filters" aria-label="Bộ lọc">
      <div class="filters-head"><b>Bộ lọc</b><button class="btn btn-quiet btn-s" type="button" data-fclose>${icon('x')}Đóng</button></div>
      <div class="fgroup"><b>Từ khóa</b><input class="input" name="q" value="${esc(s.q)}" placeholder="Tên công ty, khu vực…"></div>
      <div class="fgroup"><b>Khu vực</b>
        <select class="select" name="tinh"><option value="">Toàn quốc</option>${V.provinces.map((x) => `<option value="${x.slug}" ${x.slug === s.tinh ? 'selected' : ''}>${x.name}</option>`).join('')}</select>
        ${p ? `<ul class="dlist">${p.districts.map((x) => { const n = base.filter((j) => j.district === x).length; return `<li><a href="${buildHref({ ...s, quan: x === d ? '' : x })}" class="${x === d ? 'on' : ''}">${esc(x)}<em>${n}</em></a></li>`; }).join('')}</ul>` : ''}
      </div>
      <div class="fgroup"><b>Mức lương</b>${PAY.map(([v, t]) => `<label class="check"><input type="radio" name="luong" value="${v}" ${v === s.luong ? 'checked' : ''}>${t}</label>`).join('')}</div>
      <div class="fgroup"><b>Ca làm</b>${V.shifts.map((x) => chk('ca', x.id, x.name, s.ca.includes(x.id), cnt((j) => j.shift === x.id))).join('')}</div>
      <div class="fgroup"><b>Loại mục tiêu</b>${V.targets.map((x) => chk('mt', x.id, x.name, s.mt.includes(x.id), cnt((j) => j.target === x.id))).join('')}</div>
      <div class="fgroup"><b>Chế độ</b>${chk('cd', 'o', 'Bao ở', s.cd.includes('o'), cnt((j) => j.housing))}${chk('cd', 'an', 'Bao ăn', s.cd.includes('an'), cnt((j) => j.meals))}${chk('gap', '1', 'Chỉ tin tuyển gấp', s.gap, cnt((j) => j.urgent))}</div>
      <div class="filters-apply"><button class="btn btn-primary btn-block btn-l" type="submit" id="fapply">Xem ${res.length} việc</button></div>
    </form>

    <div>
      <div class="list-bar">
        <p><b>${res.length}</b> việc${pages > 1 ? ` · trang ${page}/${pages}` : ''}</p>
        <div class="list-tools">
          <button class="btn btn-quiet btn-s ftoggle" type="button" data-fopen>${icon('filter')}Bộ lọc${chips.length ? ` (${chips.length})` : ''}</button>
          <label class="sr" for="sx">Sắp xếp</label>
          <select class="select" id="sx">${SORT.map(([v, t]) => `<option value="${v}" ${v === s.sx ? 'selected' : ''}>${t}</option>`).join('')}</select>
        </div>
      </div>
      ${chips.length ? `<div class="active-f">${chips.map(([k, t]) => `<button type="button" data-unset="${k}" aria-label="Bỏ lọc ${esc(t)}">${esc(t)}${icon('x', 'ico-s')}</button>`).join('')}<button type="button" data-unset="*">Xóa tất cả</button></div>` : ''}
      <div class="jlist">
        ${shown.length ? shown.map((j, i) => jobRow(j) + (i === 4 ? adRow(page) : '')).join('') : `<div class="empty"><h3>Không có tin phù hợp</h3><p class="mute">Bỏ bớt điều kiện lọc hoặc xem khu vực lân cận.</p><p><a class="btn btn-line" href="${url.area(s.tinh)}">Bỏ bộ lọc</a></p></div>`}
      </div>
      ${pages > 1 ? `<nav class="pager" aria-label="Phân trang">${Array.from({ length: pages }, (_, i) => i + 1).map((n) => (n === page ? `<span class="on" aria-current="page">${n}</span>` : `<a href="${buildHref(s, n)}">${n}</a>`)).join('')}</nav>` : ''}

      <section class="seo-text">
        <div>
          <h2>Làm bảo vệ ở ${esc(d || p?.name || 'các tỉnh thành')}</h2>
          ${seoIntro(p, d, base)}
        </div>
        <div>
          <h2>${p ? 'Khu vực lân cận' : 'Tìm theo tỉnh thành'}</h2>
          <ul class="linkcloud">${(p ? p.districts.filter((x) => x !== d).map((x) => `<li><a href="${url.area(p.slug, x)}">Bảo vệ ${esc(x)}</a></li>`) : V.provinces.map((x) => `<li><a href="${url.area(x.slug)}">Việc bảo vệ ${x.name}</a></li>`)).join('')}
          ${V.targets.map((t) => `<li><a href="${url.area(s.tinh, s.quan)}?muc-tieu=${t.id}">${t.name}</a></li>`).join('')}</ul>
        </div>
      </section>
    </div>
  </div>`;

  function mount(root) {
    const form = $('#filters', root);
    const wide = matchMedia('(min-width: 961px)');
    const read = () => {
      const f = new FormData(form);
      const tinh = f.get('tinh') || '';
      return { tinh, quan: tinh === s.tinh ? s.quan : '', q: (f.get('q') || '').trim(), luong: f.get('luong') || '', ca: f.getAll('ca'), mt: f.getAll('mt'), cd: f.getAll('cd'), gap: !!f.get('gap'), sx: s.sx };
    };
    const apply = () => go(buildHref(read()), { replace: true, keepScroll: true });
    form.addEventListener('change', (e) => {
      if (e.target.name === 'q') return;
      if (wide.matches) apply();
      else $('#fapply', root).textContent = `Xem ${filterJobs(all, read()).length} việc`;
    });
    form.addEventListener('submit', (e) => { e.preventDefault(); form.classList.remove('open'); apply(); });
    form.q.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); apply(); } });
    $('#sx', root).addEventListener('change', (e) => go(buildHref({ ...s, sx: e.target.value }), { replace: true, keepScroll: true }));
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-fopen]')) form.classList.add('open');
      if (e.target.closest('[data-fclose]')) form.classList.remove('open');
      const u = e.target.closest('[data-unset]');
      if (!u) return;
      const k = u.dataset.unset;
      const n = { ...s, ca: [...s.ca], mt: [...s.mt], cd: [...s.cd] };
      if (k === '*') Object.assign(n, { q: '', luong: '', ca: [], mt: [], cd: [], gap: false });
      else if (k === 'q' || k === 'luong') n[k] = '';
      else if (k === 'gap') n.gap = false;
      else { const [g, v] = k.split(':'); n[g] = n[g].filter((x) => x !== v); }
      go(buildHref(n), { replace: true, keepScroll: true });
    });
  }

  const bc = crumb.map(([name, h], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + (h || url.area(s.tinh, s.quan)) }));
  const filtered = s.q || s.luong || s.ca.length > 1 || s.mt.length > 1 || s.cd.length || page > 1 || s.sx !== 'moi';
  return {
    nav: s.gap ? 'urgent' : 'jobs',
    title: h1 + (page > 1 ? ` – Trang ${page}` : ''),
    desc: `${res.length} tin tuyển bảo vệ tại ${place}. Lương, ca làm, chỗ ở ghi rõ; công ty đã xác thực giấy phép. Ứng tuyển miễn phí.`,
    canonical: filtered ? url.area(s.tinh, s.quan) : undefined,
    noindex: !!s.q,
    html, mount,
    ld: { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: bc }
  };
}

function seoIntro(p, d, jobs) {
  if (!jobs.length) return `<p>Hiện chưa có tin tuyển dụng ở khu vực này. Bật thông báo trong <a href="/ung-vien/thong-bao">tài khoản ứng viên</a> để được báo khi có việc mới.</p>`;
  const avgMin = (jobs.reduce((a, j) => a + j.salaryMin, 0) / jobs.length).toFixed(1).replace('.', ',');
  const avgMax = (jobs.reduce((a, j) => a + j.salaryMax, 0) / jobs.length).toFixed(1).replace('.', ',');
  const byShift = V.shifts.map((x) => [x.name.toLowerCase(), jobs.filter((j) => j.shift === x.id).length]).filter((x) => x[1]).sort((a, b) => b[1] - a[1]);
  const housing = jobs.filter((j) => j.housing).length;
  const where = d ? `${d} (${p.name})` : p ? p.name : 'các tỉnh thành';
  return `<p>Lương bảo vệ tại ${esc(where)} hiện dao động trung bình ${avgMin}–${avgMax} triệu đồng/tháng. Phổ biến nhất là ${byShift.slice(0, 2).map((x) => x[0]).join(' và ')}; ${housing} trên ${jobs.length} tin có hỗ trợ chỗ ở cho người ở xa.</p>
  <p>Trước khi nhận việc, hãy hỏi rõ ngày trả lương, có đóng BHXH không và ai cấp đồng phục. Công ty bảo vệ hợp pháp không thu tiền của người lao động dưới bất kỳ hình thức nào.</p>`;
}
