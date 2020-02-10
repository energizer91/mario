class Physics {
  constructor(width, height) {
    this.height = height;
    this.width = width;
    this.top = this.height;
    this.bottom = 0;
    this.left = 0;
    this.right = this.width;
    this.collisions = [0, 0, 0, 0];
  }

  updateSize(width, height) {
    this.width = width;
    this.height = height;

    this.updatePosition(this.left, this.bottom);
  }

  updatePosition(x, y) {
    this.top = y + this.height;
    this.bottom = y;
    this.left = x;
    this.right = x + this.width;
  }

  getCenter() {
    return new Point(this.left + this.width / 2, this.bottom + this.height / 2);
  }

  inBetween(coordinate, start, end) {
    return coordinate >= start && coordinate <= end;
  }

  /**
   * Get collisions with other physics object
   * @param {Physics} physics
   * @returns {{colliding: boolean, physics: Physics, collisions: Number[]}} collisions (top, right, bottom, left)
   */
  getCollision(physics) {
    const physicsCenter = physics.getCenter();
    const result = {
      physics: this,
      colliding: false,
      collisions: [0, 0, 0, 0]
    };

    this.collisions = result.collisions;

    const horizontalCollided = this.inBetween(physicsCenter.x, this.left, this.right);
    const verticalCollided = this.inBetween(physicsCenter.y, this.bottom, this.top);

    if (!(horizontalCollided || verticalCollided)) {
      return result;
    }

    if (horizontalCollided) {
      if (this.top >= physics.bottom && this.bottom < physics.bottom) {
        result.colliding = true;
        result.collisions[0] = this.top;
      } else if (this.bottom <= physics.top && this.bottom > physics.bottom) {
        result.colliding = true;
        result.collisions[2] = this.bottom;
      }
    }

    if (verticalCollided) {
      if (this.left <= physics.right && this.right > physics.right) {
        result.colliding = true;
        result.collisions[3] = this.left;
      } else if (this.right >= physics.left && this.right < physics.right) {
        result.colliding = true;
        result.collisions[1] = this.right;
      }
    }

    return result;
  }

  /**
   * Renders collisions for debug
   * @param {CanvasRenderingContext2D} ctx
   * @param {Viewport} viewport
   */
  render(ctx, viewport) {
    ctx.strokeStyle = "#0f0";
    ctx.lineWidth = 2 * devicePixelRatio;

    const startX = this.left - viewport.offset;
    const startY = viewport.height - this.top;

    ctx.beginPath();

    ctx.moveTo(startX * devicePixelRatio, startY * devicePixelRatio);

    if (this.collisions[0]) {
      ctx.lineTo((startX + this.width) * devicePixelRatio, startY * devicePixelRatio);
    } else {
      ctx.moveTo((startX + this.width) * devicePixelRatio, startY * devicePixelRatio);
    }

    if (this.collisions[1]) {
      ctx.lineTo((startX + this.width) * devicePixelRatio, (startY + this.height) * devicePixelRatio);
    } else {
      ctx.moveTo((startX + this.width) * devicePixelRatio, (startY + this.height) * devicePixelRatio);
    }

    if (this.collisions[2]) {
      ctx.lineTo(startX * devicePixelRatio, (startY + this.height) * devicePixelRatio);
    } else {
      ctx.moveTo(startX * devicePixelRatio, (startY + this.height) * devicePixelRatio);
    }

    if (this.collisions[3]) {
      ctx.lineTo(startX * devicePixelRatio, startY * devicePixelRatio);
    } else {
      ctx.moveTo(startX * devicePixelRatio, startY * devicePixelRatio);
    }

    ctx.stroke();
  }
}
