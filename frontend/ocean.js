

/* ------------------------------------------------------------
   frontend/ocean.js
   Helper that injects a gentle bubble + wave animation
   whenever the "ocean" scene is selected.
   ---------------------------------------------------------- */

(function () {
  const CANVAS_ID = 'ocean-bg-canvas';
  const BUBBLE_COUNT = 30;
  let ctx, canvas, bubbles = [], animationFrame;

  // -------- Bubble helper ----------
  function makeBubble() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      r: 2 + Math.random() * 6,
      v: 0.5 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 0.3
    };
  }

  function initBubbles() {
    bubbles = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) bubbles.push(makeBubble());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    bubbles.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();

      b.y -= b.v;
      b.x += b.drift;

      // reset bubble if it moves off‑top
      if (b.y + b.r < 0) Object.assign(b, makeBubble(), { y: canvas.height + b.r });
    });
    animationFrame = requestAnimationFrame(draw);
  }

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = CANVAS_ID;
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBubbles();
    };
    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  function destroyCanvas() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    const old = document.getElementById(CANVAS_ID);
    if (old) old.remove();
  }

  // -------- Public handler ----------
  function applyOcean() {
    destroyCanvas();
    createCanvas();
    document.body.classList.add('ocean');
  }

  // Register handler so main script can call it
  window.themeHandlers = window.themeHandlers || {};
  window.themeHandlers.ocean = applyOcean;
})();