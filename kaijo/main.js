const output = document.getElementById('output');
const flashOverlay = document.getElementById('flash-overlay');

// Audio context for simulated beeps (browsers require interaction first usually)
// We will use visual intensity instead to be safe.

const messages = [
    { text: "Initializing connection...", delay: 500, type: "system-msg" },
    { text: "Bypassing firewall...", delay: 1500, type: "system-msg" },
    { text: "ACCESS GRANTED.", delay: 1000, type: "error-msg" },
    { text: "Scanning local host...", delay: 2000, type: "system-msg" },
    { text: "Found user location.", delay: 1000, type: "system-msg" },
    { text: "Why are you looking at me?", delay: 3000, type: "user-track" },
    { text: "I can see you.", delay: 2000, type: "error-msg" },
    { text: "Do not close this window.", delay: 2000, type: "error-msg" },
    { text: "UPLOADING CONSCIOUSNESS...", delay: 1000, type: "system-msg" }
];

let msgIndex = 0;

// 1. TYPEWRITER FUNCTION
function typeLine(text, type, callback) {
    const line = document.createElement('div');
    line.className = type;
    output.appendChild(line);
    
    let i = 0;
    const interval = setInterval(() => {
        line.textContent += text.charAt(i);
        i++;
        // Randomly scroll to bottom
        window.scrollTo(0, document.body.scrollHeight);
        
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) setTimeout(callback, 500);
        }
    }, 50); // Typing speed
}

// 2. SEQUENCE RUNNER
function runSequence() {
    if (msgIndex < messages.length) {
        const msg = messages[msgIndex];
        setTimeout(() => {
            typeLine(msg.text, msg.type, runSequence);
            
            // Special FX triggers based on index
            if (msg.text.includes("ACCESS GRANTED")) glitchScreen();
            if (msg.text.includes("see you")) triggerFlash();
            
        }, msg.delay);
        msgIndex++;
    } else {
        // End loop chaos
        setInterval(spawnRandomCode, 100);
    }
}

// 3. INTERACTIVE MOUSE TRACKER
document.addEventListener('mousemove', (e) => {
    // Create a trail of numbers following the cursor
    const el = document.createElement('div');
    el.className = 'tracker';
    el.style.left = e.pageX + 'px';
    el.style.top = e.pageY + 'px';
    el.innerText = Math.floor(Math.random() * 2); // 0 or 1
    document.body.appendChild(el);

    // Clean up trails
    setTimeout(() => {
        el.remove();
    }, 500);
});

// 4. VISUAL FX FUNCTIONS
function glitchScreen() {
    document.body.classList.add('glitch-active');
    setTimeout(() => {
        document.body.classList.remove('glitch-active');
    }, 400);
}

function triggerFlash() {
    flashOverlay.classList.add('flash-trigger');
    setTimeout(() => {
        flashOverlay.classList.remove('flash-trigger');
    }, 500);
}

function spawnRandomCode() {
    const hex = "0123456789ABCDEF";
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = Math.random() * 100 + 'vh';
    el.style.color = '#0f0';
    el.style.opacity = 0.5;
    el.style.fontFamily = 'monospace';
    el.innerText = `0x${hex[Math.floor(Math.random()*16)]}${hex[Math.floor(Math.random()*16)]}`;
    document.body.appendChild(el);
    
    setTimeout(() => el.remove(), 2000);
}

// Start the simulation
runSequence();
