class DHCPserver {
  constructor(elem) {
    this.htmlElem = elem;
    this.mac = randMAC();
    this.ip = "0.0.0.0";
    this.subnet = "/24";
    this.assignedAddresses = [];
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
    this.htmlElem.querySelector(".ip").innerText = this.ip + this.subnet;
    this.htmlElem.querySelector("[name=ip]").value = this.ip;
  }
  onRecv(packet) {}
  DHCPConfig() {
    this.ip = this.htmlElem.querySelector("[name=ip]").value || "";
    this.drawData();
  }
}
