// Wait for DOM to load before accessing elements
document.addEventListener('DOMContentLoaded', function() {
  // Your existing code goes here, e.g.:
  const canvas = document.getElementById('game');  // Assuming this is your canvas ID from the screenshot
  const ctx = canvas.getContext('2d');
  
  // Now safely set event listeners
  const clearBtn = document.getElementById('clearCanvas');
  if (clearBtn) {  // Defensive check
    clearBtn.onclick = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Optional: Reset brush or add a confirmation
    };
  } else {
    console.error('Clear button not found! Check ID in HTML.');
  }
  
  // Similarly for other elements, like color picker or brush size slider
  const colorPicker = document.getElementById('color');  // Adjust ID as needed
  if (colorPicker) {
    colorPicker.onchange = function() {
      ctx.strokeStyle = this.value;
    };
  }
});
