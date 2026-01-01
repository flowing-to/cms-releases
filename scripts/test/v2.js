window.flowing = window.flowing || {};
window.flowing["test"] = {
  run(config) {
    // Get canvas and context
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const info = document.getElementById('info');

    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a simple animation
    let frame = 0;
    function animate() {
      // Clear canvas
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw circle
      const x = canvas.width / 2 + Math.cos(frame * 0.02) * 100;
      const y = canvas.height / 2 + Math.sin(frame * 0.02) * 100;

      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fillStyle = '#3498db';
      ctx.fill();

      // Update info
      info.textContent = `Frame: ${frame} | Position: (${Math.round(x)}, ${Math.round(y)})`;

      frame++;
      requestAnimationFrame(animate);
    }

    animate();
    console.log("Test script initialized successfully");
  }
};
