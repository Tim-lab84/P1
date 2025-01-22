//Handles UI (Score)

export class UI {
  constructor(game) {
    //game object stores current score
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Helvetica";
  }
  draw(context) {
    //draw all ui elements and game statuses
    context.font = this.fontSize + "px" + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;

    //score
    context.fillText("Score: " + this.game.score, 20, 50);
  }
}
