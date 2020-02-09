class Game {
  /**
   * Game constructor
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.level = '';
    this.levelData = null;
    this.scene = null;
    this.textures = new Map();
  }

  loadLevel(name) {
    fetch(`levels/${name}.json`)
      .then(response => response.json())
      .then(data => {
        this.level = name;
        this.levelData = data;

        const resources = [data.player.name];

        return this.loadResources(resources);
      })
      .then(() => {
        this.createScene();
        this.scene.play();
      })
  }

  createScene() {
    this.scene = new Scene(this.ctx, this.levelData, {
      textures: this.textures
    });
  }

  loadResources(urls) {
    return Promise.all(urls.filter(url => !this.textures.has(url)).map(url => this.loadTexture(url)))
      .then(textures => textures.forEach(texture => this.textures.set(texture.url, texture.img)));
  }

  loadTexture(url) {
    return new Promise(((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({url, img});
      img.onerror = reject;
      img.src = `resources/${url}`;
    }))
  }
}
