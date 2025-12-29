window.flowing = window.flowing || {};
window.flowing["dot-waves"] = {
  state: animationId: null  ,
  run(config) {
    var self = this;
        var target = document.getElementById("preview-target");
        if (!target) return;

        // Cancel previous animation loop
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
        }

        // Create canvas
        var canvas = document.createElement("canvas");
        canvas.width = target.clientWidth || 800;
        canvas.height = target.clientHeight || 600;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        target.innerHTML = "";
        target.appendChild(canvas);

        var ctx = canvas.getContext("2d");
        var time = 0;
        var dots = [];
        var cols = Math.floor(canvas.width / (config.dotSize + config.dotGap));
        var rows = Math.floor(canvas.height / (config.dotSize + config.dotGap));

        // Initialize dots
        for (var y = 0; y < rows; y++) {
          for (var x = 0; x < cols; x++) {
            dots.push({
              x: x * (config.dotSize + config.dotGap) + config.dotGap,
              y: y * (config.dotSize + config.dotGap) + config.dotGap,
              baseX: x,
              baseY: y
            });
          }
        }

        function animate() {
          ctx.fillStyle = config.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          dots.forEach(function (dot, i) {
            var offset = 0;
            var cx = canvas.width / 2;
            var cy = canvas.height / 2;

            switch (config.animationType) {
              case "circle":
                var dist = Math.sqrt(Math.pow(dot.x - cx, 2) + Math.pow(dot.y - cy, 2));
                offset = Math.sin(dist * config.waveFrequency * 0.01 - time) * config.waveAmplitude;
                break;
              case "waves":
                offset = Math.sin(dot.baseX * config.waveFrequency * 0.1 + time) * config.waveAmplitude;
                break;
              case "aurora":
                offset = Math.sin(dot.baseX * 0.05 + time) * Math.cos(dot.baseY * 0.03 + time * 0.5) * config.waveAmplitude;
                break;
              case "turbulence":
                offset = (Math.sin(dot.x * 0.02 + time) + Math.cos(dot.y * 0.02 - time * 0.7)) * config.waveAmplitude * 0.5;
                break;
              case "plasma":
                offset = Math.sin(dot.x * 0.01 + time) + Math.sin(dot.y * 0.01 + time * 0.5) + Math.sin((dot.x + dot.y) * 0.01 + time * 0.3);
                offset *= config.waveAmplitude * 0.3;
                break;
              case "perlin":
                offset = Math.sin(dot.baseX * 0.2 + time) * Math.sin(dot.baseY * 0.2 + time * 0.8) * config.waveAmplitude;
                break;
              default:
                offset = Math.sin(dot.baseY * config.waveFrequency * 0.1 + time) * config.waveAmplitude;
            }

            var size = config.dotSize + offset * 0.5;
            if (size < 1) size = 1;

            // Color gradient
            var t = (dot.y / canvas.height);
            if (config.colorMode === "gradient") {
              ctx.fillStyle = lerpColor(config.dotColor1, config.dotColor2, t);
            } else {
              ctx.fillStyle = config.dotColor1;
            }

            ctx.beginPath();
            if (config.dotType === "fill") {
              ctx.arc(dot.x, dot.y + offset, size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.arc(dot.x, dot.y + offset, size / 2, 0, Math.PI * 2);
              ctx.strokeStyle = ctx.fillStyle;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });

          time += config.speed * 0.05;
          self.animationId = requestAnimationFrame(animate);
        }

        function lerpColor(a, b, t) {
          var ah = parseInt(a.replace(/#/g, ""), 16);
          var bh = parseInt(b.replace(/#/g, ""), 16);
          var ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
          var br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
          var rr = ar + t * (br - ar);
          var rg = ag + t * (bg - ag);
          var rb = ab + t * (bb - ab);
          return "rgb(" + Math.round(rr) + "," + Math.round(rg) + "," + Math.round(rb) + ")";
        }

        animate();
  }
};
