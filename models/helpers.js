class Point {
  constructor(x = 0, y = 0) {
    if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
    } else {
      this.x = x;
      this.y = y;
    }
  }
}

/**
 * @callback AnimationProgressCallback
 * @param {Number} progress Animation progress
 */

/**
 * Animation number constructor
 * @constructor
 * @param {Number} from Animation start
 * @param {Number} to Animation finish
 * @param {Number} duration Animation duration
 *//**
 * Animation duration constructor
 * @constructor
 * @param {AnimationProgressCallback} fn Progress callback
 * @param {Number} duration Animation duration
 */
class Animation {
  constructor(from, to, duration) {
    this.progress = 0;
    this.playing = false;

    if (typeof from === 'function') {
      // constructor with function as animation handler
      this.fn = from;
      this.duration = to;
      this.current = this.fn(this.progress);
    } else {
      // constructor with from, to and duration
      this.from = from;
      this.to = to;
      this.duration = duration;
      this.current = from;
    }
  }

  play() {
    this.playing = true;
  }

  animate(dt) {
    this.progress += dt / this.duration * 1000;

    if (this.progress >= 1) {
      this.reset();
    }

    if (this.fn) {
      this.current = this.fn(this.progress);
    } else {
      this.current = this.from + (this.to - this.from) * this.progress;
    }
  }

  reset() {
    this.current = this.from;
    this.progress = 0;
    this.playing = false;
  }

  get value() {
    return this.current;
  }
}
