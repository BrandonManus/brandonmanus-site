// -------------------------------------------------
//  Trail‑Paint Mini‑Game
// -------------------------------------------------

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const trailToggle = document.getElementById('trailToggle');

// ---- Player (square) ----
const PLAYER_SIZE = 30;
let player = {
  x: canvas.width / 2 - PLAYER_SIZE / 2,
  y: canvas.height / 2 - PLAYER_SIZE / 2,
  speed: 5,
  color: colorPicker.value
};

// ---- Trail storage ----
let trail = [];          // [{x,y}]
let drawing = false;     // true when trailToggle is checked

// ---- Input handling ----
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup',   e => keys[e.key] = false);

// ---- UI updates ----
colorPicker.addEventListener('input', () => player.color = colorPicker.value);
trailToggle.addEventListener('change', () => drawing = trailToggle.checked);

// -------------------------------------------------
//  Main game loop
// -------------------------------------------------
function loop() {
  // ---- 1. Update player position ----
  if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
  if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
  if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
  if (keys['ArrowDown'] || keys['s']) player.y += player.speed;

  // Keep inside canvas
  player.x = Math.max(0, Math.min(canvas.width - PLAYER_SIZE, player.x));
  player.y = Math.max(0, Math.min(canvas.height - PLAYER_SIZE, player.y));

  // ---- 2. Add to trail if enabled ----
  if (drawing) {
    const centerX = player.x + PLAYER_SIZE / 2;
    const centerY = player.y + PLAYER_SIZE / 2;
    trail.push({ x: centerX, y: centerY });
  }

  // ---- 3. Render ----
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Trail
  if (trail.length > 1) {
    ctx.strokeStyle = player.color;
    ctx.lineWidth = PLAYER_SIZE * 0.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i++) {
      ctx.lineTo(trail[i].x, trail[i].y);
    }
    ctx.stroke();
  }

  // Player square
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
