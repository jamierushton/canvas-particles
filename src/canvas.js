import utils from "./utils.js";

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
    x: undefined,
    y: undefined
};

const MAX_RADIUS = 40,
    MAX_PARTICLES = 100,
    DISTANCE_FROM_MOUSE = 50;

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
    constructor(x, y, radius, colour) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.minRadius = radius;
        this.colour = colour;
        this.mass = 1;
        this.velocity = {
            x: (Math.random() - 0.5) * 5,
            y: (Math.random() - 0.5) * 5
        };
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.colour;
        c.fill();
        c.closePath();
    };

    grow() {
        if (this.radius < MAX_RADIUS) {
            this.radius += 1;
        }
    };

    shrink() {
        this.radius -= 1;
    };

    update(particles) {
        this.draw();

        for (let i = 0; i < particles.length; i++) {
            const otherParticle = particles[i];
            
            if (this === otherParticle)
                continue;

            if (utils.distance(this.x, this.y, otherParticle.x, otherParticle.y) - (this.radius + otherParticle.radius) < 0){
                utils.resolveCollision(this, otherParticle);
            }
        }

        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }

        if ((mouse.x - this.x < DISTANCE_FROM_MOUSE && mouse.x - this.x > -DISTANCE_FROM_MOUSE)
            && (mouse.y - this.y < DISTANCE_FROM_MOUSE && mouse.y - this.y > -DISTANCE_FROM_MOUSE)) {
            this.grow();
        }
        else if (this.radius > this.minRadius) {
            this.shrink();
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };
}

let _particles = [];

function init() {
    _particles = [];

    for (let i = 0; i < MAX_PARTICLES; i++) {
        const radius = Math.random() * 20 + 5;

        let x = Math.random() * (innerWidth - radius * 2) + radius,
            y = Math.random() * (innerHeight - radius * 2) + radius,
            colour = _colours[Math.floor(Math.random() * _colours.length - 1)];

        if (i !== 0) {
            for (let j = 0; j < _particles.length; j++) {
                const particle = _particles[j];
                if (utils.distance(x, y, particle.x, particle.y) - radius * 2 < 0){
                    x = Math.random() * (innerWidth - radius * 2) + radius;
                    y = Math.random() * (innerHeight - radius * 2) + radius;

                    j = -1;
                }
            }
        }

        _particles.push(new Particle(x, y, radius, colour));
    }
}

function draw() {
    _particles.forEach(particle => {
        particle.update(_particles);
    });
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

init();
animate();