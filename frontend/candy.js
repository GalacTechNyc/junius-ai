

/* ------------------------------------------------------------
   frontend/candy.js
   Adds bouncing candies & spinning lollipops for "Candy Land" theme
   ---------------------------------------------------------- */

(function () {
  const CANVAS_ID = 'candy-bg-canvas';
  const ITEM_COUNT = 30;
  const colors = ['#ff66b3', '#ffa64d', '#ffeb3b', '#b366ff', '#6ec1ff'];

  let canvas, ctx, items = [], frameId;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeItem() {
    const isLollipop = Math.random() < 0.4;
    return {
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      r: rand(8, 18),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.02, 0.02),
      color: colors[Math.floor(Math.random() * colors.length)],
      lolly: isLollipop
    };
  }

  function initItems() {
    items = [];
    for (let i = 0; i < ITEM_COUNT; i++) items.push(makeItem());
  }

  function drawCandy(it) {
    ctx.save();
    ctx.translate(it.x, it.y);
    ctx.rotate(it.rot);
    ctx.fillStyle = it.color;

    if (it.lolly) {
      // lollipop head
      ctx.beginPath();
      ctx.arc(0, 0, it.r, 0, Math.PI * 2);
      ctx.fill();
      // stick
      ctx.fillStyle = '#fff';
      ctx.fillRect(-2, it.r, 4, it.r * 2);
    } else {
      // jelly bean
      ctx.beginPath();
      ctx.ellipse(0, 0, it.r, it.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    items.forEach(it => {
      drawCandy(it);
      it.x += it.vx;
      it.y += it.vy;
      it.rot += it.vr;

      // bounce off edges
      if (it.x - it.r < 0 || it.x + it.r > canvas.width) it.vx *= -1;
      if (it.y - it.r < 0 || it.y + it.r > canvas.height) it.vy *= -1;
    });
    frameId = requestAnimationFrame(draw);
  }

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
      initItems();
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

  function applyCandy() {
    destroyCanvas();
    createCanvas();
    document.body.classList.add('candy');
  }

  // register handler
  window.themeHandlers = window.themeHandlers || {};
  window.themeHandlers.candy = applyCandy;
})();