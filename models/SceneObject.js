class SceneObject {
  /**
   *
   * @param {String} name Object name
   * @param {Point} pos Position
   */
  constructor(name, pos) {
    this.name = name;
    this.position = pos;
    this.width = 16;
    this.height = 16;
    this.sprite = null;
    this.color = '#000';
    this.delta = 1;
    this.solid = false;
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
    const x = this.position.x * devicePixelRatio;
    const y = (viewport.height - this.position.y - this.height) * devicePixelRatio;

    if (!this.sprite) {
      ctx.fillStyle = this.color;
      ctx.fillRect(x, y, this.width, this.height);
    } else {
      this.sprite.render(ctx, x, y);
    }
  }
}
