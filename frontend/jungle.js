

/* ------------------------------------------------------------
   frontend/jungle.js
   Adds drifting jungle leaves when the "jungle" scene is active
   ---------------------------------------------------------- */

(function () {
  const CANVAS_ID = 'jungle-bg-canvas';
  const LEAF_COUNT = 25;
  const leafColors = ['#37b24d', '#2f9e44', '#d4e157', '#8bc34a'];
  const leafShapes = [0, 1]; // 0 = roundish, 1 = pointy

  let canvas, ctx, leaves = [], animationFrame;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeLeaf() {
    return {
      x: rand(0, canvas.width),
      y: -rand(20, canvas.height),
      r: rand(6, 15),
      vx: rand(-0.4, 0.4),
      vy: rand(0.8, 1.8),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.02, 0.02),
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      shape: leafShapes[Math.floor(Math.random() * leafShapes.length)]
    };
  }

  function initLeaves() {
    leaves = [];
    for (let i = 0; i < LEAF_COUNT; i++) leaves.push(makeLeaf());
  }

  function drawLeaf(leaf) {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.rot);
    ctx.fillStyle = leaf.color;

    if (leaf.shape === 0) {
      ctx.beginPath();
      ctx.ellipse(0, 0, leaf.r, leaf.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -leaf.r);
      ctx.quadraticCurveTo(leaf.r, 0, 0, leaf.r);
      ctx.quadraticCurveTo(-leaf.r, 0, 0, -leaf.r);
      ctx.fill();
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leaves.forEach(lf => {
      drawLeaf(lf);
      lf.x += lf.vx;
      lf.y += lf.vy;
      lf.rot += lf.vr;

      // recycle leaf if off screen
      if (lf.y - lf.r > canvas.height) Object.assign(lf, makeLeaf(), { y: -lf.r });
    });
    animationFrame = requestAnimationFrame(draw);
  }

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = CANVAS_ID;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initLeaves();
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

  function applyJungle() {
    destroyCanvas();
    createCanvas();
    document.body.classList.add('jungle');
  }

  // Register handler
  window.themeHandlers = window.themeHandlers || {};
  window.themeHandlers.jungle = applyJungle;
})();