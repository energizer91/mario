class SceneObject {
  /**
   *
   * @param {String} name Object name
   * @param {Point} pos Position
   * @param {object} params
   */
  constructor(name, pos, params = {}) {
    this.name = name;
    this.position = pos;
    this.width = 16;
    this.height = 16;
    this.sprite = null;
    this.color = '#000';
    this.transparent = params.transparent;
    this.physics = new Physics(this.width, this.height);

    this.physics.updatePosition(this.position.x, this.position.y);
    this.delta = 1;
  }

  updateSize(width, height) {
    this.width = width;
    this.height = height;
    this.physics.updateSize(width, height);
  }

  setSprite(sprite) {
    this.sprite = sprite;
  }

  /**
   * Renders object on context
   * @param {CanvasRenderingContext2D} ctx Canvas context
   * @param {Viewport} viewport
   */
  render(ctx, viewport) {
    const x = this.position.x - viewport.offset;
    const y = viewport.height - this.position.y - this.height;

    this.physics.updatePosition(this.position.x, this.position.y);

    if (!this.sprite) {
      ctx.fillStyle = this.color;
      ctx.fillRect(x, y, this.width * devicePixelRatio, this.height * devicePixelRatio);
    } else {
      this.sprite.render(ctx, x, y);
    }
  }
}
