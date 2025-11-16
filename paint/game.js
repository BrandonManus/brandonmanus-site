// 8bit.exe — MOUSE + KEYBOARD (SPACEBAR = PAINT)
const c = document.getElementById('c');
const ctx = c.getContext('2d');

const colorInput = document.getElementById('color');
const trailToggle = document.getElementById('trail');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');

const S = 16;
let x = 256 - S/2;
let y = 256 - S/2;
let col = colorInput.value;
let enabled = trailToggle.checked;
let spaceDown = false;
let mouseDown = false;
let useMouse = false;

const paths = [];
let currentPath = null;

const keys = new Set();

// — MOUSE CONTROL (precision drawing)
c.addEventListener('mousemove', e => {
  const rect = c.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  x = mx - S/2;
  y = my - S/2;
  useMouse = true;
});
c.addEventListener('mousedown', () => mouseDown = true);
c.addEventListener('mouseup', () => mouseDown = false);
c.addEventListener('mouseleave', () => mouseDown = false);

// — KEYBOARD CONTROL (WASD + SPACEBAR = PAINT)
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  keys.add(k);
  if (k === ' ') spaceDown = true;
  useMouse = false; // switch to keyboard
});
addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  keys.delete(k);
  if (k === ' ') spaceDown = false;
});

colorInput.oninput = () => col = colorInput.value;
trailToggle.onchange = () => enabled = trailToggle.checked;
clearBtn.onclick = () => { paths.length = 0; currentPath = null; };
saveBtn.onclick = () => {
  const link = document.createElement('a');
  link.download = `8bit-art-${Date.now()}.png`;
  link.href = c.toDataURL('image/png');
  link.click();
};

requestAnimationFrame(function frame() {
  // — KEYBOARD MOVEMENT (only when not using mouse)
  if (!useMouse) {
    const speed = 8;
    if (keys.has('a') || keys.has('arrowleft')) x -= speed;
    if (keys.has('d') || keys.has('arrowright')) x += speed;
    if (keys.has('w') || keys.has('arrowup')) y -= speed;
    if (keys.has('s') || keys.has('arrowdown')) y += speed;
  }

  // CLAMP
  x = Math.max(0, Math.min(512 - S, x));
  y = Math.max(0, Math.min(512 - S, y));

  // — DRAW LOGIC
  const shouldDraw = enabled && (
    (useMouse && mouseDown) ||      // Mouse: click + drag
    (!useMouse && spaceDown)        // Keyboard: hold space
  );

  if (shouldDraw) {
    const px = x + S/2, py = y + S/2;

    if (!currentPath || currentPath.color !== col) {
      currentPath = { points: [], color: col };
      paths.push(currentPath);
    }

    const last = currentPath.points[currentPath.points.length - 1];
    if (!last || Math.hypot(px - last.x, py - last.y) > 1) {
      currentPath.points.push({ x: px, y: py });
    }
  } else {
    currentPath = null;
  }

  // — RENDER
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, 512, 512);

  for (const path of paths) {
    if (path.points.length === 0) continue;
    if (path.points.length === 1) {
      ctx.fillStyle = path.color;
      ctx.beginPath();
      ctx.arc(path.points[0].x, path.points[0].y, S * 0.4, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.strokeStyle = path.color;
    ctx.lineWidth = S * 0.8;
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
