const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const minimap = document.getElementById("minimap");
const miniCtx = minimap.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 3,
  color: "#ff0000",
  brushSize: 10,
  trailOn: true
};

// Input
let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Touch (mobile)
let touch = null;
canvas.addEventListener("touchstart", e => {
  touch = e.touches[0];
});
canvas.addEventListener("touchmove", e => {
  touch = e.touches[0];
});
canvas.addEventListener("touchend", () => {
  touch = null;
});

// Particle system
let particles = [];

function spawnParticles(x, y, color) {
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: x,
      y: y,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      life: 20,
      color
    });
  }
}

// UI controls
document.getElementById("colorPicker").addEventListener("input", e => {
  player.color = e.target.value;
});

document.getElementById("brushSize").addEventListener("input", e => {
  player.brushSize = parseInt(e.target.value);
});

document.getElementById("toggleTrail").addEventListener("click", e => {
  player.trailOn = !player.trailOn;
  e.target.textContent = "Trail: " + (player.trailOn ? "ON" : "OFF");
});

// Movement logic
function movePlayer() {
  if (keys["w"] || keys["ArrowUp"]) player.y -= player.speed;
  if (keys["s"] || keys["ArrowDown"]) player.y += player.speed;
  if (keys["a"] || keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["d"] || keys["ArrowRight"]) player.x += player.speed;

  if (touch) {
    let tx = touch.clientX;
    let ty = touch.clientY;

    let angle = Math.atan2(ty - player.y, tx - player.x);
    player.x += Math.cos(angle) * player.speed;
    player.y += Math.sin(angle) * player.speed;
  }
}

// Draw particles
function updateParticles() {
  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 2, 2);
  });
}

// Minimap rendering
function drawMinimap() {
  miniCtx.clearRect(0, 0, minimap.width, minimap.height);

  let scale = 0.05;

  miniCtx.fillStyle = "#00ff00";
  miniCtx.fillRect(
    player.x * scale - 2,
    player.y * scale - 2,
    4,
    4
  );
}

// Main loop
function loop() {
  requestAnimationFrame(loop);

  movePlayer();

  // Leave paint trail
  if (player.trailOn) {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.brushSize, 0, Math.PI * 2);
    ctx.fill();

    spawnParticles(player.x, player.y, player.color);
  }

  updateParticles();
  drawMinimap();
}

loop();
