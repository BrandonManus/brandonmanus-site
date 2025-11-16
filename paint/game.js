// trail.exe — FIXED FOR REAL ART
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
let on = trailToggle.checked;

// MULTIPLE PATHS — NO CONNECTING LINES, COLORS STICK
const paths = [];  // [{points: [], color: ''}]

const keys = new Set();
addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

colorInput.oninput = () => col = colorInput.value;
trailToggle.onchange = () => on = trailToggle.checked;
clearBtn.onclick = () => paths.length = 0;

requestAnimationFrame(function frame() {
  const speed = 7;
  if (keys.has('a') || keys.has('arrowleft')) x -= speed;
  if (keys.has('d') || keys.has('arrowright')) x += speed;
  if (keys.has('w') || keys.has('arrowup')) y -= speed;
  if (keys.has('s') || keys.has('arrowdown')) y += speed;

  x = Math.max(0, Math.min(c.width - S, x));
  y = Math.max(0, Math.min(c.height - S, y));

  // NEW PATH WHEN TOGGLE ON
  if (on) {
    let activePath = paths[paths.length - 1];
    if (!activePath || activePath.color !== col) {
      paths.push({ points: [], color: col });
      activePath = paths[paths.length - 1];
    }
    activePath.points.push({ x: x + S/2, y: y + S/2 });
  }

  // RENDER
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, c.width, c.height);

  // DRAW EACH PATH SEPARATELY
  for (let path of paths) {
    if (path.points.length > 1) {
      ctx.strokeStyle = path.color;
      ctx.lineWidth = S * 0.75;
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.beginPath();
      path.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }
  }

  ctx.fillStyle = col;
  ctx.fillRect(x, y, S, S);

  requestAnimationFrame(frame);
});
