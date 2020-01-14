window.onload = function () {

  let canvasWidth = 900;
  let canvasHeight = 600;
  const blockSize = 30;
  let ctx;
  let delay = 100;
  let sneeky;
  let applee;
  const widthInBlocks = canvasWidth / blockSize;
  const heightInBlocks = canvasHeight / blockSize;

  init();

  function init() {
    canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "1px solid";
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    sneeky = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    applee = new Apple([10,10]);
    refreshCanvas();
  }

  function refreshCanvas() {
    
    sneeky.advance();
    if (sneeky.checkCollision()) {

    } else {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    sneeky.draw();
    applee.draw();
    setTimeout(refreshCanvas, delay);
    }
  }

  function drawBlock(ctx, position) {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.draw = function () {
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for (let i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]);
      };
      ctx.restore();
    };

    this.advance = function () {
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
      this.body.pop();
    };

    this.setDirection = function (newDirection) {
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

    this.checkCollision = function() {
      let wallCollision = false;
      let snakeCollision = false;
      let head = this.body[0];
      let rest = this.body.slice(1);
      let snakeX = head[0];
      let snakeY = head[1];
      const minX = 0;
      const minY = 0;
      const maxX = widthInBlocks - 1;
      const maxY = widthInBlocks - 1;
      let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

      if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
        wallCollision = true;
      };

      for (let i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
          snakeCollision = true;
        }
      }
      return wallCollision || snakeCollision;
    }
  }

  function Apple(position) {
    this.position = position;
    this.draw = function() {
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      const radius = blockSize / 2;
      let x = position[0] * blockSize + radius;
      let y = position[1] * blockSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
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
      default:
        return;
    }
    sneeky.setDirection(newDirection);
  }
}

