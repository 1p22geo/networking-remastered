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
      cx: parseInt(this.htmlElem.style.left || "120") + ICON_SIZES.HOST[0] / 2,
      y: parseInt(this.htmlElem.style.top || "0"),
      cy: parseInt(this.htmlElem.style.top || "0") + ICON_SIZES.HOST[1] / 2,
      width: ICON_SIZES.HOST[0],
      height: ICON_SIZES.HOST[1],
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
        const eth = new Ether(this.mac, ETHER_BROADCAST);
        pack.payload = eth;
        const ip = new IP("0.0.0.0", "255.255.255.255");
        eth.payload = ip;
        const dhcpd = new DHCPD("DISCOVER");
        ip.payload = dhcpd;
        window.sendpack(pack);
      }
    });
  }
}
