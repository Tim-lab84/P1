class Particles {
  constructor(game) {
    this.game = game;
    this.markedForDeletion = false;
  }
  update() {
    //horizontal particle decline
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    //for every frame decrease size of particle by 5%
    this.size *= 0.95;
    //when size is < 0.5 px delete the particle
    if (this.size < 0.5) this.markedForDeletion = true;
  }
}
export class Dust extends Particles {
  constructor(game, x, y) {
    //reference to the game and x,y because particles depend on players position
    super(game);
    this.size = Math.random() * 10 + 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = "black";
  }
  draw(context) {
    //8:46:44
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}
export class Splash extends Particles {}
export class Fire extends Particles {}
