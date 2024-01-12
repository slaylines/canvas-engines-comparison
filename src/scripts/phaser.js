import Engine from './engine'
import * as Phaser from 'phaser'

class PhaserEngine extends Engine {
  constructor() {
    super()
    this.canvas = document.createElement('div')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.content.appendChild(this.canvas)
    this.config = {
      type: Phaser.AUTO,
      width: this.width,
      height: this.height,
      backgroundColor: 0xffffff,
      parent: this.canvas,
      scene: {
        create: () => this.render(),
        update: () => this.update(),
      },
    }
    this.game = new Phaser.Game(this.config)
  }

  render() {
    if (this.rects) this.rects.forEach((rect) => rect.el.destroy())
    this.rects = []
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width
      const y = Math.random() * this.height
      const size = 10 + Math.random() * 40
      const speed = 1 + Math.random()
      const rect = this.game.scene.scenes[0].add.rectangle(x, y, size, size, 0xffffff)
      rect.setStrokeStyle(1, 0x000000, 1)
      this.rects.push({ x, y, size, speed, el: rect })
    }
  }

  update() {
    const rectsToRemove = []
    for (let i = 0; i < this.count.value; i++) {
      const rect = this.rects[i]
      rect.x -= rect.speed
      rect.el.x = rect.x
      if (rect.x + rect.size / 2 < 0) rectsToRemove.push(i)
    }
    rectsToRemove.forEach((i) => {
      this.rects[i].x = this.width + this.rects[i].size / 2
    })
    this.meter.tick()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PhaserEngine()
})
