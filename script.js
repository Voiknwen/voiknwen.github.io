document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const voidElement = document.querySelector('.void');
    const impossibleShapeCanvas = document.getElementById('impossible-shape');
    const particleCanvas = document.getElementById('particle-canvas');
    const sandsCanvas = document.getElementById('shifting-sands');

    // --- Theme Toggle ---
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;  // Ensure toggle reflects saved state.
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });


    // --- Section 2: The Void ---
    let voidExpanded = false;
    voidElement.addEventListener('click', () => {
        voidElement.classList.toggle('expanded');
        voidExpanded = !voidExpanded;
    });

    // --- Section 3: Impossible Shape ---
    const impossibleShapeCtx = impossibleShapeCanvas.getContext('2d');
    let isDragging = false;
    let startX, startY;

    function drawImpossibleShape(x, y, size, color) {
      impossibleShapeCtx.clearRect(0, 0, impossibleShapeCanvas.width, impossibleShapeCanvas.height);
      impossibleShapeCtx.beginPath();

      // Adjust coordinates based on the drag offset
      const centerX = impossibleShapeCanvas.width / 2 + x;
      const centerY = impossibleShapeCanvas.height / 2 + y;

      const halfSize = size / 2;

      // Define points for an "impossible triangle" (Penrose Triangle)
      const p1 = { x: centerX, y: centerY - halfSize * 0.866 };  //  sin(60deg) = 0.866
      const p2 = { x: centerX - halfSize, y: centerY + halfSize * 0.433 }; // 0.866 / 2
      const p3 = { x: centerX + halfSize, y: centerY + halfSize * 0.433 };

      // Draw the three "bars" that create the illusion
      drawBar(p1, p2, size * 0.2, color);
      drawBar(p2, p3, size * 0.2, color);
      drawBar(p3, p1, size * 0.2, color);
      impossibleShapeCtx.closePath();
  }

    function drawBar(start, end, width, color) {
      impossibleShapeCtx.beginPath();
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const dx = Math.cos(angle) * width / 2;
        const dy = Math.sin(angle) * width / 2;

        impossibleShapeCtx.moveTo(start.x - dy, start.y + dx);
        impossibleShapeCtx.lineTo(start.x + dy, start.y - dx);
        impossibleShapeCtx.lineTo(end.x + dy, end.y - dx);
        impossibleShapeCtx.lineTo(end.x - dy, end.y + dx);
        impossibleShapeCtx.fillStyle = color;
        impossibleShapeCtx.fill();
        impossibleShapeCtx.closePath();
    }
    let dragOffsetX = 0;
    let dragOffsetY = 0;

        impossibleShapeCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - impossibleShapeCanvas.offsetLeft;
        startY = e.clientY - impossibleShapeCanvas.offsetTop;
        //Calculate offset
        dragOffsetX = startX - (impossibleShapeCanvas.width / 2) - dragOffsetX;
        dragOffsetY = startY - (impossibleShapeCanvas.height / 2) - dragOffsetY;

        impossibleShapeCanvas.style.cursor = 'grabbing';
    });

    impossibleShapeCanvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const mouseX = e.clientX - impossibleShapeCanvas.offsetLeft;
        const mouseY = e.clientY - impossibleShapeCanvas.offsetTop;

        // Update drag offset.
        dragOffsetX = mouseX - impossibleShapeCanvas.width/2 ;
        dragOffsetY = mouseY - impossibleShapeCanvas.height/2 ;

        const shapeColor = document.body.classList.contains('dark-mode') ? '#eee' : '#333';
        drawImpossibleShape(dragOffsetX, dragOffsetY, 70, shapeColor);
    });

    impossibleShapeCanvas.addEventListener('mouseup', () => {
        isDragging = false;
        impossibleShapeCanvas.style.cursor = 'grab';
    });
    impossibleShapeCanvas.addEventListener('mouseleave', () => {
      isDragging = false; //Reset
      impossibleShapeCanvas.style.cursor = 'grab';
    });
      // Initial draw
    drawImpossibleShape(0, 0, 70, '#333');



    // --- Section 4: Chaotic Particles ---
    const particleCtx = particleCanvas.getContext('2d');
    let particles = [];

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = document.body.classList.contains('dark-mode') ? `hsl(${Math.random() * 360}, 100%, 70%)` : `hsl(${Math.random() * 360}, 100%, 50%)`; // Brighter in dark mode
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size -= 0.1; // Shrink over time
        }

        draw() {
            particleCtx.beginPath();
            particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            particleCtx.fillStyle = this.color;
            particleCtx.fill();
            particleCtx.closePath();
        }
    }

    function handleParticles() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].size <= 0.2) {
                particles.splice(i, 1);
                i--;
            }
        }
    }

    particleCanvas.addEventListener('click', (e) => {
        const x = e.clientX - particleCanvas.offsetLeft;
        const y = e.clientY - particleCanvas.offsetTop;
        for (let i = 0; i < 10; i++) { // Burst of particles
            particles.push(new Particle(x, y));
        }
    });
    function animateParticles(){
      particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      handleParticles();
      requestAnimationFrame(animateParticles);
    }

    animateParticles();


    // --- Section 5:  Shifting Sands ---

const sandsCtx = sandsCanvas.getContext('2d');
let time = 0;

function drawSands() {
    sandsCtx.clearRect(0, 0, sandsCanvas.width, sandsCanvas.height);

    const numLayers = 5;
    for (let i = 0; i < numLayers; i++) {
        const amplitude = 20 + i * 10;
        const frequency = 0.01 + i * 0.005;

        sandsCtx.beginPath();
        sandsCtx.moveTo(0, sandsCanvas.height / 2);

        for (let x = 0; x < sandsCanvas.width; x++) {
            const y = sandsCanvas.height / 2 + amplitude * Math.sin(frequency * x + time + i);
              sandsCtx.lineTo(x, y);
        }

        // Create a gradient for each layer
        const gradient = sandsCtx.createLinearGradient(0, 0, 0, sandsCanvas.height);
        if (document.body.classList.contains('dark-mode')) {
            // Dark mode gradients
            gradient.addColorStop(0, `hsl(${200 + i * 20}, 100%, 50%)`);  // Blue hues
            gradient.addColorStop(1, `hsl(${240 + i * 10}, 100%, 30%)`);  // Darker blue
        } else {
            // Light mode gradients
            gradient.addColorStop(0, `hsl(${i * 40}, 100%, 50%)`); // Different hues
            gradient.addColorStop(1, `hsl(${i * 40 + 20}, 100%, 70%)`);// Lighter shade
        }


        sandsCtx.lineTo(sandsCanvas.width, sandsCanvas.height);
        sandsCtx.lineTo(0, sandsCanvas.height);
        sandsCtx.fillStyle = gradient;
        sandsCtx.fill();
        sandsCtx.closePath();
    }
     time += 0.02;
}
function animateSand(){
        drawSands();
        requestAnimationFrame(animateSand);
}
animateSand();
});