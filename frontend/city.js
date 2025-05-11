

/* ------------------------------------------------------------
   frontend/city.js
   Twinkling building windows + occasional street‑light streaks
   for the "City Night" scene
   ---------------------------------------------------------- */

(function () {
  const CANVAS_ID = 'city-bg-canvas';
  const WINDOW_GRID = 70;      // number of windows
  const STREAK_INTERVAL = 5500;

  let canvas, ctx, windows = [], frameId, streakTimer;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initWindows() {
    windows = [];
    const cols = 10;
    const rows = 7;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / (rows + 3); // extra bottom for street

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        windows.push({
          x: c * cellW + cellW * 0.2,
          y: r * cellH + cellH * 0.3,
          w: cellW * 0.6,
          h: cellH * 0.6,
          on: Math.random() < 0.5,
          tw: Math.random() * 2000 + 1000,  // twinkle time
          last: performance.now()
        });
      }
    }
  }

  function drawWindows(now) {
    windows.forEach(w => {
      if (now - w.last > w.tw) {
        w.on = !w.on;
        w.last = now;
      }
      ctx.fillStyle = w.on ? '#ffd54f' : '#181818';
      ctx.fillRect(w.x, w.y, w.w, w.h);
    });
  }

  // -------------------- streak -----------------------
  function drawStreak() {
    const y = rand(canvas.height * 0.8, canvas.height * 0.9);
    const len = rand(80, 160);
    const duration = 1200;
    const start = performance.now();
    const hue = rand(20, 60);
    function anim(now) {
      const p = (now - start) / duration;
      if (p > 1) return;

      const x = p * (canvas.width + len) - len;
      ctx.save();
      ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 1 - p;
      ctx.beginPath();
      ctx.moveTo(x - len, y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.restore();

      requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
  }

  function scheduleStreak() {
    streakTimer = setInterval(drawStreak, STREAK_INTERVAL);
  }

  // -------------------- setup -----------------------
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
      initWindows();
    };
    window.addEventListener('resize', resize);
    resize();

    function loop(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWindows(now);
      frameId = requestAnimationFrame(loop);
    }
    loop();
    scheduleStreak();
  }

  function destroyCanvas() {
    if (frameId) cancelAnimationFrame(frameId);
    clearInterval(streakTimer);
    const old = document.getElementById(CANVAS_ID);
    if (old) old.remove();
  }

  function applyCity() {
    destroyCanvas();
    createCanvas();
    document.body.classList.add('city');
  }

  window.themeHandlers = window.themeHandlers || {};
  window.themeHandlers.city = applyCity;
})();