const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
    x: undefined,
    y: undefined
};

const MAX_RADIUS = 40, MAX_PARTICLES = 400, VELOCITY = 4;

const _colours = [
    '#0057AC',
    '#00C6EE',
    '#95D6DA',
    '#F4F2E3',
    '#193441'
];

addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
})

class Particle {
    constructor(x, y, dx, dy, radius, colour) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.minRadius = radius;
        this.colour = colour;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.colour;
        c.fill();
    };

    grow() {
        if (this.radius < MAX_RADIUS) {
            this.radius += 1;
        }
    };

    shrink() {
        this.radius -= 1;
    };

    update() {
        this.draw();

        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        
        if ((mouse.x - this.x < 50 && mouse.x - this.x > -50) && (mouse.y - this.y < 50 && mouse.y - this.y > -50)) {
            this.grow();
        }
        else if (this.radius > this.minRadius) {
            this.shrink();
        }
        
        this.x += this.dx;
        this.y += this.dy;
    };
}

let _particles = [];

function init() {
    _particles = [];

    for (let i = 0; i < MAX_PARTICLES; i++) {
        const radius = Math.random() * 3 + 1, 
              velocity = 4;

        let x = Math.random() * (innerWidth - radius * 2) + radius,
            y = Math.random() * (innerHeight - radius * 2) + radius,
            dx = (Math.random() - 0.5) * velocity,
            dy = (Math.random() - 0.5) * velocity,
            colour = _colours[Math.floor(Math.random() * _colours.length - 1)];

        var particle = new Particle(x, y, dx, dy, radius, colour);
        _particles.push(particle);
    }
}

function draw() {
    for (let i = 0; i < _particles.length; i++) {
        _particles[i].update();
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

init();
animate();