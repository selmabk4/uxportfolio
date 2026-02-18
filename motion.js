// Colorful, interactive floating shapes
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;
let mouse = { x: w/2, y: h/2 };
window.addEventListener('resize', () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
});
document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
// Shape palette
const colors = [
  '#FFB6B9', '#FAE3D9', '#BBDED6', '#8AC6D1', '#F7D6E0', '#F9F871', '#B5EAD7', '#C7CEEA'
];
function randomBetween(a, b) { return a + Math.random() * (b - a); }
// Generate shapes
const shapes = Array.from({length: 12}, (_,i) => ({
  x: randomBetween(0, w),
  y: randomBetween(0, h),
  r: randomBetween(40, 110),
  color: colors[Math.floor(Math.random()*colors.length)],
  dx: randomBetween(-0.3, 0.3),
  dy: randomBetween(-0.3, 0.3),
  float: 0.5 + Math.random(),
  type: Math.random() > 0.5 ? 'circle' : 'blob',
  phase: Math.random()*Math.PI*2
}));
function drawBlob(x, y, r, phase, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i/8)*Math.PI*2;
    const rad = r + Math.sin(phase + angle*2)*r*0.18;
    ctx.lineTo(Math.cos(angle)*rad, Math.sin(angle)*rad);
  }
  ctx.closePath();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 32;
  ctx.fill();
  ctx.restore();
}
function drawCircle(x, y, r, color) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.globalAlpha = 0.13;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 24;
  ctx.fill();
  ctx.restore();
}
function animate() {
  ctx.clearRect(0,0,w,h);
  shapes.forEach(s => {
    // Move shapes
    s.x += s.dx * s.float;
    s.y += s.dy * s.float;
    // Mouse parallax
    const mx = (mouse.x - w/2) * 0.02 * s.float;
    const my = (mouse.y - h/2) * 0.02 * s.float;
    // Bounce off edges
    if (s.x < -s.r) s.x = w + s.r;
    if (s.x > w + s.r) s.x = -s.r;
    if (s.y < -s.r) s.y = h + s.r;
    if (s.y > h + s.r) s.y = -s.r;
    // Animate blob phase
    if (s.type === 'blob') s.phase += 0.01 * s.float;
    // Draw
    if (s.type === 'blob') drawBlob(s.x + mx, s.y + my, s.r, s.phase, s.color);
    else drawCircle(s.x + mx, s.y + my, s.r, s.color);
  });
  requestAnimationFrame(animate);
}
animate();

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var bio = document.getElementById('bio');
    if (bio) bio.classList.add('visible');
  }, 400);

  // Scroll-to-top button (works on any page that has .to-top)
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
