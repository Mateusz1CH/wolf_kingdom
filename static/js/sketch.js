let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

let scaleFactor = 0.5; // Scale factor for the wolf size

let engine;
let wolfImages = [];
let wolfs = [];
let wolf;
let ground;
let mConstraint;
let miauSound; // wolf size (half of picture)


function preload() {
    for (let i = 0; i < 17; i++) {
        wolfImages[i] = loadImage(`static/images/wilk${i+1}.png`);
    }
    miauSound = loadSound('static/sounds/wilk.mp3'); // for the sound
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Create an engine
    engine = Engine.create();


    let selectedIndices = [];
    while (selectedIndices.length < 5) {
        let randomIndex = floor(random(wolfImages.length));
        if (!selectedIndices.includes(randomIndex)) {
            selectedIndices.push(randomIndex);
            let wolfBody = Bodies.rectangle(random(width), random(height), wolfImages[randomIndex].width * scaleFactor, wolfImages[randomIndex].height * scaleFactor, {
                restitution: 1.2 // bounciness == coolness
            });
            wolfs.push(wolfBody);
        }
    }

    // Create ground
    ground = Bodies.rectangle(width / 2, height, width, 10, { isStatic: true });
    // Create left and right boundaries
    let wallOptions = { isStatic: true, restitution: 1.2};
    let leftWall = Bodies.rectangle(0, height / 2, 10, height, wallOptions);
    let rightWall = Bodies.rectangle(width, height / 2, 10, height, wallOptions);
    // Create top boundary
    let topWall = Bodies.rectangle(width / 2, 0, width, 10, { isStatic: true });
    // Add bodies to bouncing world
    World.add(engine.world, [...wolfs, ground, leftWall, rightWall, topWall]);

    // Add mouse control
    let canvasMouse = Mouse.create(canvas.elt);
    let options = {
        mouse: canvasMouse
    };
    mConstraint = MouseConstraint.create(engine, options);
    World.add(engine.world, mConstraint);

    // Run the engine
    Engine.run(engine);
}

function draw() {
    background(220);

    // let's add those additional wolfs
    for (let i = 0; i < wolfs.length; i++) {
        let wolf = wolfs[i];
        let wolfImage = wolfImages[i % wolfImages.length];

        push();
        translate(wolf.position.x, wolf.position.y);
        rotate(wolf.angle);
        imageMode(CENTER);
        image(wolfImage, 0, 0, wolfImage.width * scaleFactor, wolfImage.height * scaleFactor);
        pop();
    }

    // Draw ground
    fill(127);
    noStroke();
    rectMode(CENTER);
    rect(ground.position.x, ground.position.y, width, 10);


    // text that adds wolfs
    let textW = textWidth('another wolf pup') + 20;
    let textH = 30;
    if (mouseX > width - textW - 20 && mouseX < width - 20 &&
        mouseY > 15 && mouseY < 15 + textH) {
        fill(0, 200); // Darker background on hover
        cursor(HAND); // Change cursor to hand pointer
    } else {
        fill(0, 100); // Default semi-transparent background
        cursor(ARROW); // Default cursor
    }
    fill(0);
    textSize(20);
    textAlign(RIGHT, TOP);
    text('another wolf pup', width - 20, 20); // Display text at top-right corner


    // "Wolf Empire" title
    textSize(36); // Large text size for title
    textStyle(BOLD);
    textAlign(LEFT, TOP);

    // Main text color (dark)
    fill(25, 25, 112); // Midnight blue color
    text('Wolf Empire', 20, 20);

    fill(255); // White color effect
    stroke(255); // White stroke
    strokeWeight(1); // Thin stroke
    text('Wolf Empire', 22, 22); // Slightly offset

    // Reset stroke settings for other drawings
    noStroke();

}

function mouseClicked() {
    let textW = textWidth('another wolf pup');
    let textHeight = 20;

    if (mouseX > width - textW - 20 && mouseX < width - 20 &&
        mouseY > 20 && mouseY < 20 + textHeight) {
        miauSound.play();
        addNewWolf();
    }
}

function addNewWolf() {
    let randomIndex = floor(random(wolfImages.length));
    let newWolfImage = wolfImages[randomIndex];
    let newWolfBody = Bodies.rectangle(random(width), 50, newWolfImage.width * scaleFactor, newWolfImage.height * scaleFactor, {
        restitution: 1.2
    });
    wolfs.push(newWolfBody);
    World.add(engine.world, newWolfBody);
}


