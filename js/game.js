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

// todo build awesome game here
var player = new ex.Actor(game.drawWidth / 2, game.drawHeight / 2, 20, 20);
player.color = ex.Color.Chartreuse;
// Make sure the paddle can partipate in collisions, by default excalibur actors do not collide
player.collisionType = ex.CollisionType.Fixed;

// `game.add` is the same as calling `game.currentScene.add`
game.add(player);

const sides = {
    'N': {x:400, y: 20},
    'S': {x:400, y: 580},
    'E': {x:20, y: 300},
    'W': {x:780, y: 300}
};

class Block extends ex.Actor {
    constructor(side, colour) {
        super(0,0,20,20);
        this.id = blockId++;
        this.side = side;
        this.spawn = sides[this.side];
        console.log(this.id, this.side, this.spawn);
        this.x = this.spawn.x;
        this.y = this.spawn.y;
        this.color = ex.Color[colour];
        this.collisionType = ex.CollisionType.Active;
        game.add(this);
        return this;
    }

    move() {
        console.log('Moving block', this.id);
    }
}

new Block('E', 'Rose').move();
new Block('W', 'Gray').move();
new Block('N', 'Black').move();
new Block('S', 'Orange').move();

// Start the engine to begin the game.
game.start();
