/**
 * @typedef Viewport
 * @type {object}
 * @property {Number} width
 * @property {Number} height
 * @property {Number} dt Time delta
 * @property {Number} offset Viewport offset
 * @property {Number} aspectRatio Device aspect ratio
 */

var GRAVITY = -0.3;

/**
 * @class Scene
 */
class Scene {
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} data
   * @param {{textures: Map(String, CanvasImageSource), tiles: Object[]}} params
   */
  constructor(ctx, data, params) {
    this.ctx = ctx;
    this.params = params;
    this.data = data;
    this.objects = [];
    this.player = new Player(new Point(data.player.position), params);
    this.debug = false;
    this.playing = false;
    /** @type {Viewport} */
    this.viewport = {
      width: 256,
      height: 240,
      aspectRatio: window.devicePixelRatio,
      offset: 0,
      dt: 0
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

    this.lastTime = 0;

    this.setViewport(this.viewport.width * this.viewport.aspectRatio, this.viewport.height * this.viewport.aspectRatio);
    this.attachKeyEvents();
    this.loadObjects();

    this.render = this.render.bind(this);
  }

  setViewport(width, height) {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
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
        case 'KeyD':
          this.debug = !this.debug;
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

  loadObjects() {
    this.objects = this.data.objects.map(object => {
      const {type, position, ...rest} = object;
      const {set, ...params} = this.params.tiles.tiles[type];
      const {file, ...tile} = {
        ...this.params.tiles.sets[set],
        ...params,
        ...rest
      };
      const obj = new SceneObject(type, new Point(position), tile);
      obj.setSprite(new Sprite(this.params.textures.get(file), tile));

      return obj;
    })
  }

  renderDebug() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(this.viewport.width - 150, 0, 150, 150);
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
    this.ctx.fillText("dt: " + this.viewport.dt, this.viewport.width - 150, 92);
    this.ctx.fillText("fps: " + Math.round(1 / this.viewport.dt), this.viewport.width - 150, 108);
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
    this.viewport.dt = 0;
    this.lastTime = 0;
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

  getCollisions() {
    const collidedBlocks = this.objects
      .filter(object => !object.transparent)
      .map(object => object.physics.getCollision(this.player.physics))
      .filter(object => object.colliding);

    const collisions = collidedBlocks.reduce((acc, item) => [
      acc[0] || item.collisions[0],
      acc[1] || item.collisions[1],
      acc[2] || item.collisions[2],
      acc[3] || item.collisions[3]
    ], [0, 0, 0, 0]);

    this.player.setCollisions(...collisions);

    if (this.debug) {
      collidedBlocks.forEach(block => block.physics.render(this.ctx, this.viewport));
    }
  }

  renderBackground() {
    const color = this.data.background.color;

    if (color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, this.viewport.width * devicePixelRatio, this.viewport.height * devicePixelRatio);
    } else {
      this.ctx.clearRect(0, 0, this.viewport.width * devicePixelRatio, this.viewport.height * devicePixelRatio);
    }
  }

  render() {
    const now = Date.now();
    this.viewport.dt = (now - this.lastTime) / 1000.0;
    this.lastTime = now;
    this.renderBackground();
    this.ctx.imageSmoothingEnabled = false;

    this.objects.forEach(object => {
      if (object.position.x >= this.viewport.offset || object.position.x <= this.viewport.offset + this.viewport.width) {
        object.render(this.ctx, this.viewport);
      }
    });

    this.controlPlayer();

    this.getCollisions();

    this.player.render(this.ctx, this.viewport);

    // move viewport after moving at half
    if (this.player.position.x + this.player.width > this.viewport.width / 2) {
      this.viewport.offset = this.player.position.x + this.player.width - this.viewport.width / 2
    }

    if (this.debug) {
      this.renderDebug();
    }

    if (this.playing) {
      requestAnimationFrame(this.render);
    }
  }
}
