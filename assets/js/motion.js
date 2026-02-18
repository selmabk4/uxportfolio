// Proxy file to keep paths tidy.
// Uses the same code as the original /motion.js.
//
// This script is loaded via a classic <script> tag (NOT modules).
// Keep it dependency-free.

/* =========================
   1) Background canvas blobs
   ========================= */

const canvas = document.getElementById('bg-canvas');

// Guard: some pages might not include the background canvas.
if (canvas) {
  const ctx = canvas.getContext('2d');

  let w = window.innerWidth;
  let h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  const mouse = { x: w / 2, y: h / 2 };

  const onResize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  };

  const onMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  window.addEventListener('resize', onResize);
  document.addEventListener('mousemove', onMouseMove);

  const colors = [
    '#FFB6B9', '#FAE3D9', '#BBDED6', '#8AC6D1', '#F7D6E0', '#F9F871', '#B5EAD7', '#C7CEEA'
  ];

  const randomBetween = (a, b) => a + Math.random() * (b - a);

  const shapes = Array.from({ length: 12 }, () => ({
    x: randomBetween(0, w),
    y: randomBetween(0, h),
    r: randomBetween(40, 110),
    color: colors[Math.floor(Math.random() * colors.length)],
    dx: randomBetween(-0.3, 0.3),
    dy: randomBetween(-0.3, 0.3),
    float: 0.5 + Math.random(),
    type: Math.random() > 0.5 ? 'circle' : 'blob',
    phase: Math.random() * Math.PI * 2
  }));

  const drawBlob = (x, y, r, phase, color) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const rad = r + Math.sin(phase + angle * 2) * r * 0.18;
      ctx.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
    }

    ctx.closePath();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 32;
    ctx.fill();
    ctx.restore();
  };

  const drawCircle = (x, y, r, color) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.restore();
  };

  const tick = () => {
    ctx.clearRect(0, 0, w, h);

    shapes.forEach((s) => {
      // Movement
      s.x += s.dx * s.float;
      s.y += s.dy * s.float;

      // Mouse parallax
      const mx = (mouse.x - w / 2) * 0.02 * s.float;
      const my = (mouse.y - h / 2) * 0.02 * s.float;

      // Wrap-around edges
      if (s.x < -s.r) s.x = w + s.r;
      if (s.x > w + s.r) s.x = -s.r;
      if (s.y < -s.r) s.y = h + s.r;
      if (s.y > h + s.r) s.y = -s.r;

      // Blob wobble
      if (s.type === 'blob') s.phase += 0.01 * s.float;

      // Render
      if (s.type === 'blob') drawBlob(s.x + mx, s.y + my, s.r, s.phase, s.color);
      else drawCircle(s.x + mx, s.y + my, s.r, s.color);
    });

    requestAnimationFrame(tick);
  };

  tick();
}

/* =========================
   2) UI behaviors
   ========================= */

document.addEventListener('DOMContentLoaded', () => {
  // Bio fade-in (index)
  const bio = document.getElementById('bio');
  if (bio) {
    window.setTimeout(() => {
      bio.classList.add('visible');
    }, 400);
  }

  // Scroll-to-top button (any page that has .to-top)
  const btn = document.querySelector('.to-top');
  if (btn) {
    const toggle = () => {
      btn.classList.toggle('to-top--show', window.scrollY > 500);
    };

    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
