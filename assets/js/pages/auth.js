import { $, $$, icon, store, toast } from '../core.js';
import { go } from '../router.js';

export default function ({ query }) {
  const want = query.get('vai-tro') === 'nha-tuyen-dung' ? 'employer' : '';
  const back = query.get('tiep') || '';
  const html = `
  <div class="auth">
    <div class="auth-side">
      <p class="kicker">Việc Làm Bảo Vệ</p>
      <h2>Không cần mật khẩu. Chỉ cần số điện thoại.</h2>
      <p>Mã xác nhận gửi qua tin nhắn. Số của bạn chỉ hiện với công ty khi bạn bấm ứng tuyển.</p>
      <ol>
        <li><span>Nhập số điện thoại đang dùng Zalo</span></li>
        <li><span>Nhập mã 6 số vừa nhận</span></li>
        <li><span>Chọn bạn tìm việc hay tuyển người</span></li>
      </ol>
    </div>
    <div class="auth-main"><div class="auth-form">
      <div class="stepper" aria-hidden="true"><i class="on"></i><i></i><i></i></div>

      <form id="s1">
        <h1>Đăng nhập</h1>
        <p>Tài khoản mới sẽ được tạo tự động.</p>
        <label class="lbl" for="ph">Số điện thoại</label>
        <div class="phone" style="margin:6px 0 16px"><span>+84</span><input id="ph" name="phone" inputmode="tel" autocomplete="tel" placeholder="909 123 456" required></div>
        <button class="btn btn-primary btn-l btn-block" type="submit">Gửi mã xác nhận</button>
        <div class="or">hoặc</div>
        <div class="grid2">
          <button class="btn btn-quiet" type="button" data-social="Google">${icon('google')}Google</button>
          <button class="btn btn-quiet" type="button" data-social="Zalo">${icon('chat')}Zalo</button>
        </div>
        <p class="mute" style="font-size:14px;margin-top:20px">Tiếp tục nghĩa là bạn đồng ý với <a href="/chinh-sach/dieu-khoan">Điều khoản</a> và <a href="/chinh-sach/bao-mat">Chính sách bảo mật</a>.</p>
      </form>

      <form id="s2" hidden>
        <h1>Nhập mã xác nhận</h1>
        <p>Đã gửi tới <b id="phShow"></b>. <button class="linkbtn" type="button" data-back>Đổi số</button></p>
        <div class="otp" style="margin:20px 0 8px">${Array.from({ length: 6 }, (_, i) => `<input inputmode="numeric" maxlength="1" aria-label="Số thứ ${i + 1}" autocomplete="${i ? 'off' : 'one-time-code'}">`).join('')}</div>
        <p class="mute" style="font-size:14px">Bản mẫu: nhập 6 số bất kỳ. <button class="linkbtn" type="button" id="resend" disabled>Gửi lại sau <span id="cd">60</span>s</button></p>
        <button class="btn btn-primary btn-l btn-block" type="submit">Xác nhận</button>
      </form>

      <form id="s3" hidden>
        <h1>Bạn đến đây để…</h1>
        <p>Có thể đổi lại sau trong phần cài đặt.</p>
        <div class="roles" style="margin:16px 0 20px">
          <label class="role"><input type="radio" name="role" value="candidate" ${want ? '' : 'checked'}><span><b>Tìm việc bảo vệ</b><small>Xem việc gần nhà, lưu tin, ứng tuyển bằng một chạm.</small></span></label>
          <label class="role"><input type="radio" name="role" value="employer" ${want ? 'checked' : ''}><span><b>Tuyển người cho công ty</b><small>Đăng tin, quản lý ứng viên, mua gói dịch vụ.</small></span></label>
        </div>
        <label class="field" style="margin-bottom:16px"><span>Họ tên hoặc tên công ty</span><input class="input" name="name" required autocomplete="name"></label>
        <button class="btn btn-primary btn-l btn-block" type="submit">Vào tài khoản</button>
      </form>
    </div></div>
  </div>`;

  function mount(root) {
    const steps = ['#s1', '#s2', '#s3'].map((s) => $(s, root));
    let phone = '';
    let timer;
    const show = (n) => {
      steps.forEach((s, i) => (s.hidden = i !== n));
      $$('.stepper i', root).forEach((b, i) => b.classList.toggle('on', i <= n));
      (steps[n].querySelector('input') || steps[n]).focus();
    };
    const finish = (role, name) => {
      store.set('user', { name, phone, role, since: new Date().toLocaleDateString('vi-VN') });
      toast('Đăng nhập thành công.');
      go(back || (role === 'employer' ? '/nha-tuyen-dung' : '/ung-vien'));
    };
    steps[0].addEventListener('submit', (e) => {
      e.preventDefault();
      const v = e.target.phone.value.replace(/\D/g, '').replace(/^84/, '').replace(/^0/, '');
      if (v.length !== 9) { toast('Số điện thoại cần 10 số, ví dụ 0909 123 456.', 'alert'); return; }
      phone = '0' + v;
      $('#phShow', root).textContent = phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
      show(1);
      let n = 60;
      clearInterval(timer);
      timer = setInterval(() => { n--; const cd = $('#cd', root); if (cd) cd.textContent = n; if (n <= 0) { clearInterval(timer); const r = $('#resend', root); if (r) { r.disabled = false; r.textContent = 'Gửi lại mã'; } } }, 1000);
    });
    const boxes = $$('.otp input', root);
    boxes.forEach((b, i) => {
      b.addEventListener('input', () => { b.value = b.value.replace(/\D/g, ''); if (b.value && boxes[i + 1]) boxes[i + 1].focus(); if (boxes.every((x) => x.value)) steps[1].requestSubmit(); });
      b.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !b.value && boxes[i - 1]) boxes[i - 1].focus(); });
      b.addEventListener('paste', (e) => { const t = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6); if (t.length === 6) { e.preventDefault(); t.split('').forEach((c, k) => (boxes[k].value = c)); steps[1].requestSubmit(); } });
    });
    steps[1].addEventListener('submit', (e) => { e.preventDefault(); if (boxes.every((x) => x.value)) show(2); else toast('Nhập đủ 6 số.', 'alert'); });
    $('[data-back]', root).addEventListener('click', () => show(0));
    $('#resend', root).addEventListener('click', () => toast('Đã gửi lại mã.'));
    steps[2].addEventListener('submit', (e) => { e.preventDefault(); finish(e.target.role.value, e.target.name.value.trim()); });
    $$('[data-social]', root).forEach((b) => b.addEventListener('click', () => { phone = ''; toast(`Đăng nhập ${b.dataset.social} cần cấu hình ở bản chính thức. Đang dùng tài khoản mẫu.`, 'lock'); show(2); }));
    document.addEventListener('vlbv:leave', () => clearInterval(timer), { once: true });
  }

  return { nav: '', html, mount, title: 'Đăng nhập', noindex: true, tabbar: false };
}
