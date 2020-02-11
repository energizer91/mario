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
    this.transparent = params.transparent || false;
    this.destructable = params.destructable || false;
    this.physics = new Physics(this.width, this.height);
    this.shakeAnimation = new Animation(progress => {
      // jump over a little bit
      if (progress < 0.5) {
        return 5 * progress;
      } else {
        return 5 - 5 * progress;
      }
    }, 150);

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

  shake() {
    if (this.shakeAnimation.playing) {
      return;
    }

    this.shakeAnimation.play();
  }

  /**
   * Renders object on context
   * @param {CanvasRenderingContext2D} ctx Canvas context
   * @param {Viewport} viewport
   */
  render(ctx, viewport) {
    const x = this.position.x - viewport.offset;
    let y = viewport.height - this.position.y - this.height;

    if (this.shakeAnimation.playing) {
      this.shakeAnimation.animate(viewport.dt);
      y = viewport.height - this.position.y - this.shakeAnimation.value - this.height;
    }

    this.physics.updatePosition(this.position.x, this.position.y);

    if (!this.sprite) {
      ctx.fillStyle = this.color;
      ctx.fillRect(x, y, this.width * devicePixelRatio, this.height * devicePixelRatio);
    } else {
      this.sprite.render(ctx, x, y, viewport.dt);
    }
  }
}
