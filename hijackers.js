
'use strict';
(function() {
  let player, enemy, world;
  let score = 0;
  let music = true;
  let size = [300, 600];

  limage explosionImage, airplaneImage, enemyImage, towerImage, backgroundImage;
  let backgroundClip, explosionClip;
  let audioStarted = false; // Tracks if audio has started

  let jumping = false;
  function preload() {
    // airplaneImage = loadImage("assets/airplane.png")
    // enemyImage = loadImage("assets/enemy.png")image explosionImage = loadImage("assets/explosion.png");
    // console.limage(explosionImage)
    // towerImage = loadImage("assets/tower.png")
    // backgroundImage = loadImage("assets/ny.jpg")
    // // backgroundClip = loadSound("assets/background.mp3");
    // explosionClip = loadSound("assets/explosion.wav");

  }

  function setup() {
    createCanvas(size[0], size[1]);
    player = new Player(size);
    enemy = new Enemy(size);
    world = new World(size);
    console.log("hi console")
    println("hi console")
    // backgroundClip.loop();
  }

  function draw() {
    // background(220);

    // let jumping = false;
    if (keyIsPressed && key === ' ') {
      jumping = true;
      score++;
    }

    world.update();
    player.update(jumping);
    enemy.update(player);

    let checkEnemy = enemy.checkCollision(player);
    let checkWorld = world.checkCollision(player);
    let checkAltitude = player.y > size[1];
    console.log(checkEnemy, worldImage, checkAltitude)
    if (checkEnemy || checkWorld || checkAltitude) {
      // backgroundClip.stop();
      explosionClip.play();
      const img = explosionImage
      console.log(img)
      console.log("hsoudl be printede")
      image(img, player.getRect().x, player.getRect().y - 32, 64, 64);
      let restart = restartDialog();
      if (!restart) {
        noLoop();
      } else {
        setup();
      }
    }

    world.draw();
    player.draw();
    enemy.draw();
    updateScore();

    jumping = false;
  }

  function mousePressed() {
    jumping = true;``
    score++;
  }

  // Detect touch on mobile devices
  function touchStarted() {
    jumping = true;
    score++;
    return false; // Prevent default behavior on touch devices
  }


  function updateScore() {
    textSize(32);``````
    fill(0);
    text(`Score: ${score}`, 10, 30);
  }

  function restartDialog() {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text("Game Over! Press R to Restart or Q to Quit.", width / 2, height / 2 - 60);
    return keyIsPressed && (key === 'r' || key === 'q');
  }

  function rectsCollide(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  class Player {
    constructor(size) {
      this.x = size[0] / 4;
      this.y = size[1] / 2;
      this.dy = 0;
      this.gravity = 0.5;
      this.jumpStrength = -8;
      this.image = airplaneImage;
      this.image.resize(40, 40);
      this.width = this.image.width;
      this.height = this.image.height;
    }

    update(jumping) {
      this.dy += this.gravity;
      if (jumping) {
        this.dy = this.jumpStrength;
      }
      this.y += this.dy;
      if (this.y < 32) {
        this.y = 32;
      }
    }

    draw() {
      image(this.image, this.x - this.width / 2, this.y - this.height / 2);
    }

    getRect() {
      return {
        x: this.x - this.width / 2,
        y: this.y - this.height / 2,
        width: this.width,
        height: this.height
      };
    }
  }

  class Projectile {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 5;
      this.height = 3;
      this.speed = 6;
      this.color = color(255, 0, 0);
    }

    update() {
      this.x -= this.speed;
    }

    draw() {
      fill(this.color);
      noStroke();
      rect(this.x, this.y, this.width, this.height);
    }

    getRect() {
      return {
        x: this.x - this.width / 2,
        y: this.y - this.height / 2,
        width: this.width,
        height: this.height
      };
    }
  }

  class Enemy {
    constructor(size) {
      this.width = 64;
      this.height = 32;
      this.x = size[0] - this.width;
      this.y = 24;
      this.image = enemyImage;
      this.image.resize(this.width, this.height);
      this.projectiles = [];
      this.lastShotTime = 0;
      this.fireRate = 1000;
    }

    update(player) {
      let currentTime = millis();
      if (player.y < 40) {
        if (currentTime - this.lastShotTime >= this.fireRate) {
          this.shoot(player);
          this.lastShotTime = currentTime;
        }
      }

      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        this.projectiles[i].update();
        if (this.projectiles[i].x < 50) {
          this.projectiles.splice(i, this.projectiles.length);
        }
      }
    }

    shoot(player) {
      let projectile = new Projectile(this.x, this.y + this.height / 2);
      this.projectiles.push(projectile);
    }

    draw() {
      image(this.image, this.x, this.y);
      for (let projectile of this.projectiles) {
        projectile.draw();
      }
    }

    checkCollision(player) {
      let playerRect = player.getRect();
      for (let projectile of this.projectiles) {
        if (rectsCollide(playerRect, projectile.getRect())) {
          return true;
        }
      }
      return false;
    }
  }

  class Obstacle {
    constructor(x, y, width = 64, height = 480, speed = 3) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.image = towerImage;  // Load the tower image
      this.image.resize(this.width, this.height);  // Resize the image to fit
    }

    update() {
      this.x -= this.speed;
    }

    draw() {
      // Draw the tower image (this will draw the image at the top part of the obstacle)
      image(this.image, this.x, this.y);

      // // Optionally, draw the gap as rectangles
      // fill(0, 255, 0);
      noStroke();
      // rect(this.x, 0, this.width, this.gapY);
      // rect(this.x, this.gapY + this.gapHeight, this.width, height - (this.gapY + this.gapHeight));
    }

    getRect() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    }
  }

  class World {
    constructor(size) {
      this.size = size;
      this.obstacles = [];
      this.spawnRate = 100;
      this.frameCount = 0;
      this.worldImage = backgroundImage;
      this.worldImage.resize(size[0], size[1]); 
    }

    update() {
      this.frameCount++;
      if (this.frameCount >= this.spawnRate) {
        this.spawnObstacle();
        this.frameCount = 0;
      }

      // Update each obstacle
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        this.obstacles[i].update();
        if (this.obstacles[i].x < -64) { // Remove obstacles that are off the screen
          this.obstacles.splice(i, 1);
        }
      }
    }

    spawnObstacle() {
      let y = random(150, 450);
      this.obstacles.push(new Obstacle(this.size[0], y));
      this.spawnRate = max(30, this.spawnRate - 5); // Decrease spawn rate to increase difficulty
    }

    draw() {
      image(this.worldImage, 0, 0); // Draw the background image

      // Draw all obstacles
      for (let obstacle of this.obstacles) {
        obstacle.draw();
      }
    }

    checkCollision(player) {
      let playerRect = player.getRect();
      for (let obstacle of this.obstacles) {
        if (rectsCollide(playerRect, obstacle.getRect())) {
          return true;
        }
      }
      return false;
    }
  }
}());
