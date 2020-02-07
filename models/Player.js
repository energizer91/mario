class Player extends SceneObject {
  constructor(pos) {
    super('Player', pos);
    this.width = 20;
    this.height = 60;
    this.color = '#ff0000';
    this.speed = new Point(0, 0);
    this.vector = new Point(0, 0);
    this.maxSpeed = new Point(3, 3);
    this.jumping = false;
  }

  addSpeed(x = 0, y = 0) {
    this.speed.x = x;
    this.speed.y = y;
  }

  setVector(x = 0, y = 0) {
    this.vector.x = x;
    this.vector.y = y;
  }

  move(direction) {
    if (direction === 'right') {
      this.setVector(1, 0);
    } else if (direction === 'left') {
      this.setVector(-1, 0);
    }
  }

  stop() {
    this.setVector(0, 0);
  }

  jump() {
    if (this.jumping) {
      return;
    }

    this.jumping = true;
    this.addSpeed(this.speed.x, 10);
  }

  walk() {
    this.maxSpeed.x = Math.max(this.maxSpeed.x - this.delta, 3);
  }

  sprint() {
    this.maxSpeed.x = Math.min(this.maxSpeed.x + this.delta, 6);
  }

  onGround() {
    return this.position.y <= 0;
  }

  render(ctx, viewport) {
    super.render(ctx, viewport);

    if (!this.jumping) {
      if (this.vector.x > 0) {
        this.speed.x = Math.min(this.speed.x + this.delta, this.maxSpeed.x);
      } else if (this.vector.x < 0) {
        this.speed.x = Math.max(this.speed.x - this.delta, -this.maxSpeed.x);
      } else {
        if (this.speed.x < 0) {
          this.speed.x = Math.min(this.speed.x + this.delta, 0);
        } else if (this.speed.x > 0) {
          this.speed.x = Math.max(this.speed.x - this.delta, 0);
        }
      }
    }

    if (this.speed.y !== 0) {
      this.speed.y += GRAVITY;
    }

    if (this.position.y < 0) {
      this.position.y = 0;
      this.speed.y = 0;
      this.jumping = false;
    }

    if (this.position.y > viewport.height) {
      this.speed.y = 0;
      this.position.y = viewport.height;
    }

    if (this.position.x < 0) {
      this.speed.x = 0;
      this.position.x = 0;
    }

    if (this.position.x > viewport.width) {
      this.speed.x = 0;
      this.position.x = viewport.width;
    }

    if (this.speed.x !== 0) {
      this.position.x += this.speed.x;
    }

    if (this.speed.y !== 0) {
      this.position.y += this.speed.y;
    }

    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, viewport.height - this.position.y - this.height, this.width, this.height);
  }
}
