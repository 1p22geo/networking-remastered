class Host {
  constructor(elem) {
    this.htmlElem = elem;
    this.mac = randMAC();
    this.ip = undefined;
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
  drawData() {
    this.htmlElem.querySelector(".mac").innerText = this.mac;
    this.htmlElem.querySelector(".ip").innerText = this.ip;
    this.htmlElem.querySelector(".dhcp-button").onclick =
      this.DHCPConfig.bind(this);
  }
  onRecv(packet) {}
  DHCPConfig() {
    window.links.forEach((link) => {
      if (link.start == this) {
        const dest = link.end;
        const pack = new Packet(this, dest);
        console.log(`${this.mac} sending DHCP to ${dest.mac}`);
        window.sendpack(pack);
      }
    });
  }
}
