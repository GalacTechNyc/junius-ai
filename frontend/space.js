/* ------------------------------------------------------------
   frontend/space.js
   Generates a twinkling star‑field and random shooting stars
   for the "space" scene.
   ---------------------------------------------------------- */

(function () {
  const CANVAS_ID = 'space-bg-canvas';
  const STAR_COUNT = 120;
  const SHOOTING_INTERVAL = 4500; // ms

  // Planets settings
  const PLANETS = [
    { r: 60, color: '#3e4eff',  xFactor: 0.15, y: 0.25, speed: 0.008 },
    { r: 40, color: '#ff9640',  xFactor: 0.75, y: 0.55, speed: -0.006 },
    { r: 28, color: '#9c27b0',  xFactor: 0.4,  y: 0.12, speed: 0.004 }
  ];
  let planets = [];

  let canvas, ctx, stars = [], animationFrame, shootTimer;

  const rand = (min, max) => Math.random() * (max - min) + min;

  function makeStar() {
    return {
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      r: rand(0.2, 1.2),
      alpha: rand(0.1, 0.5),
      twinkleDir: Math.random() > 0.5 ? 1 : -1
    };
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) stars.push(makeStar());
  }

  function drawPlanets() {
    planets.forEach(p => {
      // slow horizontal drift
      p.x += p.speed * canvas.width / 100;
      if (p.x - p.r > canvas.width)  p.x = -p.r;
      if (p.x + p.r < 0)             p.x = canvas.width + p.r;

      ctx.save();
      ctx.globalAlpha = 0.9;
      // Planet gradient
      const grd = ctx.createRadialGradient(
        p.x - p.r*0.4, p.y*canvas.height - p.r*0.4, p.r*0.3,
        p.x,           p.y*canvas.height,           p.r
      );
      grd.addColorStop(0, '#ffffff');
      grd.addColorStop(1, p.color);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x, p.y * canvas.height, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#cfd9ff';
    stars.forEach(s => {
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // twinkle
      s.alpha += 0.005 * s.twinkleDir;
      if (s.alpha <= 0.1 || s.alpha >= 0.5) s.twinkleDir *= -1;
    });
    ctx.globalAlpha = 1;
  }

  // ---------- Shooting star ----------
  function shootStar() {
    const startX = rand(0, canvas.width * 0.7);
    const startY = rand(0, canvas.height * 0.4);
    const len = rand(60, 120);
    const duration = 900;

    const startTime = performance.now();
    function drawTrail(now) {
      const progress = (now - startTime) / duration;
      if (progress > 1) return;

      const x = startX + len * progress;
      const y = startY + len * 0.3 * progress;

      ctx.save();
      ctx.strokeStyle = '#cfd9ff';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 1 - progress;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 30, y - 10);
      ctx.stroke();
      ctx.restore();

      requestAnimationFrame(drawTrail);
    }
    requestAnimationFrame(drawTrail);
  }

  function scheduleShooting() {
    shootTimer = setInterval(shootStar, SHOOTING_INTERVAL);
  }

  // ---------- Canvas helpers ----------
  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = CANVAS_ID;
    Object.assign(canvas.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '-1'
    });
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      // position planets according to viewport
      planets = PLANETS.map(p => ({
        ...p,
        x: p.xFactor * canvas.width
      }));
    };
    window.addEventListener('resize', resize);
    resize();

    (function loop() {
      drawPlanets();
      drawStars();
      animationFrame = requestAnimationFrame(loop);
    })();
    scheduleShooting();
  }

  function destroyCanvas() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    clearInterval(shootTimer);
    const old = document.getElementById(CANVAS_ID);
    if (old) old.remove();
  }

  function applySpace() {
    destroyCanvas();
    createCanvas();
    document.body.classList.add('space');
  }

  window.themeHandlers = window.themeHandlers || {};
  window.themeHandlers.space = applySpace;
  window.themeHandlers.space.destroy = destroyCanvas;
})();