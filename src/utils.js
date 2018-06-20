function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function rotate(velocity, angle) {
    return {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
}

function velocityAfterCollision(a, b, m1, m2) {
    return {
        x: a.x * (m1 - m2) / (m1 + m2) + b.x * 2 * m2 / (m1 + m2),
        y: a.y
    };
}

function determineAngle(a, b) {
    return -Math.atan2(b.y - a.y, b.x - a.x);
}

function resolveCollision(particle, otherParticle) {
    const xDistance = otherParticle.x - particle.x;
    const yDistance = otherParticle.y - particle.y;

    const xVelocityDiff = (particle.velocity.x - otherParticle.velocity.x) * xDistance;
    const yVelocityDiff = (particle.velocity.y - otherParticle.velocity.y) * yDistance;

    // Prevent accidental overlap of particles
    if (xVelocityDiff + yVelocityDiff >= 0) {
        // Determine the angle between the two particles
        const angle = determineAngle(otherParticle, particle);

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity = rotate(velocityAfterCollision(u1, u2, particle.mass, otherParticle.mass), -angle);
        otherParticle.velocity = rotate(velocityAfterCollision(u2, u1, particle.mass, otherParticle.mass), -angle);
    }
}

module.exports = { distance, resolveCollision };
