class DHCPserver {
  constructor(elem) {
    this.htmlElem = elem;
    this.mac = randMAC();
    this.ip = "0.0.0.0";
    this.subnet = "/24";
    this.assignedAddresses = {};
    this.drawData();

    this.dialog = this.htmlElem.querySelector("dialog");
    this.htmlElem.querySelector(".dhcp-button").onclick = () => {
      this.dialog.showModal();
    };
    this.htmlElem.querySelector(".close-dhcp").onclick = () => {
      this.dialog.close();
    };
    this.htmlElem.querySelector(".form-dhcp").onchange = () => {
      this.DHCPConfig();
    };
  }
  getpos() {
    return {
      x: parseInt(this.htmlElem.style.left || "120"),
      cx: parseInt(this.htmlElem.style.left || "120") + ICON_SIZES.DHCP[0] / 2,
      y: parseInt(this.htmlElem.style.top || "0"),
      cy: parseInt(this.htmlElem.style.top || "0") + ICON_SIZES.DHCP[1] / 2,
      width: ICON_SIZES.DHCP[0],
      height: ICON_SIZES.DHCP[1],
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
    this.htmlElem.querySelector(".ip").innerText = this.ip + this.subnet;
    this.htmlElem.querySelector("[name=ip]").value = this.ip;
  }
  onRecv(packet) {
    const layers = flatten_layers(packet);
    if (layers.map((l) => l._packtype).includes("DHCPD")) {
      if (layers[2].msg == "REQUEST") {
        const mac = layers[0].src;
        window.links.forEach((link) => {
          if (link.start == this) {
            const dest = link.end;
            const pack = new Packet(this, dest);
            const eth = new Ether(this.mac, mac);
            pack.payload = eth;
            const ip = new IP(this.ip, this.assignedAddresses[mac]);
            eth.payload = ip;
            const dhcpd = new DHCPD("ACK");
            ip.payload = dhcpd;
            window.sendpack(pack);
          }
        });
      }
      if (layers[2].msg == "DISCOVER") {
        const mac = layers[0].src;
        let offerIP = () => {
          window.links.forEach((link) => {
            if (link.start == this) {
              const dest = link.end;
              const pack = new Packet(this, dest);
              const eth = new Ether(this.mac, mac);
              pack.payload = eth;
              const ip = new IP(this.ip, this.assignedAddresses[mac]);
              eth.payload = ip;
              const dhcpd = new DHCPD("OFFER");
              ip.payload = dhcpd;
              window.sendpack(pack);
            }
          });
        };
        offerIP = offerIP.bind(this);
        if (!this.assignedAddresses.hasOwnProperty(mac)) {
          switch (this.subnet) {
            case "/24": {
              for (let n = 10; n < 250; n++) {
                let ip = this.ip.split(".");
                ip[3] = n.toString();
                ip = ip.join(".");
                if (Object.values(this.assignedAddresses).includes(ip))
                  continue;
                this.assignedAddresses[mac] = ip;
                break;
              }
            }
          }
        }
        offerIP();
      }
    }
  }
  DHCPConfig() {
    this.ip = this.htmlElem.querySelector("[name=ip]").value || "";
    this.drawData();
  }
}
