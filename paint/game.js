// trail.exe — ART MODE (no lines, space to pause, dots work)
const c = document.getElementById('c');
const ctx = c.getContext('2d');
c.width = 900;
c.height = 600;

const colorInput = document.getElementById('color');
const trailToggle = document.getElementById('trail');
const clearBtn = document.getElementById('clear');

const S = 32;
let x = c.width / 2 - S/2;
let y = c.height / 2 - S/2;
let col = colorInput.value;
let enabled = trailToggle.checked;
let spaceDown = false;

// MULTI-PATH + PER-COLOR + NO AUTO-CONNECT
const paths = [];  // [{points: [{x,y}], color: '#...'}]

const keys = new Set();
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  keys.add(k);
  if (k === ' ') spaceDown = true;
});
addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  keys.delete(k);
  if (k === ' ') spaceDown = false;
});

colorInput.oninput = () => col = colorInput.value;
trailToggle.onchange = () => enabled = trailToggle.checked;
clearBtn.onclick = () => paths.length = 0;

// START NEW PATH ONLY ON FIRST POINT AFTER PAUSE
let currentPath = null;

requestAnimationFrame(function frame() {
  const speed = 7;
  if (keys.has('a') || keys.has('arrowleft')) x -= speed;
  if (keys.has('d') || keys.has('arrowright')) x += speed;
  if (keys.has('w') || keys.has('arrowup')) y -= speed;
  if (keys.has('s') || keys.has('arrowdown')) y += speed;

  x = Math.max(0, Math.min(c.width - S, x));
  y = Math.max(0, Math.min(c.height - S, y));

  // TRAIL LOGIC
  const shouldDraw = enabled && !spaceDown;

  if (shouldDraw) {
    const px = x + S/2;
    const py = y + S/2;

    // Start new path if none or color changed
    if (!currentPath || currentPath.color !== col) {
      currentPath = { points: [], color: col };
      paths.push(currentPath);
    }

    const last = currentPath.points[currentPath.points.length - 1];
    // Only add if moved > 1px (prevents dot spam)
    if (!last || Math.hypot(px - last.x, py - last.y) > 1) {
      currentPath.points.push({ x: px, y: py });
    }
  } else {
    // Pause: break current path
    currentPath = null;
  }

  // RENDER
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, c.width, c.height);

  // Draw all paths
  for (const path of paths) {
    if (path.points.length < 1) continue;
    if (path.points.length === 1) {
      // SINGLE DOT
      ctx.fillStyle = path.color;
      ctx.beginPath();
      ctx.arc(path.points[0].x, path.points[0].y, S * 0.35, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }

    ctx.strokeStyle = path.color;
    ctx.lineWidth = S * 0.75;
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.beginPath();
    path.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
  }

  // Player square
  ctx.fillStyle = col;
  ctx.fillRect(x, y, S, S);

  requestAnimationFrame(frame);
});
