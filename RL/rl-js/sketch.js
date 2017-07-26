//array that holds all ships
var ships = [];
//array that holds all asteroids
var asteroids = [];

//Neuroevolution
var ne;

//one generation
var gen;

//score or reward
var score = 0;

//number of sensors around the ship that servers as an input to Neuroevolution
var num_sensors = 16;
var walls;

var frame = 0;

var isSaved = false;

var load_button;
var slider;

var loaded_model;
var save_button;

function preload() {
    loaded_model = loadJSON('model.json');
}

function setup() {
    createCanvas(600, 600).parent('canvas-container');

    slider = createSlider(1, 50, 1, 1);
    slider.parent('slider');

    load_button = createButton('LOAD PRE-TRAINED MODEL');
    load_button.parent('buttons');
    load_button.mousePressed(function() {
        ne.generations.generations[0].genomes = loaded_model.generations.generations[0].genomes;
        ne.generation_count = loaded_model.generation_count;
        start();
    });

    save_button = createButton('SAVE MODEL');
    save_button.parent('buttons');
    save_button.mousePressed(function() {
        saveJSON(ne, 'model.json', true);
    });

    //bounds of left, right, top and bottom wall
    walls = [
        [width, 0, width, height],
        [width, height, 0, height],
        [0, height, 0, 0],
        [0, 0, width, 0]
    ];

    //create Neuroevolution
    ne = new Neuroevolution({
        population: 20,
        network: [num_sensors, [9], 2],
        randomBehaviour: 0.1,
        mutationRate: 0.5,
        mutationRange: 2,
    });


    start();
}

function draw() {
    var training_speed = slider.value();
    for (var i = 0; i < training_speed; i++) {
        background(0);

        drawShips();
        drawAsteroids();
        score++;
        text("Score: " + score, 20, 20);
        text("Generation: " + ne.generation_count, 20, 40);
        text("Alive: " + getAlives(), 20, 60);
        frame++;
    }
}

function drawShips() {

    for (var i in ships) {
        if (ships[i].alive) {

            //update position of the ship
            ships[i].update();

            //get information for every sensor on the ship
            var inputs = ships[i].detect();
            //query the inputs through the Network and get the results
            var res = gen[i].compute(inputs);

            ships[i].setYoffset(0);
            ships[i].setXoffset(0);

            //move ship acording to the results
            if (res[0] > 0.65) {
                ships[i].setXoffset(0.1);
            }
            if (res[0] < 0.45) {
                ships[i].setXoffset(-0.1);
            }

            if (res[1] > 0.65) {
                ships[i].setYoffset(0.1);
            }
            if (res[1] < 0.45) {
                ships[i].setYoffset(-0.1);
            }

            //show ship
            ships[i].show();

            //check if ship is dead
            if (ships[i].isDead()) {
                ships[i].alive = false;
                ne.networkScore(gen[i], score);
                if (isGameOver()) {
                    start();
                    break;
                }
            }
        }
    }
}

//function for drawing asteroids
function drawAsteroids() {
    for (var i in asteroids) {
        asteroids[i].update();
        asteroids[i].show();

        if (asteroids[i].offscreen()) {
            asteroids.splice(i, 1);
        }
    }

    //create new asteroid every 50 frames
    if (frame % 50 == 0) {
        asteroids.push(new Asteroid({
            x: random(width),
            y: random(0),
            r: 20
        }));
    }
}

//create agents and start the game
function start() {
    //create new empty asteroids array
    asteroids = [];
    //create new empty ships array
    ships = [];
    //restart score to zero
    score = 0;

    //create new generation
    gen = ne.nextGeneration();

    //create new generation of ships
    for (var i = 0; i < gen.length; i++) {
        var s = new Ship({
            x: width / 2,
            y: height / 2,
            r: 10,
            num_sensors: num_sensors
        });
        ships.push(s);
    }
}

//if no ship is alive then game is over
function isGameOver() {
    for (var i in ships) {
        if (ships[i].alive) {
            return false;
        }
    }
    return true;
}

//count how many of alive ships are there
function getAlives() {
    var count = 0;
    for (var i in ships) {
        if (ships[i].alive) {
            count++;
        }
    }
    return count;
}

//calculate if line is inside circle
var inCircle = function(ax, ay, bx, by, cx, cy, r) {
    ax -= cx;
    ay -= cy;
    bx -= cx;
    by -= cy;

    var c = pow(ax, 2) + pow(ay, 2) - pow(r, 2);
    var b = 2 * (ax * (bx - ax) + ay * (by - ay));
    var a = pow((bx - ax), 2) + pow((by - ay), 2);

    var disc = pow(b, 2) - 4 * a * c;

    if (disc <= 0) return 1;

    var sqrtdisc = sqrt(disc);
    var t1 = (-b + sqrtdisc) / (2 * a);
    var t2 = (-b - sqrtdisc) / (2 * a);
    if (0 < t1 && t1 < 1 && 0 < t2 && t2 < 1) return t2;
    return 1;
};

//calculate if line is intersecting other line, in this case its edges of the screen
function isIntersecting(ax, ay, bx, by, wall) {

    var cx = wall[0];
    var cy = wall[1];
    var dx = wall[2];
    var dy = wall[3];

    var denominator = ((bx - ax) * (dy - cy)) - ((by - ay) * (dx - cx));
    var numerator1 = ((ay - cy) * (dx - cx)) - ((ax - cx) * (dy - cy));
    var numerator2 = ((ay - cy) * (bx - ax)) - ((ax - cx) * (by - ay));

    if (denominator == 0) return 1;

    var r = numerator1 / denominator;
    var s = numerator2 / denominator;

    if (r > 1 || r < 0) {
        r = 1;
    }
    return r;
}