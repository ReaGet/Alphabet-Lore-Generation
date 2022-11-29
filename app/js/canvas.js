export default class Canvas {
  constructor(canvas) {
    if (!canvas) {
      throw Error("Укажите канвас для отображения результата");
    }
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.frameSize = 700;
  }

  image(img, { x, y }) {
    this.ctx.drawImage(
      img,
      x * this.frameSize,
      y * this.frameSize,
      this.frameSize,
      this.frameSize,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
}