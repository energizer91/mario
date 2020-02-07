/**
 * @typedef Viewport
 * @type {object}
 * @property {Number} width
 * @property {Number} height
 */

var GRAVITY = -0.3;

/**
 * @class Scene
 */
class Scene {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.objects = [];
    this.player = new Player(new Point(0, 0));
    this.playing = false;
    /** @type {Viewport} */
    this.viewport = {
      width: 800,
      height: 600
    };

    this.keys = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      use: false,
      sprint: false
    };

    this.ctx.canvas.width = this.viewport.width;
    this.ctx.canvas.height = this.viewport.height;

    this.attachKeyEvents();

    this.render = this.render.bind(this);
  }

  attachKeyEvents() {
    document.body.addEventListener('keydown', (e) => {
      /**
       * @param {Event} e Event
       */
      switch (e.code) {
        case 'ArrowLeft':
          this.keys.left = true;
          break;
        case 'ArrowRight':
          this.keys.right = true;
          break;
        case 'ArrowUp':
          this.keys.up = true;
          break;
        case 'ArrowDown':
          this.keys.down = true;
          break;
        case 'Space':
          this.keys.jump = true;
          break;
        case 'KeyE':
          this.keys.use = true;
          break;
        case 'ShiftLeft':
          this.keys.sprint = true;
          break;
      }
    });

    document.body.addEventListener('keyup', (e) => {
      /**
       * @param {Event} e Event
       */
      switch (e.code) {
        case 'ArrowLeft':
          this.keys.left = false;
          break;
        case 'ArrowRight':
          this.keys.right = false;
          break;
        case 'ArrowUp':
          this.keys.up = false;
          break;
        case 'ArrowDown':
          this.keys.down = false;
          break;
        case 'Space':
          this.keys.jump = false;
          break;
        case 'KeyE':
          this.keys.use = false;
          break;
        case 'ShiftLeft':
          this.keys.sprint = false;
          break;
      }
    });
  }

  renderDebug() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(this.viewport.width - 150, 0, 150, 300);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = "bold 16px Arial";
    if (this.keys.up) {
      this.ctx.fillText("up", this.viewport.width - 100, 16);
    }
    if (this.keys.left) {
      this.ctx.fillText("left", this.viewport.width - 140, 32);
    }
    if (this.keys.right) {
      this.ctx.fillText("right", this.viewport.width - 50, 32);
    }
    if (this.keys.down) {
      this.ctx.fillText("down", this.viewport.width - 100, 48);
    }

    if (this.keys.jump) {
      this.ctx.fillText("jump", this.viewport.width - 100, 32);
    }

    if (this.keys.sprint) {
      this.ctx.fillText("sprint", this.viewport.width - 50, 16);
    }

    this.ctx.fillText("Speed: " + this.player.speed.x.toFixed(1) + "," + this.player.speed.y.toFixed(1), this.viewport.width - 150, 60);
    this.ctx.fillText("Pos: " + this.player.position.x.toFixed(1) + "," + this.player.position.y.toFixed(1), this.viewport.width - 150, 76);
  }

  addPlayer(player) {
    this.player = player;
  }

  /**
   * Adds objects to canvas
   * @param {SceneObject} object Scene object
   */
  addObject(object) {
    this.objects.push(object);
  }

  play() {
    this.playing = true;
    this.render();
  }

  stop() {
    this.playing = false;
  }

  controlPlayer() {
    if (this.keys.right) {
      this.player.move('right');
    } else if (this.keys.left) {
      this.player.move('left');
    } else {
      this.player.stop();
    }

    if (this.keys.jump) {
      this.player.jump();
    }

    if (this.keys.sprint) {
      this.player.sprint();
    } else {
      this.player.walk();
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.viewport.width, this.viewport.height);

    this.objects.forEach(object => {
      object.render(this.ctx, this.viewport);
    });

    this.controlPlayer();

    this.player.render(this.ctx, this.viewport);

    this.renderDebug();

    if (this.playing) {
      requestAnimationFrame(this.render);
    }
  }
}
