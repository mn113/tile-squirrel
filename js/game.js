// Choose random element from array:
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}

// Create an instance of the engine.
// If no dimensions are specified the game will be fullscreen.
var game = new ex.Engine({
    width: 600,
    height: 600
});

var map = new Extensions.Tiled.TiledResource("tiled/test3.json");

// Create a loader and reference the map
var loader = new ex.Loader([map]);

// Temporary fixed block:
var q = new ex.Actor({
    x: game.drawWidth / 2,
    y: game.drawHeight / 2,
    width: 30, 
    height: 30,
    color: ex.Color.Green,
    collisionType: ex.CollisionType.Fixed
});
game.add(q);

class Player extends ex.Actor {
    constructor() {
        super({
            x: game.drawWidth / 2,
            y: game.drawHeight / 2,
            width: 20, 
            height: 20,
            color: ex.Color.Chartreuse,
            collisionType: ex.CollisionType.Active
        });

        return this;
    }

    onInitialize(engine) {
        // Apply image to player:
        this.texture = new ex.Texture('img/pinky.png');
        loader.addResource(this.texture);
        this.addDrawing(this.texture);

        this.on('precollision', function(ev) {
            console.info('player', ev.other.id, ev.intersection);
        });
    }

    // Draw is passed a rendering context and a delta in milliseconds since the last frame
    draw(ctx, delta) {
        //super.draw(ctx, delta); // perform base drawing logic

        // Custom draw code
        ctx.fillStyle = this.color.toString();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    // Wire keyboard arrows to player movement:
    update(engine, delta) {
        super.update(engine, delta); // call base update logic

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

        // P for pause/unpause:
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Space)) {
            if (game.isPaused) game.start();
            else game.stop();
        }
    }
}

const sides = {
    'N': {x: [350,400,450], y: [20]},
    'S': {x: [350,400,450], y: [580]},
    'E': {x: [780], y: [250,300,350]},
    'W': {x: [20],  y: [250,300,350]}
};

const vectors = {
    'N': {x:0, y:12},
    'S': {x:0, y:-12},
    'E': {x:-16, y:0},
    'W': {x:16, y:0}
};

const patterns = ['Rose', 'Violet', 'Black', 'Orange'];

var blockId = 1;

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
        this.collisionType = ex.CollisionType.Passive;

        game.add(this);
        return this;
    }

    onInitialize(engine) {
        this.vel.setTo(...Object.values(vectors[this.side]));

        this.on('preCollision', function(ev) { // FIXME:
            if (ev.other === player) {
                console.log(this.id, ev.other, ev.intersection);
                // Only affect blocks perpendicular to their movement:
                if (this.side == 'N' || this.side == 'S') {
                    if (this.vel.x * ev.intersection.x < 0) this.vel.x = 0;    // stop it dead
                    else this.vel.x = ev.intersection.x * 5;    // set constant speed
                }
                else {
                    if (this.vel.y * ev.intersection.y < 0) this.vel.y = 0;    // stop it dead
                    else this.vel.y = ev.intersection.y * 5;    // set constant speed
                }
            }
            else {
                //console.log(this.id, ev.other.id);
            }
        });
    }
}

var player = new Player();
game.add(player);

// Keep spawning blocks:
// var blockSpawnLoop = setInterval(function() {
//     if (game.scenes.root.actors.length < 25) {
//         new Block(Object.keys(sides).random(), patterns.random());
//     }
// }, 1000);

// Start the engine to begin the game.
game.start(loader).then(function() {
    console.log("Game loaded");
   
    // Process the data in the map as you like
    map.data.tilesets.forEach(function(ts) {
        console.log(ts.image, ts.imageTexture.isLoaded());  //:FIXME:
    });
    // get an Excalibur `TileMap` instance
    var tm = map.getTileMap();
    // draw the tile map
    game.add(tm);
});
