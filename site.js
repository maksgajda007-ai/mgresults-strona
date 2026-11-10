(function(){
  // always open a new page at the very top (unless the link points to a section)
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch(e){}
  function toTop(){ if (!location.hash) window.scrollTo({top:0,left:0,behavior:'instant'}); }
  toTop();
  addEventListener('pageshow', toTop);
  addEventListener('load', toTop);

  var top = document.getElementById('top');
  if (top) addEventListener('scroll', function(){ top.classList.toggle('scrolled', scrollY > 8); }, {passive:true});

  // mobile menu
  var nav = top && top.querySelector('.nav');
  if (nav) {
    nav.id = 'main-nav';
    var extra = document.createElement('div');
    extra.className = 'nav-extra';
    extra.innerHTML = '<a class="btn btn-primary" href="' + (document.getElementById('audyt') ? '#audyt' : 'index.html#audyt') + '">Zamów darmowy audyt</a>' +
      '<span>Tel. <a href="tel:+48696396309">696 396 309</a></span>' +
      '<span><a href="mailto:mgresultsmarketing@gmail.com">mgresultsmarketing@gmail.com</a></span>';
    nav.appendChild(extra);
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'menu-btn';
    btn.setAttribute('aria-label', 'Otwórz menu'); btn.setAttribute('aria-controls', 'main-nav'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span>';
    top.querySelector('.wrap').appendChild(btn);
    var setMenu = function(open){
      top.classList.toggle('menu-open', open);
      document.documentElement.classList.toggle('no-scroll', open);
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    };
    btn.addEventListener('click', function(){ setMenu(!top.classList.contains('menu-open')); });
    nav.addEventListener('click', function(e){ if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
    addEventListener('resize', function(){ if (innerWidth > 880) setMenu(false); });
  }

  // page-change transition: cover slides up, then the next page opens with the short loader
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cover = document.createElement('div');
  cover.className = 'pt-cover'; cover.setAttribute('aria-hidden', 'true');
  cover.innerHTML = '<div class="wm">mgresults<i>marketing</i></div>';
  document.body.appendChild(cover);
  document.addEventListener('click', function(e){
    if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target || a.hasAttribute('download')) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // same page / anchor
    e.preventDefault();
    cover.classList.add('on');
    setTimeout(function(){ location.href = a.href; }, 400);
  });
  addEventListener('pageshow', function(e){ if (e.persisted) cover.classList.remove('on'); });

  var form = document.getElementById('form');
  if (!form) return;
  var err = document.getElementById('f-err');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('f-name'), firmF = document.getElementById('f-firm'),
        phone = document.getElementById('f-phone'), ok = document.getElementById('f-ok');
    var missing = [];
    if (!name.value.trim()) missing.push('imię');
    if (!firmF.value.trim()) missing.push('nazwę firmy');
    if (phone.value.replace(/\D/g,'').length < 9) missing.push('numer telefonu (min. 9 cyfr)');
    if (missing.length) { err.textContent = 'Uzupełnij: ' + missing.join(', ') + '.'; return; }
    if (!ok.checked) { err.textContent = 'Zaznacz zgodę na kontakt, żebyśmy mogli przesłać audyt.'; return; }
    err.textContent = '';
    var btnS = form.querySelector('button[type="submit"]'); btnS.disabled = true; btnS.textContent = 'Wysyłanie…';
    var req = (form.getAttribute('action') || '').indexOf('web3forms') > -1
      ? fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) }).then(function(r){ return r.json().then(function(j){ if (!r.ok || !j.success) throw new Error('w3f'); return r; }); })
      : fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
    req.then(function(r){ if (!r.ok) throw new Error(r.status);
        document.getElementById('form-wrap').hidden = true; document.getElementById('sent').hidden = false; })
      .catch(function(){ btnS.disabled = false; btnS.textContent = 'Wyślij i odbierz audyt';
        err.textContent = 'Nie udało się wysłać formularza. Spróbuj ponownie albo zadzwoń: 696 396 309.'; });
  });
})();
