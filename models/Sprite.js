/**
 * @typedef SpriteConfig
 * @type {object}
 * @property {Number} width
 * @property {Number} height
 * @property {Number[]} frames
 * @property {Number} x
 * @property {Number} y
 * @property {Number} zoom
 * @property {Number} padding
 * @property {boolean} autoplay
 * @property {Number} speed
 * @property {Number[]} grid
 */

class Sprite {
  /**
   * Sprite constructor
   * @param {CanvasImageSource} image
   * @param {SpriteConfig} config
   */
  constructor(image, config) {
    this.image = image;
    this.width = config.width;
    this.height = config.height;
    this.frames = config.frames || [];
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.zoom = config.zoom || 1;
    this.padding = config.padding || 0;
    this.autoplay = config.autoplay || false;
    this.speed = config.speed || 0;
    this.grid = config.grid || [Infinity, Infinity];
    this.index = 0;
  }

  animate(speed = 0) {
    this.index += Math.abs(speed);

    if (this.index >= this.frames.length) {
      this.index = 0;
    }
  }

  setIndex(index) {
    this.index = index;
  }

  /**
   * Render sprite
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number} x
   * @param {Number} y
   * @param {Number} dt time delta
   */
  render(ctx, x, y, dt) {
    if (this.autoplay) {
      this.animate(this.speed * dt);
    }

    const xIndex = Math.floor(this.index);
    let currentFrame = !this.frames.length ? 0 : this.frames[xIndex];
    let yOffset = 0;

    if (currentFrame > this.grid[0]) {
      yOffset += Math.floor(currentFrame / this.grid[0]);
      currentFrame = currentFrame % this.grid[0];
    }

    const sx = this.x + currentFrame * (this.width + this.padding);
    const sy = this.y + this.height * yOffset;

    ctx.drawImage(
      this.image,
      sx,
      sy,
      this.width,
      this.height,
      x * devicePixelRatio,
      y * devicePixelRatio,
      this.width * this.zoom * devicePixelRatio,
      this.height * this.zoom * devicePixelRatio
    );
  }
}
