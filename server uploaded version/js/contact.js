/* Contact form: reCAPTCHA v2 + AJAX submit to contact.php */
(function () {
  var form = document.querySelector('.ct-form');
  if (!form) return;
  var ar = function () { return document.documentElement.lang === 'ar'; };
  var T = {
    sending: ['Sending…', 'جارٍ الإرسال…'],
    sent: ['Thank you — your request was sent. We reply within one working day.', 'شكراً لك، تم إرسال طلبك وسنتواصل معك خلال يوم عمل واحد.'],
    invalid: ['Please enter your name, company, a valid email and the project details.', 'يرجى إدخال الاسم والشركة وبريد إلكتروني صحيح وتفاصيل المشروع.'],
    captcha: ['Please confirm you are not a robot.', 'يرجى تأكيد أنك لست روبوتاً.'],
    mail: ['Sending failed. Please email us directly.', 'تعذّر الإرسال، يرجى مراسلتنا عبر البريد الإلكتروني مباشرة.']
  };
  var t = function (k) { return (T[k] || T.mail)[ar() ? 1 : 0]; };

  // honeypot (bots fill it, people never see it)
  var hp = document.createElement('div');
  hp.setAttribute('aria-hidden', 'true');
  // no left:-9999px — in RTL that creates a huge sideways scroll
  hp.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap';
  hp.innerHTML = '<input type="text" name="website" tabindex="-1" autocomplete="off">';
  form.appendChild(hp);

  var box = document.createElement('div');
  box.className = 'ct-recaptcha';
  form.querySelector('.ct-form__foot').before(box);
  var msg = document.createElement('p');
  msg.className = 't-caption ct-form__status';
  msg.setAttribute('role', 'status');
  form.appendChild(msg);

  var wid = null;
  fetch('contact.php').then(function (r) { return r.json(); }).then(function (d) {
    window.ctRecaptchaReady = function () { wid = grecaptcha.render(box, { sitekey: d.siteKey }); };
    var s = document.createElement('script');
    s.src = 'https://www.google.com/recaptcha/api.js?onload=ctRecaptchaReady&render=explicit&hl=' + (ar() ? 'ar' : 'en');
    s.async = true;
    document.head.appendChild(s);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    msg.textContent = t('sending');
    fetch('contact.php', { method: 'POST', body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .catch(function () { return { code: 'mail' }; })
      .then(function (d) {
        msg.textContent = t(d.code);
        if (d.ok) form.reset();
        if (window.grecaptcha && wid !== null) grecaptcha.reset(wid);
        btn.disabled = false;
      });
  });
})();

/* Profile popup: preview + download */
(function () {
  var dlg = document.getElementById('ct-profile');
  if (!dlg || !dlg.showModal) return;
  var frame = dlg.querySelector('iframe');
  document.querySelectorAll('[data-profile-open]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!frame.src && getComputedStyle(frame).display !== 'none') frame.src = frame.dataset.src;
      dlg.showModal();
    });
  });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.closest('[data-profile-close]')) dlg.close();
  });
})();
