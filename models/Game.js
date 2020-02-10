// make array of unique elements by creating an unique set and transforming to array
const unique = elements => Array.from(new Set(elements));

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
    this.tiles = null;
  }

  async loadLevel(name) {
    if (!this.tiles) {
      this.tiles = await this.loadTiles();
    }

    const response = await fetch(`levels/${name}.json`);
    const data = await response.json();

    this.level = name;
    this.levelData = data;

    const tiles = unique([data.player.type, ...data.objects.map(object => object.type)]);
    const resources = unique(tiles.map(tile => this.tiles.sets[this.tiles.tiles[tile].set].file));

    await this.loadResources(resources);

    this.createScene();
    this.scene.play();
  }

  createScene() {
    this.scene = new Scene(this.ctx, this.levelData, {
      textures: this.textures,
      tiles: this.tiles
    });
  }

  loadTiles() {
    fetch(`data/tiles.json`)
      .then(response => response.json())
      .then(data => this.tiles = data);
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
