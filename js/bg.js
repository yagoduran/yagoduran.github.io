// Fondo interactivo: red de partículas que reacciona al ratón
(() => {
  const canvas = document.getElementById('bg');
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  const mouse = { x: -9999, y: -9999 };
  const colors = ['0,240,255', '255,43,214', '124,58,237'];
  let w, h, dpr, pts = [];

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const n = Math.min(110, Math.floor((innerWidth * innerHeight) / 14000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr,
      r: (Math.random() * 1.4 + .8) * dpr, c: colors[(Math.random() * 3) | 0],
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const link = 150 * dpr, pull = 190 * dpr;
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
      if (d < pull) { p.x -= dx * .012; p.y -= dy * .012; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = `rgba(${p.c},.9)`; ctx.shadowColor = `rgb(${p.c})`; ctx.shadowBlur = 10 * dpr; ctx.fill();
    }
    ctx.shadowBlur = 0;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(${a.c},${(1 - d / link) * .35})`;
          ctx.lineWidth = dpr; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const m = Math.hypot(mouse.x - pts[i].x, mouse.y - pts[i].y);
      if (m < pull) {
        ctx.strokeStyle = `rgba(255,43,214,${(1 - m / pull) * .6})`; ctx.lineWidth = dpr;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    requestAnimationFrame(frame);
  }

  addEventListener('mousemove', e => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
  addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  addEventListener('resize', resize);
  resize(); frame();
})();
