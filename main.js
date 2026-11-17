(() => {
  const $ = id => document.getElementById(id);
  const root = document.documentElement;

  /* tema */
  $('theme').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* mobil menü */
  const burger = $('burger'), menu = $('menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  $('yr').textContent = new Date().getFullYear();

  /* gösterge paneli kadranları */
  const NS = 'http://www.w3.org/2000/svg';
  const el = (name, attrs, parent) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n);
    return n;
  };
  const pt = (cx, cy, r, f) => {
    const a = (-135 + 270 * f) * Math.PI / 180;
    return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  };
  const gauge = (g, cx, cy, majors, minors, labels, redFrom) => {
    const total = majors * minors;
    for (let i = 0; i <= total; i++) {
      const f = i / total, major = i % minors === 0;
      const [x1, y1] = pt(cx, cy, 86, f);
      const [x2, y2] = pt(cx, cy, major ? 70 : 78, f);
      const red = redFrom !== undefined && f >= redFrom;
      el('line', { x1, y1, x2, y2, stroke: red ? '#ff6a2b' : '#8c8a82', 'stroke-width': major ? 3 : 1.5, 'stroke-linecap': 'round' }, g);
      if (major) {
        const [tx, ty] = pt(cx, cy, 52, f);
        const t = el('text', { x: tx, y: ty + 5, 'text-anchor': 'middle', fill: red ? '#ff6a2b' : '#d9d6cc', 'font-size': 12, 'font-weight': 600, 'font-family': 'Host Grotesk, sans-serif' }, g);
        t.textContent = labels[i / minors];
      }
    }
  };
  gauge($('g-left'), 112, 170, 8, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8], 0.75);
  gauge($('g-right'), 408, 170, 6, 2, [0, 40, 80, 120, 160, 200, 240]);

  /* crash data gösterimi */
  const demo = $('demo'), btn = $('demo-btn'), msg = $('demo-msg');
  const set = (k, v) => { demo.querySelector(`[data-k="${k}"]`).textContent = v; };
  let timer;
  btn.addEventListener('click', () => {
    if (demo.dataset.state === 'locked') {
      demo.dataset.state = 'working';
      btn.textContent = 'Siliniyor…';
      msg.textContent = 'Kaza kaydı modülden siliniyor.';
      timer = setTimeout(() => {
        demo.dataset.state = 'clean';
        set('lamp', 'Söndü'); set('rec', 'Temiz'); set('sys', 'Çalışıyor');
        btn.textContent = 'Başa dön';
        msg.textContent = 'Atölyede yaptığımız işlemin sonucu bu: lamba söner, sistem tekrar devrede.';
      }, 2300);
    } else if (demo.dataset.state === 'clean') {
      clearTimeout(timer);
      demo.dataset.state = 'locked';
      set('lamp', 'Yanıyor'); set('rec', 'Var, modül kilitli'); set('sys', 'Devre dışı');
      btn.textContent = 'Kaza kaydını sil';
      msg.textContent = 'Butona basın, atölyede yaptığımız işlemin sonucunu görün.';
    }
  });

  /* yumuşak belirme */
  const items = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  items.forEach(i => io.observe(i));
})();
