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
    this.frames = config.frames;
    this.x = config.x;
    this.y = config.y;
    this.zoom = config.zoom;
    this.padding = config.padding;
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
    const index = Math.floor(this.index);
    const sx = this.x + this.frames[index] * (this.width + this.padding);
    const sy = this.y;

    ctx.drawImage(
      this.image,
      sx,
      sy,
      this.width,
      this.height,
      x,
      y,
      this.width * this.zoom * devicePixelRatio,
      this.height * this.zoom * devicePixelRatio,
    );
  }
}
