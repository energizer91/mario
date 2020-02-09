class SceneObject {
  /**
   *
   * @param {String} name Object name
   * @param {Point} pos Position
   */
  constructor(name, pos) {
    this.name = name;
    this.position = pos;
    this.width = 0;
    this.height = 0;
    this.texture = null;
    this.color = '#000';
    this.delta = 1;
    this.solid = false;
  }

  /**
   * Renders object on context
   * @param {CanvasRenderingContext2D} ctx Canvas context
   * @param {Viewport} viewport
   */
  render(ctx, viewport) {
    // do nothing
  }
}
