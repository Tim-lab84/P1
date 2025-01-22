import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./UI.js"; //how do we update architecture when changing file names? it doesnt recognize

/* Wrapper to make sure stylesheet and images are loaded
before running the script */
window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      //margin for player character
      this.groundMargin = 80;
      //game speed for layers
      this.speed = 0;
      //global speed setting
      this.maxSpeed = 4;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      //helpers for enemy spawn
      this.enemies = []; //holds all active enemies in an array
      this.enemyTimer = 0; //increases by deltaTime everytime it
      // reaches a value in enemyinterval we create a new enemy and reset to 0
      this.enemyInterval = 1000;
      this.debug = true;
      this.score = 0;
      this.fontColor = "black";
      this.player.currentState = this.player.states[0];
      //when player object is created activate its initial default state
      this.player.currentState.enter();
    }
    //run for every animation frame
    update(deltaTime) {
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
      //handle enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markedForDeletion)
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
      });
    }
    //draw our images/score etc
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.UI.draw(context);
    }
    //add enemies at intervals
    addEnemy() {
      //only spawn enemies when we are moving and not every 1000ms (50%)
      if (this.speed > 0 && Math.random() < 0.5)
        this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
      console.log(this.enemies);
    }
  }
  const game = new Game(canvas.width, canvas.height);
  console.log(game);

  //helper variable DeltaTime to calculate Frames of Spritesheet
  let lastTime = 0;

  //animation loop for 60 fps
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    //console.log(deltaTime);
    lastTime = timeStamp;
    //clear old paint => only see current animation (whole canvas from to)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    //this thing gives back timestamps aswell to calculate deltaTime
    requestAnimationFrame(animate);
  }
  animate(0); //0 is so important because first value of deltaTime is a NaN so we have to serve a first value (0)
});
