const MAX_WALKING_SPEED = 150;
const MAX_RUNNING_SPEED = 200;
const MAX_JUMPING_SPEED = 500;
const GROUND_LEVEL = 16;

class Player extends SceneObject {
  constructor(pos, params) {
    super('Player', pos);
    this.color = '#ff0000';
    this.speed = new Point(0, 0);
    this.vector = new Point(0, 0);
    this.maxSpeed = new Point(MAX_WALKING_SPEED, MAX_JUMPING_SPEED);
    this.delta = 7;
    this.mirror = false;
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
      padding: 0,
      zoom: 1,
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
      padding: 0,
      zoom: 1,
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
    this.addSpeed(this.speed.x, this.maxSpeed.y);
  }

  walk() {
    this.maxSpeed.x = Math.max(this.maxSpeed.x - this.delta, MAX_WALKING_SPEED);
  }

  sprint() {
    this.maxSpeed.x = Math.min(this.maxSpeed.x + this.delta, MAX_RUNNING_SPEED);
  }

  onGround() {
    return this.position.y < GROUND_LEVEL;
  }

  render(ctx, viewport) {
    // gravity
    if (this.speed.y !== 0) {
      this.speed.y += GRAVITY * 100;
    }

    // add speed by vector x
    if (this.vector.x > 0) {
      this.speed.x = Math.min(this.speed.x + this.delta, this.maxSpeed.x);
    } else if (this.vector.x < 0) {
      this.speed.x = Math.max(this.speed.x - this.delta, -this.maxSpeed.x);
    } else if (!this.jumping) {
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

    if (this.onGround()) {
      this.position.y = GROUND_LEVEL;
      this.speed.y = 0;
      this.jumping = false;
    }

    // set boundaries
    if (this.position.x + this.width > viewport.width) {
      this.speed.x = 0;
      this.position.x = viewport.width - this.width;
    }

    if (this.position.y > viewport.height) {
      this.speed.y = 0;
      this.position.y = viewport.height;
    }

    if (this.position.x < 0) {
      this.speed.x = 0;
      this.position.x = 0;
    }

    // setting acceleration
    if (this.speed.x !== 0) {
      this.position.x += this.speed.x * viewport.dt;
    }

    if (this.speed.y !== 0) {
      this.position.y += this.speed.y * viewport.dt;
    }

    // mirroring sprites if goes backwards
    if (this.speed.x > 0) {
      this.mirror = false;
    } else if (this.speed.x < 0) {
      this.mirror = true;
    }

    // rendering sprites
    this.renderSprites(ctx, viewport);
  }

  renderSprites(ctx, viewport) {
    const x = this.position.x;
    const y = viewport.height - this.position.y - this.height;

    if (this.jumping) {
      this.renderJumping(ctx, x, y);
    } else if (this.speed.x === 0) {
      this.renderStaying(ctx, x, y);
    } else {
      this.renderWalking(ctx, x, y, this.speed.x * viewport.dt / 10);
    }
  }

  renderWalking(ctx, x, y, speed = 0) {
    if (this.mirror) {
      if (this.speed.x < 0 && this.vector.x > 0) {
        this.stoppingMirrorSprite.render(ctx, x, y);
      } else {
        this.walkingMirrorAnimation.animate(speed);
        this.walkingMirrorAnimation.render(ctx, x, y);
      }
    } else {
      if (this.speed.x > 0 && this.vector.x < 0) {
        this.stoppingSprite.render(ctx, x, y);
      } else {
        this.walkingAnimation.animate(speed);
        this.walkingAnimation.render(ctx, x, y);
      }
    }
  }

  renderStaying(ctx, x, y) {
    if (this.mirror) {
      this.stayingMirrorSprite.render(ctx, x, y);
      this.walkingMirrorAnimation.setIndex(0);
    } else {
      this.stayingSprite.render(ctx, x, y);
      this.walkingAnimation.setIndex(0);
    }
  }

  renderJumping(ctx, x, y) {
    if (this.mirror) {
      this.jumpingMirrorSprite.render(ctx, x, y);
      this.walkingMirrorAnimation.setIndex(0);
    } else {
      this.jumpingSprite.render(ctx, x, y);
      this.walkingAnimation.setIndex(0);
    }
  }
}
