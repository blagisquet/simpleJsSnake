window.onload = () => {

  let canvasWidth = 900;
  let canvasHeight = 600;
  const blockSize = 30;
  let ctx;
  let delay = 100;
  let sneeky;
  let applee;
  const widthInBlocks = canvasWidth / blockSize;
  const heightInBlocks = canvasHeight / blockSize;
  let score;
  let timeout;

  const init = () => {
    canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "10px solid";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    sneeky = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    applee = new Apple([10, 10]);
    score = 0;
    refreshCanvas();
  }

  init();

  function refreshCanvas() {
    sneeky.advance();
    if (sneeky.checkCollision()) {
      gameOver();
    } else {
      if (sneeky.isEatingApple(applee)) {
        sneeky.ateApple = true;
        score++;
        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(sneeky))
      }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawScore();
      sneeky.draw();
      applee.draw();
      timeout = setTimeout(refreshCanvas, delay);
    }
  }

  let gameOver = () => {
    ctx.save();
    ctx.font = "bold 25px sans-serif";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    const centreX = canvasWidth / 2;
    const centreY = canvasHeight / 2;
    ctx.fillText("Game Over", centreX, centreY + 55);
    ctx.fillText("Appuyer sur la touche espace pour rejouer", centreX, centreY + 80);
    ctx.restore();
  }

  let restart = () => {
    sneeky = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    applee = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
  }

  function drawScore() {
    ctx.save();
    ctx.font = "bold 100px sans-serif";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centreX = canvasWidth / 2;
    const centreY = canvasHeight / 2;
    ctx.fillText(score.toString(), centreX, centreY);
    ctx.restore();
  }

  function drawBlock(ctx, position) {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.draw = function () {
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for (let i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]);
      };
      ctx.restore();
    };

    this.advance = () => {
      let nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          throw ("Invalid direction");
      }
      this.body.unshift(nextPosition);
      if (!this.ateApple) {
        this.body.pop();
      } else {
        this.ateApple = false;
      }
    };

    this.setDirection = (newDirection) => {
      let allowedDirections;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;
        case "down":
        case "up":
          allowedDirections = ["left", "right"];
          break;
        default:
          throw ("Invalid direction");
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        this.direction = newDirection;
      }
    };

    this.checkCollision = () => {
      let wallCollision = false;
      let snakeCollision = false;
      let head = this.body[0];
      let rest = this.body.slice(1);
      let snakeX = head[0];
      let snakeY = head[1];
      const minX = 0;
      const minY = 0;
      const maxX = widthInBlocks - 1;
      const maxY = widthInBlocks - 11;
      let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
        wallCollision = true;
      };

      for (let i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
          snakeCollision = true;
        }
      }
      return wallCollision || snakeCollision;
    };
    this.isEatingApple = (appleToEat) => {
      let head = this.body[0];
      if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
        return true;
      } else {
        return false;
      }
    };
  }

  function Apple(position) {
    this.position = position;
    this.draw = () => {
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      const radius = blockSize / 2;
      let x = this.position[0] * blockSize + radius;
      let y = this.position[1] * blockSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    };

    this.setNewPosition = () => {
      let newX = Math.round(Math.random() * (widthInBlocks - 1));
      let newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };

    this.isOnSnake = (snakeToCheck) => {
      let isOnSnake = false;

      for (let i = 0; i < snakeToCheck.body.length; i++) {
        if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    }
  }

  document.onkeydown = function handleKeyDown(e) {
    let key = e.keyCode;
    let newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        restart();
        return;
      default:
        return;
    }
    sneeky.setDirection(newDirection);
  }
}

