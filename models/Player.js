const MAX_WALKING_SPEED = 150;
const MAX_RUNNING_SPEED = 200;

class Player extends SceneObject {
  constructor(pos, params) {
    super('Player', pos);
    this.width = 16 * devicePixelRatio;
    this.height = 16 * devicePixelRatio;
    this.color = '#ff0000';
    this.speed = new Point(0, 0);
    this.vector = new Point(0, 0);
    this.maxSpeed = new Point(MAX_WALKING_SPEED, 700);
    this.delta = 5;
    this.mirror = false;
    this.stayingSprite = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      padding: 0,
      zoom: 1,
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
    this.jumpingSprite = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      padding: 0,
      zoom: 1,
      x: 274,
      y: 44,
      frames: [5]
    });
    this.jumpingMirrorSprite = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      padding: 0,
      zoom: 1,
      x: 16,
      y: 44,
      frames: [8]
    });
    this.walkingAnimation = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      padding: 0,
      zoom: 1,
      x: 273,
      y: 44,
      frames: [1, 2, 3, 2]
    });
    this.walkingMirrorAnimation = new Sprite(params.textures.get("characters.gif"), {
      width: 16,
      height: 16,
      padding: 0,
      zoom: 1,
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
    return this.position.y < 0;
  }

  render(ctx, viewport) {
    super.render(ctx, viewport);

    if (!this.jumping) {
      if (this.vector.x > 0) {
        this.mirror = false;
        this.speed.x = Math.min(this.speed.x + this.delta, this.maxSpeed.x);
      } else if (this.vector.x < 0) {
        this.mirror = true;
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
      this.speed.y += GRAVITY * 100;
    }

    if (this.onGround()) {
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

    if (this.position.x + this.width > viewport.width) {
      this.speed.x = 0;
      this.position.x = viewport.width - this.width;
    }

    if (this.speed.x !== 0) {
      this.position.x += this.speed.x * viewport.dt;
    }

    if (this.speed.y !== 0) {
      this.position.y += this.speed.y * viewport.dt;
    }

    if (this.position.y > viewport.height) {
      this.speed.y = 0;
      this.position.y = viewport.height;
    }

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
      this.walkingMirrorAnimation.animate(speed);
      this.walkingMirrorAnimation.render(ctx, x, y);
    } else {
      this.walkingAnimation.animate(speed);
      this.walkingAnimation.render(ctx, x, y);
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
