// Create an instance of the engine.
// If no dimensions are specified the game will be fullscreen.
var game = new ex.Engine({
    width: 800,
    height: 600
});

// todo build awesome game here
var player = new ex.Actor(game.drawWidth / 2, game.drawHeight / 2, 20, 20);
paddle.color = ex.Color.Chartreuse;
// Make sure the paddle can partipate in collisions, by default excalibur actors do not collide
paddle.collisionType = ex.CollisionType.Fixed;

// `game.add` is the same as calling `game.currentScene.add`
game.add(paddle);

// Start the engine to begin the game.
game.start();