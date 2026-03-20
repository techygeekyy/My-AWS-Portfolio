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


  requestAnimationFrame(animate);
}

animate();

