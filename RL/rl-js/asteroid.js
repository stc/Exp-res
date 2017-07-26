function Asteroid(data) {
    this.pos = createVector(data.x, data.y);
    this.vel = createVector(0, 1);
    this.r = data.r;
}

//update the position
Asteroid.prototype.update = function() {
    this.pos.add(this.vel);
}

//check if offscreen and if so, remove it
Asteroid.prototype.offscreen = function() {
    if (this.pos.x + this.r < 0 || this.pos.x - this.r > width) {
        return true;
    }

    if (this.pos.y + this.r < 0 || this.pos.y - this.r > height) {
        return true;
    }

}

//show the Asteroid
Asteroid.prototype.show = function() {
    noFill();
    stroke(255);
    strokeWeight(1);

    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
}