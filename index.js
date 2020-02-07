/**
 * @typedef Viewport
 * @type Object
 * @property {Number} width
 * @property {Number} height
 */

/**
 * @class Scene
 */
class Scene {
    /**
     *
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.objects = [];
        this.player = null;
        this.playing = false;
        /**
         * Viewport
         * @type {Viewport}
         */
        this.viewport = {
            width: 800,
            height: 600
        };

        this.ctx.canvas.width = this.viewport.width;
        this.ctx.canvas.height = this.viewport.height;

        document.body.addEventListener('keydown', (e) => {
            /**
             * @param {Event} e Event
             */

            switch (e.code) {
                case 'ArrowRight':
                    this.player.setVector(1, 0);
                    break;
                default:
                    this.player.setVector(0, 0);
            }
        });

        this.render = this.render.bind(this);
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

    render() {
        this.objects.forEach(object => {
            object.render(this.ctx, this.viewport);
        });

        this.ctx.clearRect(0, 0, this.viewport.height, this.viewport.width);

        if (this.player) {
            this.player.render(this.ctx, this.viewport);
        }

        if (this.playing) {
            requestAnimationFrame(this.render);
        }
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

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

class Player extends SceneObject {
    constructor(pos) {
        super('Player', pos);
        this.width = 20;
        this.height = 60;
        this.color = '#ff0000';
        this.speed = new Point(0, 0);
        this.vector = new Point(0, 0);
        this.maxSpeed = new Point(5, 5);
    }

    addSpeed(x = 0, y = 0) {
        this.speed.x = x;
        this.speed.y = y;
    }

    setVector(x = 0, y = 0) {
        this.vector.x = x;
        this.vector.y = y;
    }

    render(ctx, viewport) {
        super.render(ctx, viewport);

        if (this.vector.x && this.speed.x < this.maxSpeed.x) {
            this.speed.x += this.delta;
        } else if (this.speed.x) {
            this.speed.x -= this.delta;
        }

        if (this.vector.y && this.speed.y < this.maxSpeed.y) {
            this.speed.y += this.delta;
        } else if (this.speed.y) {
            this.speed.y -= this.delta;
        }

        if (this.speed.x !== 0) {
            this.position.x += this.delta;
        }

        if (this.speed.y !== 0) {
            this.position.y += this.delta;
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, viewport.height - this.position.y - this.height, this.width, this.height);
    }
}

const scene = new Scene(document.getElementById('viewport'));
const player = new Player(new Point(0, 0));
scene.addPlayer(player);

scene.play();