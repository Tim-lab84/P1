import { Sitting, Running, Jumping, Falling } from "./playerStates.js";
//update and draw our character
export class Player {
  //takes the whole game as an argument
  //to get access to the canvas
  //not creating a copy , just pointing to the game
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    //vertical velocity
    this.vy = 0;
    //weight to simulate gravity (jumping curve)
    this.weight = 1;

    //end vertical
    this.image = document.getElementById("player");
    //you can also just do
    //this.image = player; (every id gets stored as a variable to access it directly)
    //cycle through sprite sheet
    this.frameX = 0;
    this.frameY = 0;
    //hold the values for the number of animations in the spritesheet
    this.maxFrame;
    //adjust sprite animation speed (basically how long sprite stays on screen)
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    //cycle between 0 and frameinterval and increase it by deltatime , every time its> frameinterval
    //it triggers the next frame
    this.frameTimer = 0;

    //
    this.speed = 0;
    this.maxSpeed = 10;
    //helpers to handle state patterns 7:36:55
    this.states = [
      new Sitting(this),
      new Running(this),
      new Jumping(this),
      new Falling(this),
    ];
    this.currentState = this.states[0];
    //when player object is created activate its initial default state
    this.currentState.enter();
  }
  update(input, deltaTime) {
    this.currentState.handleInput(input);
    //horizontal movement
    this.x += this.speed;
    if (input.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    //if array is empty stop  movespeed
    else this.speed = 0;
    //boundaries
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    //vertical movement
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    //sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) {
        this.frameX++; // Move to the next animation frame
      } else {
        this.frameX = 0; // Reset to the first frame
      }
    } else {
      this.frameTimer += deltaTime; // Increment frame timer
    }
  }

  draw(context) {
    //takes 9 arguments , image , 4x source , 4x destination
    context.drawImage(
      this.image,
      //cycle through spritesheet
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  //utility method onground to check if player is onground or in the air , return true if player is on ground

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  //method to allow us to switch between states

  setState(state, speed) {
    //we are setting the speed here , we could also do it in player directly
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
}
