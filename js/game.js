// Choose random element from array:
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}

// Create an instance of the engine.
// If no dimensions are specified the game will be fullscreen.
var game = new ex.Engine({
    width: 800,
    height: 600
});

const blockSpawns = {
    'N': {
        x: [100,300,500],
        y: 0
    },
    'S': {
        x: [100,300,500],
        y: 600
    },
    'E': {
        x: 600,
        y: [100,300,500]
    },
    'W': {
        x: 0,
        y: [100,300,500]
    }
};

var blockId = 1;

class Player extends ex.Actor {
    constructor() {
        super({
            x: game.drawWidth / 2,
            y: game.drawHeight / 2,
            width: 20, 
            height: 20,
            color: ex.Color.Chartreuse
        });
        // Make sure the player can partipate in collisions, by default excalibur actors do not collide
        this.collisionType = ex.CollisionType.Passive;
        return this;
    }

    // Wire keyboard arrows to player movement:
    update(engine, delta) {
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
            player.x -= 5;
        }
        else if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
            player.x += 5;
        }
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Up)) {
            player.y -= 5;
        }
        else if (engine.input.keyboard.isHeld(ex.Input.Keys.Down)) {
            player.y += 5;
        }
    }
}

var player = new Player();

// `game.add` is the same as calling `game.currentScene.add`
game.add(player);

const sides = {
    'N': {x: [350,400,450], y: [20]},
    'S': {x: [350,400,450], y: [580]},
    'E': {x: [780], y: [250,300,350]},
    'W': {x: [20],  y: [250,300,350]}
};

const vectors = {
    'N': {x:0, y:10},
    'S': {x:0, y:-10},
    'E': {x:-13, y:0},
    'W': {x:13, y:0}
};

const patterns = ['Rose', 'Violet', 'Black', 'Orange'];

class Block extends ex.Actor {
    constructor(side, colour) {
        // Initialize an actor of the standard size:
        super(0,0,20,20);
        // Extension props:
        this.id = blockId++;
        this.side = side;
        // Place actor at chosen spawn point:
        this.spawn = {
            x: sides[this.side].x.random(),
            y: sides[this.side].y.random()
        };
        this.x = this.spawn.x;
        this.y = this.spawn.y;
        console.log(this.id, this.side, this.spawn);
        // Actor props:
        this.color = ex.Color[colour];
        this.collisionType = ex.CollisionType.Active;
        this.vel.setTo(...Object.values(vectors[this.side]));
        
        game.add(this);
        return this;
    }

    report() {
        console.log('Moving block', this.id);
    }
}

// Keep spawning blocks:
var blockSpawnLoop = setInterval(function() {
    new Block(Object.keys(sides).random(), patterns.random());
}, 1000);

// spawn blocks randomly
function spawnRandomBlock(side, amount = 1) {
    var spawn = sides[side].random();
    while (amount < 0) {
        new Block(side);
        amount--;
    }
}

// Start the engine to begin the game.
game.start();
