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
    this.index = 0;
  }

  animate(speed = 0) {
    this.index += Math.abs(speed);

    if (this.index >= this.frames.length - 1) {
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
   */
  render(ctx, x, y) {
    if (this.autoplay) {
      this.animate(this.speed);
    }

    const index = Math.floor(this.index);
    const currentFrame = !this.frames.length ? 0 : this.frames[index];
    const sx = this.x + currentFrame * (this.width + this.padding);
    const sy = this.y;

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
