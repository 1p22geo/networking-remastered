class Switch {
  constructor(elem) {
    this.htmlElem = elem;
    this.switchTable = {};

    this.drawData();
  }
  getpos() {
    return {
      x: parseInt(this.htmlElem.style.left || "120"),
      cx:
        parseInt(this.htmlElem.style.left || "120") + ICON_SIZES.SWITCH[0] / 2,
      y: parseInt(this.htmlElem.style.top || "0"),
      cy: parseInt(this.htmlElem.style.top || "0") + ICON_SIZES.SWITCH[0] / 2,
      width: ICON_SIZES.SWITCH[0],
      height: ICON_SIZES.SWITCH[1],
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
    const ul = this.htmlElem.querySelector(".switch-hosts");
    ul.textContent = "";
    Array.from(Object.keys(this.switchTable)).forEach((mac) => {
      let el = document.createElement("li");
      el.innerText = mac;
      ul.appendChild(el);
    });
  }
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
  forward(packet, device) {
    // I know theoretically we should forward packets to switch ports instead of devices.
    // But hardware-like functionality including actual ethernet sockets and physical ports has not been implemented yet.
    // Which means the switch table maps MAC addresses to physical devices instead of physical switch ports.
    // Once again, I am sorry for making such a simplification to the network model.
    //
    // If you want something more resembling actual networking, go buy Cisco Packet Tracer.
    // It's much better.

    const pack = new Packet(this, device);
    pack.payload = packet.payload;
    window.sendpack(pack);
  }
  onRecv(packet) {
    const layers = flatten_layers(packet);
    if (layers[0]._packtype == "Ether") {
      const mac = layers[0].src;
      this.switchTable[mac] = packet.src;
      this.drawData();
      if (this.switchTable.hasOwnProperty(layers[0].dest)) {
        this.forward(packet, this.switchTable[layers[0].dest]);
        return;
      }
    }
    this.flood(packet);
  }
}
