const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const minimap = document.getElementById("minimap");
const mapCtx = minimap.getContext("2d");

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Camera center
let camX = 0;
let camY = 0;

const player = {
  x: 0,
  y: 0,
  size: 20,
  color: "#00ffcc",
  speed: 4,
  paint: true,
  brush: 20
};

let paintTrail = [];
let particles = [];

// Input keys
const keys = { w: false, a: false, s: false, d: false };

document.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  if (keys[k] !== undefined) keys[k] = true;
});

document.addEventListener("keyup", e => {
  const k = e.key.toLowerCase();
  if (keys[k] !== undefined) keys[k] = false;
});

// UI Controls
document.getElementById("togglePaint").onclick = () =>
  (player.paint = !player.paint);

document.getElementById("colorPicker").oninput = e =>
  (player.color = e.target.value);

document.getElementById("brushSize").oninput = e =>
  (player.brush = parseInt(e.target.value));

// Main loop
function loop() {
  movePlayer();
  updateParticles();
  draw();
  drawMinimap();
  requestAnimationFrame(loop);
}

function movePlayer() {
  let dx = 0, dy = 0;

  // Desktop
  if (keys.w) dy -= 1;
  if (keys.s) dy += 1;
  if (keys.a) dx -= 1;
  if (keys.d) dx += 1;

  // Mobile joystick
  if (joy.active) {
    dx = joy.dx;
    dy = joy.dy;
  }

  if (dx !== 0 || dy !== 0) {
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    dx /= len;
    dy /= len;

    player.x += dx * player.speed;
    player.y += dy * player.speed;

    emitParticles(player.x, player.y);

    if (player.paint) {
      paintTrail.push({
        x: player.x,
        y: player.y,
        size: player.brush,
        color: player.color
      });
    }
  }

  // Camera centers on player
  camX = player.x - canvas.width / 2;
  camY = player.y - canvas.height / 2;
}

function updateParticles() {
  particles = particles.filter(p => {
    p.life--;
    p.x += p.vx;
    p.y += p.vy;
    return p.life > 0;
  });
}

function emitParticles(x, y) {
  for (let i = 0; i < 4; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 20,
      size: 4,
      color: player.color
    });
  }
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Paint
  for (const dot of paintTrail) {
    ctx.fillStyle = dot.color;
    ctx.fillRect(
      dot.x - camX,
      dot.y - camY,
      dot.size,
      dot.size
    );
  }

  // Particles
  for (const p of particles) {
    ctx.fillStyle = p.color;
    ctx.fillRect(
      p.x - camX,
      p.y - camY,
      p.size,
      p.size
    );
  }

  // Player (centered)
  ctx.fillStyle = player.color;
  ctx.fillRect(
    canvas.width / 2 - player.size / 2,
    canvas.height / 2 - player.size / 2,
    player.size,
    player.size
  );
}

function drawMinimap() {
  mapCtx.fillStyle = "#000";
  mapCtx.fillRect(0, 0, 200, 200);

  // Draw paint points scaled down
  for (const dot of paintTrail) {
    const mx = 100 + dot.x / 50;
    const my = 100 + dot.y / 50;

    mapCtx.fillStyle = dot.color;
    mapCtx.fillRect(mx, my, 2, 2);
  }

  // Player position
  const px = 100 + player.x / 50;
  const py = 100 + player.y / 50;
  mapCtx.fillStyle = "#fff";
  mapCtx.fillRect(px - 2, py - 2, 4, 4);
}

loop();
