(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROLES_ES = ['Desarrollador multiplataforma', 'Apps Android y Flutter', 'Backend y bases de datos', 'Aprendiendo Python y Spring Boot'];

  // Idioma ES/EN: el español está en el HTML; el inglés en I18N_EN
  const nodes = $$('[data-i18n]');
  nodes.forEach(n => (n.dataset.es = n.innerHTML));
  let lang = 'es', roles = ROLES_ES;
  function setLang(l) {
    lang = l;
    nodes.forEach(n => {
      const en = window.I18N_EN[n.dataset.i18n];
      n.innerHTML = l === 'en' && en ? en : n.dataset.es;
    });
    roles = l === 'en' ? window.I18N_EN.roles : ROLES_ES;
    document.documentElement.lang = l;
    $('.lang').textContent = l === 'en' ? 'ES' : 'EN';
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  $('.lang').addEventListener('click', () => setLang(lang === 'es' ? 'en' : 'es'));
  let saved; try { saved = localStorage.getItem('lang'); } catch (e) {}
  if (saved === 'en' || (!saved && navigator.language.startsWith('en'))) setLang('en');

  // Máquina de escribir
  const role = $('#role');
  let ri = 0, ci = 0, del = false;
  function type() {
    const txt = roles[ri % roles.length];
    role.textContent = txt.slice(0, ci);
    if (!del && ci === txt.length) { del = true; return setTimeout(type, 1600); }
    if (del && ci === 0) { del = false; ri++; }
    ci += del ? -1 : 1;
    setTimeout(type, del ? 30 : 65);
  }
  reduce ? (role.textContent = roles[0]) : type();

  // Barra de progreso y enlace activo
  const bar = $('.progress'), links = $$('.nav-links a');
  const secs = links.map(a => $(a.getAttribute('href')));
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    const y = scrollY + 140;
    secs.forEach((s, i) => links[i].classList.toggle('active', s && s.offsetTop <= y && s.offsetTop + s.offsetHeight > y));
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Menú móvil
  const nl = $('.nav-links');
  $('.menu-btn').addEventListener('click', () => nl.classList.toggle('open'));
  links.forEach(a => a.addEventListener('click', () => nl.classList.remove('open')));

  // Aparición al hacer scroll
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 90}ms`; io.observe(el); });

  // Diagrama de Venn: al pasar o tocar un círculo se cambia el texto
  const vs = $$('.venn .v'), vis = $$('.vi');
  const show = k => { vis.forEach(v => v.classList.toggle('active', v.dataset.k === String(k))); vs.forEach(v => v.classList.toggle('on', v.dataset.k === String(k))); };
  vs.forEach(v => {
    ['mouseenter', 'focus', 'click'].forEach(ev => v.addEventListener(ev, () => show(v.dataset.k)));
    v.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(v.dataset.k); } });
  });
  $('.venn').addEventListener('mouseleave', () => show(3));

  // Tarjetas: inclinación 3D y foco de luz
  if (!reduce && matchMedia('(hover: hover)').matches) {
    $$('.card').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
        c.style.transform = `perspective(900px) rotateX(${((y / r.height) - .5) * -9}deg) rotateY(${((x / r.width) - .5) * 9}deg) translateZ(6px)`;
      });
      c.addEventListener('mouseleave', () => { c.style.transform = ''; });
    });
  }
})();
