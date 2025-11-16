// 8bit.exe — MOBILE + DESKTOP (TOUCH + MOUSE + KEYBOARD)
const c = document.getElementById('c');
const ctx = c.getContext('2d');

const colorInput = document.getElementById('color');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');

const S = 16;
let x = 256 - S/2;
let y = 256 - S/2;
let col = colorInput.value;
let drawing = false;
let moving = false;
let useTouchMove = false;

const paths = [];
let currentPath = null;

// — TOUCH & MOUSE (UNIFIED)
let lastTouch = null;

c.addEventListener('pointerdown', e => {
  e.preventDefault();
  const rect = c.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;

  if (e.pointerType === 'touch' && e.touches && e.touches.length === 2) {
    moving = true;
    useTouchMove = true;
    return;
  }

  x = px - S/2;
  y = py - S/2;
  drawing = true;
  lastTouch = { x: px, y: py };
});

c.addEventListener('pointermove', e => {
  e.preventDefault();
  const rect = c.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;

  if (moving && useTouchMove) {
    // Two-finger drag = move canvas position
    if (lastTouch) {
      x += px - lastTouch.x;
      y += py - lastTouch.y;
    }
    lastTouch = { x: px, y: py };
    return;
  }

  if (drawing) {
    x = px - S/2;
    y = py - S/2;
    addPoint(px, py);
  }
});

c.addEventListener('pointerup', () => {
  drawing = false;
  moving = false;
  currentPath = null;
  lastTouch = null;
});

// — KEYBOARD (DESKTOP ONLY)
const keys = new Set();
addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

colorInput.oninput = () => col = colorInput.value;
clearBtn.onclick = () => { paths.length = 0; currentPath = null; };
saveBtn.onclick = () => {
  const link = document.createElement('a');
  link.download = `8bit-art-${Date.now()}.png`;
  link.href = c.toDataURL('image/png');
  link.click();
};

function addPoint(px, py) {
  if (!currentPath || currentPath.color !== col) {
    currentPath = { points: [], color: col };
    paths.push(currentPath);
  }
  const last = currentPath.points[currentPath.points.length - 1];
  if (!last || Math.hypot(px - last.x, py - last.y) > 1) {
    currentPath.points.push({ x: px, y: py });
  }
}

requestAnimationFrame(function frame() {
  // — KEYBOARD MOVEMENT (desktop only)
  if (!useTouchMove && !drawing) {
    const speed = 8;
    if (keys.has('a') || keys.has('arrowleft')) x -= speed;
    if (keys.has('d') || keys.has('arrowright')) x += speed;
    if (keys.has('w') || keys.has('arrowup')) y -= speed;
    if (keys.has('s') || keys.has('arrowdown')) y += speed;
  }

  x = Math.max(0, Math.min(512 - S, x));
  y = Math.max(0, Math.min(512 - S, y));

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

  ctx.fillStyle = col;
  ctx.fillRect(x, y, S, S);

  requestAnimationFrame(frame);
});
