/* ── FULLSITE STARS & CLOUDS ── */
const canvas = document.createElement('canvas');
canvas.id = 'particleCanvas';
canvas.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
`;
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

/* ── STARS ── */
const stars = Array.from({ length: 200 }, () => ({
  x:           Math.random() * window.innerWidth,
  y:           Math.random() * window.innerHeight,
  r:           Math.random() * 2.5 + 1,
  alpha:       Math.random() * 0.8 + 0.2,
  twinkleSpeed: Math.random() * 0.015 + 0.005,
  twinkleDir:  1,
  dx:          (Math.random() - 0.5) * 0.25,
  dy:          (Math.random() - 0.5) * 0.25,
}));

/* ── CLOUDS ── */
const clouds = Array.from({ length: 5 }, (_, i) => ({
  x:     (window.innerWidth / 5) * i,
  y:     Math.random() * window.innerHeight * 0.5 + 50,
  scale: Math.random() * 0.8 + 0.4,
  alpha: Math.random() * 0.07 + 0.03,
  dx:    Math.random() * 0.25 + 0.1,
}));

/* ── PROPER CLOUD SHAPE ── */
function drawCloud(ctx, x, y, scale, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.beginPath();

  const w = 120 * scale;
  const h = 40  * scale;

  // Base rectangle rounded
  ctx.moveTo(x + 20 * scale, y + h);
  ctx.lineTo(x + w - 20 * scale, y + h);

  // Bottom right curve
  ctx.quadraticCurveTo(x + w, y + h, x + w, y + h * 0.6);

  // Right bump
  ctx.quadraticCurveTo(x + w + 20 * scale, y + h * 0.6,
                       x + w + 10 * scale, y + h * 0.3);
  ctx.quadraticCurveTo(x + w + 10 * scale, y,
                       x + w - 10 * scale, y);

  // Middle top bump (biggest)
  ctx.quadraticCurveTo(x + w * 0.8,  y - h * 0.8,
                       x + w * 0.55, y - h * 0.6);
  ctx.quadraticCurveTo(x + w * 0.5,  y - h * 1.1,
                       x + w * 0.35, y - h * 0.7);

  // Left top bump
  ctx.quadraticCurveTo(x + 20 * scale, y - h * 0.9,
                       x + 10 * scale, y);

  // Bottom left curve
  ctx.quadraticCurveTo(x - 10 * scale, y,
                       x - 10 * scale, y + h * 0.4);
  ctx.quadraticCurveTo(x - 10 * scale, y + h,
                       x + 20 * scale, y + h);

  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ── DRAW STAR ── */
function drawStar(x, y, r, alpha) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.shadowBlur  = 10;
  ctx.shadowColor = `rgba(255,255,255,${alpha * 0.8})`;
  ctx.fill();
  ctx.shadowBlur  = 0;
}

/* ── ANIMATE ── */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Stars
  stars.forEach(s => {
    s.alpha += s.twinkleSpeed * s.twinkleDir;
    if (s.alpha >= 1)   { s.alpha = 1;   s.twinkleDir = -1; }
    if (s.alpha <= 0.1) { s.alpha = 0.1; s.twinkleDir =  1; }

    s.x += s.dx;
    s.y += s.dy;

    if (s.x < 0 || s.x > canvas.width)  s.dx *= -1;
    if (s.y < 0 || s.y > canvas.height) s.dy *= -1;

    drawStar(s.x, s.y, s.r, s.alpha);
  });

  // Clouds
  clouds.forEach(c => {
    c.x += c.dx;
    if (c.x - 200 > canvas.width) {
      c.x = -200;
      c.y = Math.random() * canvas.height * 0.5 + 50;
    }
    drawCloud(ctx, c.x, c.y, c.scale, c.alpha);
  });

  requestAnimationFrame(animate);
}

animate();