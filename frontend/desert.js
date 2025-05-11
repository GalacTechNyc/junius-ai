/* ------------------------------------------------------------
   frontend/desert.js
   Creates drifting sand particles and shimmering heat waves
   for the "Desert" theme.
   ---------------------------------------------------------- */

(function () {
  const CANVAS_ID = 'desert-bg-canvas';
  const GRAIN_COUNT = 120;

  let canvas, ctx, grains = [], frameId;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeGrain() {
    return {
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      vx: rand(0.2, 0.6),
      vy: rand(-0.1, 0.1),
      size: rand(1, 2.5),
      alpha: rand(0.25, 0.6)
    };
  }

  function initGrains() {
    grains = [];
    for (let i = 0; i < GRAIN_COUNT; i++) grains.push(makeGrain());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // subtle heat haze
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let y = 0; y < canvas.height; y += 2) {
      ctx.fillRect(0, y, canvas.width, 1);
    }

    // sand grains
    grains.forEach(g => {
      ctx.globalAlpha = g.alpha;
      ctx.fillStyle = '#ffd67c';
      ctx.fillRect(g.x, g.y, g.size, g.size);
      g.x += g.vx;
      g.y += g.vy;

      // recycle grain if off‑screen
      if (g.x > canvas.width) Object.assign(g, makeGrain(), { x: -g.size });
    });
    ctx.globalAlpha = 1;

    frameId = requestAnimationFrame(draw);
  }

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = CANVAS_ID;
    Object.assign(canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
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
      initGrains();
    };
    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  function destroyCanvas() {
    if (frameId) cancelAnimationFrame(frameId);
    const old = document.getElementById(CANVAS_ID);
    if (old) old.remove();
  }

  function applyDesert() {
    console.log('🌵 Desert scene activated');
    destroyCanvas();
    createCanvas();
    document.body.classList.add('desert');
  }

  window.themeHandlers = window.themeHandlers || {};
  window.themeHandlers.desert = applyDesert;
})();
