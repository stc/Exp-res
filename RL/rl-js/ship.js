function Ship(data) {
    this.pos = createVector(data.x, data.y);
    this.vel = createVector(0, 0);
    this.r = data.r;
    this.y_offset = 0;
    this.x_offset = 0;
    this.num_sensors = data.num_sensors;
    this.sensor_length = 200;
    this.alive = true;
}

//update ships positon
Ship.prototype.update = function() {
    this.vel.mult(0.95);

    var force = createVector(this.x_offset, this.y_offset);
    this.vel.add(force);

    this.pos.add(this.vel);
}

//check if dead // TODO: Refactor
Ship.prototype.isDead = function() {
    for (var i in asteroids) {
        var d = p5.Vector.dist(this.pos, asteroids[i].pos);
        if (d < this.r + asteroids[i].r) {
            return true;
        }
    }

    if (this.pos.x + this.r > width) {
        return true;
    } else if (this.pos.x - this.r < 0) {
        return true;
    }

    if (this.pos.y + this.r > height) {
        return true;
    } else if (this.pos.y - this.r < 0) {
        return true;
    }
}

Ship.prototype.setYoffset = function(offset) {
    this.y_offset = offset;
}

Ship.prototype.setXoffset = function(offset) {
    this.x_offset = offset;
}

//check if asteroid is near the ship
Ship.prototype.isNear = function(other) {
    return other.pos.x + other.r > this.pos.x - width / 2 && other.pos.x - other.r < this.pos.x + width / 2 &&
        other.pos.y + other.r > this.pos.y - height / 2 && other.pos.y - other.r < this.pos.y + height / 2;
}

//get the info from the sensors and draw line
Ship.prototype.detect = function() {
    var sensor_data = [];
    for (var i = 0; i < this.num_sensors; i++) {
        sensor_data.push(1);
    }

    var it = TWO_PI / this.num_sensors;

    for (var i = 0; i < this.num_sensors; i++) {

        var angle = it * i;
        var x = this.pos.x + cos(angle);
        var y = this.pos.y + sin(angle);

        var x2 = this.pos.x + this.sensor_length * cos(angle);
        var y2 = this.pos.y + this.sensor_length * sin(angle);

        for (var j in asteroids) {
            var data = inCircle(x, y, x2, y2, asteroids[j].pos.x, asteroids[j].pos.y, asteroids[j].r);
            if (data < sensor_data[i]) {
                sensor_data[i] = data;
            }
        }

        for (var j in walls) {
            var data = isIntersecting(x, y, x2, y2, walls[j]);
            if (data < sensor_data[i]) {
                sensor_data[i] = data;
            }
        }

        strokeWeight(0.5);
        if (sensor_data[i] < 1) {
            stroke(255, 100, 100);
            line(x, y, x2, y2);
        }

    }
    return sensor_data;
}

//show the ship
Ship.prototype.show = function() {
    stroke(100, 255, 100);
    strokeWeight(1);

    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
}