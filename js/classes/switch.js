class Switch {
  constructor(elem) {
    this.htmlElem = elem;

    this.drawData();
  }
  getpos() {
    return {
      x: parseInt(this.htmlElem.style.left || "120"),
      cx: parseInt(this.htmlElem.style.left || "120") + 25,
      y: parseInt(this.htmlElem.style.top || "0"),
      cy: parseInt(this.htmlElem.style.top || "0") + 25,
      width: 50,
      height: 50,
    };
  }
  inrect(x, y) {
    let pos = this.getpos();
    if (x < pos.x) return false;
    if (x > pos.x + pos.width) return false;
    if (y < pos.y) return false;
    if (y > pos.y + pos.height) return false;
    return true;
  }
  drawData() {}
  flood(packet) {
    window.links.forEach((link) => {
      if (link.start == this && link.end != packet.src) {
        const dest = link.end;
        const pack = new Packet(this, dest);
        pack.payload = packet.payload;
        window.sendpack(pack);
      }
    });
  }
  onRecv(packet) {
    this.flood(packet);
  }
}
