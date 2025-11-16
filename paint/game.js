// WRAP EVERYTHING IN DOMContentLoaded TO ENSURE ELEMENTS EXIST
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const minimap = document.getElementById("minimap");
  const miniCtx = minimap.getContext("2d");

  // Resize canvas
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Player
  const player = {
    x: canvas.width/2,
    y: canvas.height/2,
    size: 20,
    speed: 4,
    color: "#00ffcc",
    brushSize: 10,
    trailOn: true
  };

  // Input
  const keys = {};
  document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
  document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

  // UI Elements (guaranteed to exist now)
  const colorPicker = document.getElementById("colorPicker");
  const brushSizeInput = document.getElementById("brushSize");
  const toggleTrailBtn = document.getElementById("toggleTrail");

  colorPicker.addEventListener("input", e => player.color = e.target.value);
  brushSizeInput.addEventListener("input", e => player.brushSize = parseInt(e.target.value));
  toggleTrailBtn.addEventListener("click", () => {
    player.trailOn = !player.trailOn;
    toggleTrailBtn.textContent = "Trail: " + (player.trailOn ? "ON" : "OFF");
  });

  // Trail & particles
  const trail = [];
  let particles = [];

  function spawnParticles(x, y, color) {
    for (let i=0;i<5;i++){
      particles.push({x,y,dx:(Math.random()-0.5)*2,dy:(Math.random()-0.5)*2,life:20,color});
    }
  }

  // Main loop
  function loop() {
    requestAnimationFrame(loop);
    movePlayer();
    draw();
    drawMinimap();
    updateParticles();
  }

  function movePlayer() {
    let dx=0, dy=0;
    if(keys.w||keys.arrowup) dy -= player.speed;
    if(keys.s||keys.arrowdown) dy += player.speed;
    if(keys.a||keys.arrowleft) dx -= player.speed;
    if(keys.d||keys.arrowright) dx += player.speed;

    if(dx!==0||dy!==0){
      const len=Math.sqrt(dx*dx+dy*dy)||1;
      dx/=len; dy/=len;
      player.x += dx*player.speed;
      player.y += dy*player.speed;

      if(player.trailOn){
        trail.push({x:player.x,y:player.y,size:player.brushSize,color:player.color});
        spawnParticles(player.x, player.y, player.color);
      }
    }
  }

  function draw() {
    ctx.fillStyle="#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    trail.forEach(dot => {
      ctx.fillStyle=dot.color;
      ctx.beginPath();
      ctx.arc(dot.x,dot.y,dot.size,0,Math.PI*2);
      ctx.fill();
    });

    particles.forEach(p => {
      ctx.fillStyle=p.color;
      ctx.fillRect(p.x,p.y,2,2);
    });

    ctx.fillStyle=player.color;
    ctx.fillRect(player.x-player.size/2, player.y-player.size/2, player.size, player.size);
  }

  function updateParticles(){
    particles=particles.filter(p=>p.life>0);
    particles.forEach(p=>{p.x+=p.dx; p.y+=p.dy; p.life--;});
  }

  function drawMinimap(){
    miniCtx.clearRect(0,0,minimap.width,minimap.height);
    const scale=0.05;

    trail.forEach(dot=>{
      miniCtx.fillStyle=dot.color;
      miniCtx.fillRect(dot.x*scale,dot.y*scale,2,2);
    });

    miniCtx.fillStyle="#fff";
    miniCtx.fillRect(player.x*scale-2, player.y*scale-2,4,4);
  }

  loop();
});
