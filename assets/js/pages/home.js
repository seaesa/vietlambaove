import { V, $, $$, esc, icon, url, pay, jobRow, adRow, activeJobs, province, SITE } from '../core.js';
import { go } from '../router.js';

export default function () {
  const jobs = activeJobs().sort((a, b) => a.posted - b.posted || (b.tier === 'vip') - (a.tier === 'vip'));
  const urgent = jobs.filter((j) => j.urgent).slice(0, 5);
  const verified = V.companies.filter((c) => c.verified).length;
  const count = (p, d) => jobs.filter((j) => j.province === p && (!d || j.district === d)).length;
  const [lead, ...rest] = V.posts;

  const html = `
  <section class="lead"><div class="wrap">
    <div class="lead-copy">
      <p class="lead-badge">${icon("shield", "ico-s")}100% công ty đã nộp giấy phép kinh doanh dịch vụ bảo vệ</p>
      <h1>Việc làm bảo vệ uy tín, <em>lương rõ ràng</em> gần nơi bạn ở</h1>
      <p class="lead-sub">${jobs.length} việc làm bảo vệ tòa nhà, nhà máy, ngân hàng, sự kiện đang tuyển. Ứng viên không mất bất kỳ khoản phí nào.</p>
      <form class="finder" id="finder" role="search">
        <div class="finder-row">
          <label><span>Khu vực</span><select name="tinh"><option value="">Toàn quốc</option>${V.provinces.map((p) => `<option value="${p.slug}">${p.name}</option>`).join("")}</select></label>
          <label><span>Ca làm</span><select name="ca"><option value="">Mọi ca</option>${V.shifts.map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}</select></label>
          <label><span>Mục tiêu</span><select name="muc-tieu"><option value="">Mọi nơi</option>${V.targets.map((t) => `<option value="${t.id}">${t.name}</option>`).join("")}</select></label>
          <button class="btn btn-gold" type="submit">${icon("search")}Tìm việc</button>
        </div>
        <div class="finder-opt">
          <label class="check"><input type="checkbox" name="o" value="1">Có chỗ ở</label>
          <label class="check"><input type="checkbox" name="gap" value="1">Cần người ngay</label>
          <button class="linkbtn" type="button" id="nearMe">${icon("locate", "ico-s")}Việc gần tôi</button>
        </div>
      </form>
      <ul class="lead-facts">
        <li><b>${jobs.length}</b><span>việc đang tuyển</span></li>
        <li><b>${verified}</b><span>công ty đã xác thực</span></li>
        <li><b>0đ</b><span>phí cho ứng viên</span></li>
      </ul>
    </div>
    <aside class="board" aria-labelledby="boardH">
      <div class="board-head"><h2 id="boardH">${icon("bolt", "ico-s")}Cần người ngay</h2><span>Cập nhật ${new Date().toLocaleDateString("vi-VN")}</span></div>
      <ol>${urgent.map((j) => `<li><a href="${url.job(j)}">
        <span class="b-title">${esc(j.title)}</span>
        <span class="b-place">${icon("pin", "ico-s")}${esc(j.district)}, ${esc(province(j.province).short)}</span>
        <span class="b-pay">${pay(j)} tr</span></a></li>`).join("")}</ol>
      <div class="board-foot"><a class="more" href="/viec-lam?gap=1">Xem ${jobs.filter((j) => j.urgent).length} tin tuyển gấp ${icon("arrow", "ico-s")}</a></div>
    </aside>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><h2>Việc theo khu vực</h2><p>Chọn tỉnh hoặc quận để xem việc gần nơi bạn ở.</p></div><a class="more" href="/viec-lam">Tất cả khu vực ${icon('arrow', 'ico-s')}</a></div>
    <div class="areas">${V.provinces.map((p) => `<div class="area">
      <div class="area-top"><a href="${url.area(p.slug)}">${p.name}</a><span>${count(p.slug)} tin</span></div>
      <ul>${p.districts.slice(0, 6).map((d) => `<li><a href="${url.area(p.slug, d)}">${esc(d)}</a></li>`).join('')}</ul>
    </div>`).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><h2>Tin mới đăng</h2></div><a class="more" href="/viec-lam">Xem ${jobs.length} tin ${icon('arrow', 'ico-s')}</a></div>
    <div class="ttabs" role="tablist" aria-label="Lọc theo mục tiêu">
      <button class="on" role="tab" aria-selected="true" data-t="">Tất cả</button>
      ${V.targets.map((t) => `<button role="tab" aria-selected="false" data-t="${t.id}">${t.name.split(' / ')[0]}</button>`).join('')}
    </div>
    <div class="jlist" id="newList"></div>
  </div></section>

  <section class="sec"><div class="wrap vet">
    <div>
      <div class="sec-head"><div><h2>Một tin tuyển dụng được kiểm tra thế nào</h2></div></div>
      <ol class="steps">
        <li><b>Đối chiếu giấy phép</b><p>Mã số thuế và giấy chứng nhận đủ điều kiện an ninh trật tự được đối chiếu trước khi công ty đăng tin đầu tiên.</p></li>
        <li><b>Quét nội dung bất thường</b><p>Hệ thống đánh dấu các cụm như "phí đồng phục", "đặt cọc", "giữ bằng gốc" và mức lương cao bất thường so với khu vực.</p></li>
        <li><b>Người duyệt xem lại</b><p>Tin bị đánh dấu được giữ ở hàng chờ cho tới khi một kiểm duyệt viên xem và quyết định.</p></li>
        <li><b>Ứng viên báo cáo</b><p>Mỗi tin có nút báo cáo. Ba báo cáo hợp lệ thì tin tự ẩn chờ xử lý.</p></li>
      </ol>
    </div>
    <div class="sheet" aria-label="Ví dụ phiếu kiểm duyệt">
      <div class="sheet-head"><b>Phiếu kiểm duyệt #24-1187</b><span>Tin chờ duyệt</span></div>
      <p class="sheet-q">"Tuyển gấp 20 bảo vệ KCN, lương 18 triệu, nộp 1.500.000đ tiền đồng phục khi nhận việc…"</p>
      <ul>
        <li><span class="ok">${icon('check')}</span><div>Giấy phép ANTT hợp lệ<small>Đối chiếu ngày 03/11/2026</small></div></li>
        <li><span class="no">${icon('x')}</span><div>Thu tiền của người lao động<small>Cụm "nộp 1.500.000đ tiền đồng phục"</small></div></li>
        <li><span class="wait">${icon('alert')}</span><div>Lương cao hơn 85% tin cùng khu vực<small>Trung bình bảo vệ KCN Bình Dương: 8,5–10 triệu</small></div></li>
        <li><span class="ok">${icon('check')}</span><div>Địa chỉ làm việc cụ thể<small>KCN VSIP 1, Thuận An</small></div></li>
      </ul>
      <div class="sheet-foot">Kết quả: giữ lại, yêu cầu công ty sửa nội dung</div>
    </div>
  </div></section>

  <section class="band"><div class="wrap">
    <div>
      <p class="kicker">Dành cho công ty bảo vệ</p>
      <h2>Đăng tin bằng một tin nhắn, nhận cuộc gọi trong ngày.</h2>
      <p>Gõ như khi nhắn Zalo cho đội trưởng. Trợ lý tách ra lương, ca, địa điểm, chỗ ở; thiếu gì sẽ hỏi lại, không tự bịa thông tin.</p>
      <ul>
        <li>${icon('check')}<span>3 tin miễn phí mỗi tháng cho công ty đã xác thực</span></li>
        <li>${icon('check')}<span>Theo dõi ứng viên từ lúc gọi tới lúc nhận đồng phục</span></li>
        <li>${icon('check')}<span>Nhắc gia hạn 3 ngày trước khi tin hết hạn</span></li>
      </ul>
      <div class="band-act"><a class="btn btn-gold btn-l" href="/nha-tuyen-dung/dang-tin">Đăng tin miễn phí</a><a class="btn btn-line btn-l" href="/bang-gia">Xem bảng giá</a></div>
    </div>
    <div class="chat" aria-label="Ví dụ trợ lý đăng tin">
      <div class="chat-head"><b>Trợ lý đăng tin</b><span>Ví dụ</span></div>
      <div class="chat-body">
        <div class="msg msg-me">cần 5 bv chung cư q7, ca 12 tiếng, 8tr5, bao ở, nam dưới 45</div>
        <div class="msg msg-bot"><b>Đã hiểu</b>
          <dl><dt>Vị trí</dt><dd>Bảo vệ chung cư</dd><dt>Khu vực</dt><dd>Quận 7, TP.HCM</dd><dt>Ca</dt><dd>12 tiếng</dd><dt>Lương</dt><dd>8,5 triệu/tháng</dd><dt>Số lượng</dt><dd>5 người</dd><dt>Chế độ</dt><dd>Bao ở</dd></dl>
        </div>
        <div class="msg msg-bot"><b>Cần thêm</b>Ca 12 tiếng là ca ngày, ca đêm hay xoay ca? Địa chỉ chung cư cụ thể ở đâu?</div>
        <div class="msg msg-me">xoay ca, chung cư sunrise city nguyễn hữu thọ</div>
      </div>
    </div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><h2>Cẩm nang nghề bảo vệ</h2></div><a class="more" href="/cam-nang">Tất cả bài viết ${icon('arrow', 'ico-s')}</a></div>
    <div class="guides">
      <article class="guide-lead">
        <span class="cat">${esc(lead.cat)}</span>
        <h3><a href="${url.post(lead)}">${esc(lead.title)}</a></h3>
        <p>${esc(lead.excerpt)}</p>
        <span class="meta">${lead.date} · ${lead.read} phút đọc</span>
      </article>
      <ul class="glist">${rest.map((p) => `<li><div><span class="cat">${esc(p.cat)}</span><br><a href="${url.post(p)}">${esc(p.title)}</a></div><time>${p.date}</time></li>`).join('')}</ul>
    </div>
  </div></section>`;

  function mount(root) {
    const list = $('#newList', root);
    const draw = (t) => {
      const rows = jobs.filter((j) => !t || j.target === t).slice(0, 8);
      list.innerHTML = rows.length
        ? rows.map((j, i) => jobRow(j) + (i === 3 ? adRow(0) : '')).join('')
        : `<div class="empty"><h3>Chưa có tin ở mục này</h3><p class="mute">Thử chọn mục tiêu khác hoặc <a href="/viec-lam">xem tất cả việc</a>.</p></div>`;
    };
    draw('');
    $$('.ttabs button', root).forEach((b) => b.addEventListener('click', () => {
      $$('.ttabs button', root).forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      draw(b.dataset.t);
    }));

    $('#finder', root).addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const q = new URLSearchParams();
      for (const k of ['ca', 'muc-tieu', 'gap']) if (f.get(k)) q.set(k, f.get(k));
      if (f.get('o')) q.set('che-do', 'o');
      go(url.area(f.get('tinh')) + (q.toString() ? '?' + q : ''));
    });
    $('#nearMe', root).addEventListener('click', () => go('/viec-lam?gan-toi=1'));
  }

  return {
    nav: 'home', html, mount,
    ld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Việc Làm Bảo Vệ', url: SITE, potentialAction: { '@type': 'SearchAction', target: SITE + '/viec-lam?q={q}', 'query-input': 'required name=q' } }]
  };
}
