/* Согласия перед оплатой. Полянинова Бэлла Леонидовна.
   Подключается одной строкой: <script src="consent.js" defer></script>
   Ссылки оплаты не меняет. Пока обе галочки не отмечены, переход на оплату заблокирован. */
(function () {
  var PAY = 'app.lava.top';
  var DOCS = {
    oferta: 'https://bella-psychologist.com/oferta.html',
    politika: 'https://bella-psychologist.com/politika-konfidencialnosti.html',
    pd: 'https://bella-psychologist.com/soglasie-personalnye-dannye.html',
    all: 'https://bella-psychologist.com/dokumenty.html'
  };
  /* ссылки-каталоги и плавающие панели: вместо галочек рядом показываем окно с галочками */
  var MODAL_ONLY = '.sc-item, .game-promo-link, .sticky-premium-btn, .panel a';

  var agreed = false;
  var boxes = [];
  var pending = null;

  var css = '' +
    '.bc-consent{display:block;width:100%;max-width:520px;margin:14px auto 12px;padding:14px 16px;' +
    'background:#FFFFFF;border:1px solid #DDD7CF;border-radius:6px;text-align:left;color:#1D1B1A;' +
    'font:400 15px/1.5 Manrope,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;box-sizing:border-box}' +
    '.bc-consent label{display:flex;gap:10px;align-items:flex-start;cursor:pointer;margin:0;padding:4px 0;color:#1D1B1A;font:inherit;text-transform:none;letter-spacing:0}' +
    '.bc-consent input{flex:0 0 auto;width:20px;height:20px;margin:1px 0 0;accent-color:#8E1B27;cursor:pointer}' +
    '.bc-consent a{color:#8E1B27;text-decoration:underline;font:inherit;display:inline;padding:0;background:none;border:0}' +
    '.bc-consent .bc-hint{margin:6px 0 0 30px;font-size:13px;color:#8E1B27;display:none}' +
    '.bc-consent.bc-warn{border-color:#8E1B27}.bc-consent.bc-warn .bc-hint{display:block}' +
    '.bc-wrap{display:block;width:100%;text-align:center}' +
    '.bc-locked{opacity:.45 !important;filter:grayscale(.6);cursor:not-allowed !important}' +
    '.bc-modal{position:fixed;inset:0;z-index:2147483000;display:none;align-items:flex-end;justify-content:center;background:rgba(20,18,17,.45);padding:16px;' +
    'padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))}' +
    '.bc-modal.bc-open{display:flex}' +
    '.bc-sheet{width:100%;max-width:480px;background:#FAFAF8;border-radius:10px;padding:20px 18px;box-sizing:border-box}' +
    '.bc-sheet p{margin:0 0 6px;font:700 17px/1.4 Manrope,system-ui,sans-serif;color:#1D1B1A}' +
    '.bc-sheet .bc-consent{margin:10px 0 14px;max-width:none}' +
    '.bc-go{display:block;width:100%;border:0;border-radius:6px;padding:14px;background:#8E1B27;color:#fff;font:700 16px Manrope,system-ui,sans-serif;cursor:pointer}' +
    '.bc-go[disabled]{opacity:.45;cursor:not-allowed}' +
    '.bc-close{display:block;width:100%;margin-top:8px;border:0;background:none;padding:10px;color:#6B6560;font:400 15px Manrope,system-ui,sans-serif;cursor:pointer}' +
    '@media (min-width:700px){.bc-modal{align-items:center}}' +
    '.bc-docs{text-align:center;font:400 13px/1.5 Manrope,system-ui,sans-serif;padding:18px 12px 26px;color:#6B6560}' +
    '.bc-docs a{color:#6B6560}';

  function isPay(el) {
    if (!el || el.nodeType !== 1) return false;
    var h = el.getAttribute('href') || '';
    var oc = el.getAttribute('onclick') || '';
    return h.indexOf(PAY) > -1 || oc.indexOf(PAY) > -1;
  }

  function block() {
    var d = document.createElement('div');
    d.className = 'bc-consent';
    d.innerHTML =
      '<label><input type="checkbox" data-bc="1"><span>Я принимаю условия <a href="' + DOCS.oferta + '" target="_blank" rel="noopener">публичной оферты</a> и <a href="' + DOCS.politika + '" target="_blank" rel="noopener">политики конфиденциальности</a></span></label>' +
      '<label><input type="checkbox" data-bc="2"><span>Я даю <a href="' + DOCS.pd + '" target="_blank" rel="noopener">согласие на обработку персональных данных</a></span></label>' +
      '<div class="bc-hint">Отметьте обе галочки, чтобы перейти к оплате</div>';
    Array.prototype.forEach.call(d.querySelectorAll('input'), function (i) {
      boxes.push(i);
      i.addEventListener('change', function () { sync(i); });
    });
    return d;
  }

  function sync(src) {
    var n = src.getAttribute('data-bc');
    boxes.forEach(function (b) { if (b.getAttribute('data-bc') === n) b.checked = src.checked; });
    var one = false, two = false;
    boxes.forEach(function (b) { if (b.checked) { if (b.getAttribute('data-bc') === '1') one = true; else two = true; } });
    agreed = one && two;
    paint();
  }

  function paint() {
    Array.prototype.forEach.call(document.querySelectorAll('a,button'), function (el) {
      if (!isPay(el)) return;
      el.classList.toggle('bc-locked', !agreed);
      el.setAttribute('aria-disabled', agreed ? 'false' : 'true');
    });
    if (agreed) Array.prototype.forEach.call(document.querySelectorAll('.bc-warn'), function (w) { w.classList.remove('bc-warn'); });
    var go = document.querySelector('.bc-go');
    if (go) go.disabled = !agreed;
  }

  var modal;
  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'bc-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    var sheet = document.createElement('div');
    sheet.className = 'bc-sheet';
    sheet.innerHTML = '<p>Перед оплатой</p>';
    sheet.appendChild(block());
    var go = document.createElement('button');
    go.type = 'button'; go.className = 'bc-go'; go.textContent = 'Перейти к оплате'; go.disabled = true;
    go.addEventListener('click', function () {
      if (!agreed || !pending) return;
      var el = pending; closeModal(); el.click();
    });
    var x = document.createElement('button');
    x.type = 'button'; x.className = 'bc-close'; x.textContent = 'Закрыть';
    x.addEventListener('click', closeModal);
    sheet.appendChild(go); sheet.appendChild(x);
    modal.appendChild(sheet);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.body.appendChild(modal);
  }
  function openModal(el) { pending = el; modal.classList.add('bc-open'); paint(); }
  function closeModal() { modal.classList.remove('bc-open'); pending = null; }

  function nearestBlock(el) {
    var prev = el.previousElementSibling;
    if (prev && prev.classList.contains('bc-consent')) return prev;
    var w = el.closest('.bc-wrap');
    return w ? w.querySelector('.bc-consent') : null;
  }

  function attach(el) {
    if (el.getAttribute('data-bc-done')) return;
    el.setAttribute('data-bc-done', '1');
    if (el.matches(MODAL_ONLY)) return;
    if (el.closest('.bc-sheet')) return;
    var parent = el.parentNode;
    var cs = window.getComputedStyle(parent);
    var b = block();
    if (cs.display.indexOf('flex') > -1 || cs.display.indexOf('grid') > -1) {
      var wrap = document.createElement('div');
      wrap.className = 'bc-wrap';
      parent.insertBefore(wrap, el);
      wrap.appendChild(b);
      wrap.appendChild(el);
    } else {
      parent.insertBefore(b, el);
    }
  }

  function scan() {
    Array.prototype.forEach.call(document.querySelectorAll('a,button'), function (el) { if (isPay(el)) attach(el); });
    if (boxes.length) { var f = boxes[0]; boxes.forEach(function (b) { if (b.getAttribute('data-bc') === f.getAttribute('data-bc')) b.checked = f.checked; }); }
    paint();
  }

  /* перехват всех нажатий на оплату, в том числе ссылок, созданных позже */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('a,button') : null;
    if (!el || !isPay(el) || agreed) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    var b = nearestBlock(el);
    if (b) {
      b.classList.add('bc-warn');
      b.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      openModal(el);
    }
  }, true);

  function init() {
    var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    buildModal();
    scan();
    var foot = document.createElement('div');
    foot.className = 'bc-docs';
    foot.innerHTML = '<a href="' + DOCS.all + '">Документы: оферта, политика конфиденциальности, согласия</a>';
    document.body.appendChild(foot);
    if (window.MutationObserver) {
      var t;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(scanLight, 150); })
        .observe(document.body, { childList: true, subtree: true });
    }
  }
  /* для динамических ссылок только блокировка, без вставки галочек */
  function scanLight() {
    Array.prototype.forEach.call(document.querySelectorAll('a,button'), function (el) {
      if (isPay(el) && !el.getAttribute('data-bc-done')) el.setAttribute('data-bc-done', '1');
    });
    paint();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
