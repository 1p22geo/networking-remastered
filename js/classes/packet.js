class Packet {
  constructor(src, dest) {
    this.src = src;
    this.dest = dest;
    this.htmlElem = undefined;
    this.payload;
    this.x = src.getpos().cx;
    this.y = src.getpos().cy;
    this.width = ICON_SIZES.PACKET[0];
    this.height = ICON_SIZES.PACKET[0];
    this.speed = 2;
  }

  onHTML() {
    let layers = [];
    let payload = this.payload;
    while (true) {
      if (!payload) break;
      layers.push(payload);
      payload = payload.payload;
    }
    this.htmlElem.querySelector(".tooltip").innerHTML = prep(
      `${layers.map((l) => l._packtype).join(" / ")}<br/>
${layers.map((l) => l.render()).join("<hr/>")}
`,
    );
  }

  propagate() {
    let dx = this.dest.getpos().cx - this.x;
    let dy = this.dest.getpos().cy - this.y;

    let d = Math.sqrt(dx ** 2 + dy ** 2);
    dx = dx / d;
    dy = dy / d;

    this.x += dx * this.speed;
    this.y += dy * this.speed;

    if (Math.abs(this.dest.getpos().cx - this.x) < 10) {
      if (this.dest.onRecv) {
        this.dest.onRecv(this);
      }
      this.htmlElem.remove();
      this.htmlElem = undefined;
      const index = window.packets.indexOf(this);
      if (index > -1) {
        window.packets.splice(index, 1);
      }
      delete this;
    }

    if (this.htmlElem) {
      this.htmlElem.style.left = this.x - 0.5 * this.width + "px";
      this.htmlElem.style.top = this.y - 0.5 * this.height + "px";
    }
  }
}
