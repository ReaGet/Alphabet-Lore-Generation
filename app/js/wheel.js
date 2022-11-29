export default class Wheel {
  constructor(el) {
    if (!el) {
      throw Error("Укажите контейнер для колеса");
    }
    this.canvas = el.querySelector(".wheel");
    this.button = el.querySelector(".wheel__spin");
    this.ctx = this.canvas.getContext("2d");
    this.listeners = {};
    this.set();
    this.bind();
  }

  set(sectors = []) {
    this.sectors = sectors;
    this.total = this.sectors.length;
    this.diameter = this.canvas.width;
    this.radius = this.diameter / 2;
    this.pi = Math.PI;
    this.tau = this.pi * 2;
    this.arc = this.tau / (this.total || 1);
    this.friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
    this.velocityMin = 0.002;
    this.velocityMax = 0;
    this.velocity = 0;
    this.angle = 0;
    this.isSpinning = false;
    this.isAccelerating = false;

    this.sectors.forEach(this.drawSector.bind(this));
    this.rotate();
    this.loop();
  }

  index() {
    return Math.floor(this.total - this.angle / this.tau * this.total) % this.total;
  }

  bind() {
    this.button.addEventListener("click", this.spin.bind(this));
  }

  spin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.isAccelerating = true;
    this.velocityMax = Math.random() * (0.8 - 0.25) + 0.25;
  }

  drawSector(sector, i) {
    const angle = this.arc * i;
    const arc = this.arc;
    const ctx = this.ctx;
    const radians = this.radius;
    ctx.save();

    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(radians, radians);
    ctx.arc(radians, radians, radians, angle, angle + arc);
    ctx.lineTo(radians, radians);
    ctx.fill();

    ctx.translate(radians, radians);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(sector.label, radians - 10, 10);

    ctx.restore();
  }

  rotate() {
    const sector = this.sectors[this.index()];
    if (!sector) {
      return;
    }

    const angle = this.angle - this.pi / 2; 
    this.ctx.canvas.style.transform = `rotate(${angle}rad)`;
    this.button.textContent = !this.velocity ? "SPIN" : sector.label;
    this.button.style.background = sector.color;
  }

  update() {
    if (!this.isSpinning) return;

    if (this.velocity >= this.velocityMax) {
      this.isAccelerating = false;
    }

    if (this.isAccelerating) {
      this.velocity = !this.velocity ? this.velocityMin : this.velocity;
      this.velocity *= 1.06;
    } else {
      this.isAccelerating = false;
      this.velocity *= this.friction;

      if (this.velocity < this.velocityMin) {
        this.isSpinning = false;
        this.velocity = 0;
        this.emit("finish", this.sectors[this.index()]);
      }
    }

    this.angle += this.velocity;
    this.angle %= this.tau;
    this.rotate();
  }

  loop() {
    this.update();
    requestAnimationFrame(this.loop.bind(this));
  }

  on(listener, fn) {
    if (!this.listeners[listener]) {
      this.listeners[listener] = [];
    }
    this.listeners[listener].push(fn);
  }

  off(listener, fn) {
    if (!(this.listeners[listener] && this.listeners[listener].indexOf(fn))) {
      return;
    }
    this.listeners[listener].splice(this.listeners[listener].indexOf(fn), 1);
  }

  emit(listener) {
    if (!this.listeners[listener]) return;

    this.listeners[listener].forEach((fn) => {
      fn.apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      )
    });
  }
}