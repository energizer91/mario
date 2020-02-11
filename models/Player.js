const MAX_WALKING_SPEED = 150; // pixels per second
const MAX_RUNNING_SPEED = 200;
const MAX_JUMPING_SPEED = 300; // jumping force
const MAX_JUMP_COUNTER = 0.25; // how many milliseconds you can hold jump button

class Player extends SceneObject {
  constructor(pos, params) {
    super('Player', pos);
    this.color = '#ff0000';
    this.speed = new Point(0, 0);
    this.vector = new Point(0, 0);
    this.maxSpeed = new Point(MAX_WALKING_SPEED, MAX_JUMPING_SPEED);
    this.delta = 3; // speed changing delta
    this.mirror = false;
    this.collisions = [0, 0, 0, 0];
    this.colliding = false;
    this.stayingSprite = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      x: 275,
      y: 44,
      frames: [0]
    });
    this.stayingMirrorSprite = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      x: 14,
      y: 44,
      frames: [13]
    });
    this.stoppingSprite = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      x: 275,
      y: 44,
      frames: [4]
    });
    this.stoppingMirrorSprite = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      x: 16,
      y: 44,
      frames: [9]
    });
    this.jumpingSprite = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      x: 274,
      y: 44,
      frames: [5]
    });
    this.jumpingMirrorSprite = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      x: 13,
      y: 44,
      frames: [8]
    });
    this.walkingAnimation = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      x: 273,
      y: 44,
      frames: [1, 2, 3, 2]
    });
    this.walkingMirrorAnimation = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      x: 16,
      y: 44,
      frames: [12, 11, 10, 11]
    });
    this.jumping = false;
    this.jumpCounter = 0;
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
      this.setVector(1, this.vector.y);
    } else if (direction === 'left') {
      this.setVector(-1, this.vector.y);
    }
  }

  stop() {
    this.setVector(0, this.vector.y);
  }

  jump() {
    if (this.jumping) {
      return;
    }

    if (this.jumpCounter >= MAX_JUMP_COUNTER) {
      return;
    }

    this.jumping = true;
    // this.setVector(this.vector.x, 1);
    this.addSpeed(this.speed.x, this.maxSpeed.y);
  }

  walk() {
    this.maxSpeed.x = Math.max(this.maxSpeed.x - this.delta, MAX_WALKING_SPEED);
  }

  sprint() {
    this.maxSpeed.x = Math.min(this.maxSpeed.x + this.delta, MAX_RUNNING_SPEED);
  }

  setCollisions(top = 0, right = 0, bottom = 0, left = 0) {
    this.colliding = Boolean(top || right || bottom || left);
    this.collisions = [top, right, bottom, left];
  }

  render(ctx, viewport) {
    // calculate collisions
    if (this.colliding) {
      // y axis collisions
      if (this.collisions[0] && !this.jumping) {
        this.speed.y = 0;
        this.position.y = this.collisions[0];
      } else if (this.collisions[2]) {
        this.jumpCounter = MAX_JUMP_COUNTER;
        this.speed.y = 0;
        this.position.y = this.collisions[2] - this.height;
      }

      // x axis collisions
      if (this.collisions[1]) {
        this.speed.x = 0;
        this.position.x = this.collisions[1];
      } else if (this.collisions[3]) {
        this.speed.x = 0;
        this.position.x = this.collisions[3] - this.width;
      }
    }

    // add speed by vector x
    if (this.vector.x > 0) {
      this.speed.x = Math.min(this.speed.x + this.delta, this.maxSpeed.x);
    } else if (this.vector.x < 0) {
      this.speed.x = Math.max(this.speed.x - this.delta, -this.maxSpeed.x);
    } else if (!this.jumping) {
      // add stopping speed
      if (this.speed.x < 0) {
        this.speed.x = Math.min(this.speed.x + this.delta, 0);
      } else if (this.speed.x > 0) {
        this.speed.x = Math.max(this.speed.x - this.delta, 0);
      }
    }

    // add speed by vector y
    if (this.vector.y > 0) {
      this.speed.y = Math.min(this.speed.y + this.delta, this.maxSpeed.y);
    } else if (this.vector.y < 0) {
      this.speed.y = Math.max(this.speed.y - this.delta, -this.maxSpeed.y);
    }

    // counting how long i can jump
    if (this.colliding && this.collisions[0]) {
      this.jumpCounter = 0;
    } else {
      this.jumpCounter += viewport.dt;
      this.speed.y += GRAVITY * 100;
    }

    if (this.jumping) {
      this.jumping = false;
    }

    // set boundaries
    // if (this.position.x + this.width > viewport.width) {
    //   this.speed.x = 0;
    //   this.position.x = viewport.width - this.width;
    // }

    if (this.position.y > viewport.height) {
      this.speed.y = 0;
      this.position.y = viewport.height;
    }

    if (this.position.x < viewport.offset) {
      this.speed.x = 0;
      this.position.x = viewport.offset;
    }

    // setting acceleration
    if (this.speed.x !== 0) {
      this.position.x += this.speed.x * viewport.dt;
    }

    if (this.speed.y !== 0) {
      this.position.y += this.speed.y * viewport.dt;
    }

    // updating physics model position for calculation collisions
    this.physics.updatePosition(this.position.x, this.position.y);

    // rendering sprites
    this.renderSprites(ctx, viewport);
  }

  renderSprites(ctx, viewport) {
    const x = this.position.x  - viewport.offset;
    const y = viewport.height - this.position.y - this.height;

    // mirroring sprites if goes backwards
    if (this.speed.x > 0) {
      this.mirror = false;
    } else if (this.speed.x < 0) {
      this.mirror = true;
    }

    if (this.jumpCounter > 0) {
      this.renderJumping(ctx, x, y, viewport.dt);
    } else if (this.speed.x === 0) {
      this.renderStaying(ctx, x, y, viewport.dt);
    } else {
      this.renderWalking(ctx, x, y, this.speed.x * viewport.dt / 10, viewport.dt);
    }
  }

  renderWalking(ctx, x, y, speed = 0, dt) {
    if (this.mirror) {
      if (this.speed.x < 0 && this.vector.x > 0) {
        this.stoppingMirrorSprite.render(ctx, x, y, dt);
      } else {
        this.walkingMirrorAnimation.animate(speed);
        this.walkingMirrorAnimation.render(ctx, x, y, dt);
      }
    } else {
      if (this.speed.x > 0 && this.vector.x < 0) {
        this.stoppingSprite.render(ctx, x, y, dt);
      } else {
        this.walkingAnimation.animate(speed);
        this.walkingAnimation.render(ctx, x, y, dt);
      }
    }
  }

  renderStaying(ctx, x, y, dt) {
    if (this.mirror) {
      this.stayingMirrorSprite.render(ctx, x, y, dt);
      this.walkingMirrorAnimation.setIndex(0);
    } else {
      this.stayingSprite.render(ctx, x, y, dt);
      this.walkingAnimation.setIndex(0);
    }
  }

  renderJumping(ctx, x, y, dt) {
    if (this.mirror) {
      this.jumpingMirrorSprite.render(ctx, x, y, dt);
      this.walkingMirrorAnimation.setIndex(0);
    } else {
      this.jumpingSprite.render(ctx, x, y, dt);
      this.walkingAnimation.setIndex(0);
    }
  }
}
