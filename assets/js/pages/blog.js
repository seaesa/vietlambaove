import { V, $, $$, esc, icon, url, num, crumbs } from '../core.js';

export default function ({ query }) {
  const cats = [...new Set(V.posts.map((p) => p.cat))];
  const cur = query.get('chu-de') || '';
  const posts = V.posts.filter((p) => !cur || p.cat === cur);
  const [lead, ...rest] = posts;
  const html = `
  <div class="phead"><div class="wrap">
    ${crumbs([['Trang chủ', '/'], ['Cẩm nang', null]])}
    <h1>Cẩm nang nghề bảo vệ</h1>
    <p>Bảng lương, quyền lợi theo luật, kinh nghiệm phỏng vấn và cách tránh bị lừa phí đồng phục. Viết cho người đang làm hoặc sắp vào nghề.</p>
  </div></div>
  <div class="wrap" style="padding-top:20px">
    <nav class="ttabs" aria-label="Chủ đề">
      <a href="/cam-nang" class="${!cur ? 'on' : ''}">Tất cả</a>
      ${cats.map((c) => `<a href="/cam-nang?chu-de=${encodeURIComponent(c)}" class="${c === cur ? 'on' : ''}">${esc(c)}</a>`).join('')}
    </nav>
    <div class="guides" style="padding-top:32px;border-top:1px solid var(--ink)">
      ${lead ? `<article class="guide-lead">
        <span class="cat">${esc(lead.cat)}</span>
        <h3><a href="${url.post(lead)}">${esc(lead.title)}</a></h3>
        <p>${esc(lead.excerpt)}</p>
        <span class="meta">${lead.date} · ${lead.read} phút đọc · ${num(lead.views)} lượt đọc</span>
      </article>` : ''}
      <ul class="glist">${rest.map((p) => `<li><div><span class="cat">${esc(p.cat)}</span><br><a href="${url.post(p)}">${esc(p.title)}</a><p class="mute" style="margin:4px 0 0;font-size:15px">${esc(p.excerpt)}</p></div><time>${p.date}</time></li>`).join('') || '<li class="mute">Chưa có bài khác trong chủ đề này.</li>'}</ul>
    </div>
  </div>`;
  return { nav: 'blog', html, title: cur ? `${cur} – Cẩm nang bảo vệ` : 'Cẩm nang nghề bảo vệ', desc: 'Bảng lương bảo vệ, quyền lợi theo luật, kinh nghiệm phỏng vấn và cảnh báo lừa đảo.', canonical: cur ? '/cam-nang' : undefined };
}
