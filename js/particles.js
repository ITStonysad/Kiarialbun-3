(() => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const COLORS = ['155,124,255', '239,143,213', '111,140,255', '192,170,255'];
  const LINK_COLOR = '155,124,255';

  let width = 0, height = 0, dpr = 1;
  let particles = [];
  const mouse = { x: null, y: null, radius: 150 };

  function initParticles() {
    const count = Math.min(130, Math.max(40, Math.floor((width * height) / 14000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x >= width) p.vx *= -1;
      if (p.y <= 0 || p.y >= height) p.vy *= -1;
      p.x = Math.min(Math.max(p.x, 0), width);
      p.y = Math.min(Math.max(p.y, 0), height);

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 0.6;
          p.y += (dy / dist) * force * 0.6;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},.75)`;
      ctx.fill();
    }

    const maxDist = Math.min(140, width / 7);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${LINK_COLOR},${(1 - dist / maxDist) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    drawFrame();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  window.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    if (touch) { mouse.x = touch.clientX; mouse.y = touch.clientY; }
  }, { passive: true });
  window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

  resize();
  if (reduceMotion) {
    drawFrame();
  } else {
    requestAnimationFrame(loop);
  }
})();
