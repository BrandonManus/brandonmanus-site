// TRAIL PAINTER - CLEAN, WORKING, NO BULLSHIT
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const colorInput = document.getElementById('color');
const trailToggle = document.getElementById('trail');
const clearBtn = document.getElementById('clear');

const SIZE = 30;
let x = canvas.width / 2 - SIZE / 2;
let y = canvas.height / 2 - SIZE / 2;
let color = colorInput.value;
let drawing = trailToggle.checked;
let trail = [];

const keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

colorInput.addEventListener('input', () => color = colorInput.value);
trailToggle.addEventListener('change', () => drawing = trailToggle.checked);
clearBtn.addEventListener('click', () => trail = []);

function update() {
  const speed = 6;

  if (keys['a'] || keys['arrowleft']) x -= speed;
  if (keys['d'] || keys['arrowright']) x += speed;
  if (keys['w'] || keys['arrowup']) y -= speed;
  if (keys['s'] || keys['arrowdown']) y += speed;

  x = Math.max(0, Math.min(canvas.width - SIZE, x));
  y = Math.max(0, Math.min(canvas.height - SIZE, y));

  if (drawing) {
    trail.push({ x: x + SIZE/2, y: y + SIZE/2 });
  }
}

function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw trail
  if (trail.length > 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = SIZE * 0.7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    for (let p of trail) ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  // Draw player
  ctx.fillStyle = color;
  ctx.fillRect(x, y, SIZE, SIZE);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
