class VLANSwitch {
  constructor(elem) {
    this.htmlElem = elem;
    this.vlans = [];

    this.drawData();

    this.htmlElem.querySelector(".add-button").onclick = this.addVLAN.bind(this);
  }
  getpos() {
    return {
      x: parseInt(this.htmlElem.getBoundingClientRect().x || "120"),
      cx:parseInt(this.htmlElem.getBoundingClientRect().x || "120") + ICON_SIZES.ROUTERIF[0] / 2,
      y: parseInt(this.htmlElem.getBoundingClientRect().y || "0"),
      cy: parseInt(this.htmlElem.getBoundingClientRect().y || "0") + ICON_SIZES.ROUTERIF[1] / 2,
      width: ICON_SIZES.ROUTERIF[0],
      height: ICON_SIZES.ROUTERIF[1],
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
  addVLAN() {
    let div = document.createElement("div");
    div.innerHTML = `
<div class="draggable tooltip-container">
   <div class="handle">
     <img src="img/switch.png" />
  </div>
  <div class="tooltip">
    <h2><span class="name">VLAN .${this.vlans.length+1}</span></h2>
    Known hosts
    <ul class="switch-hosts">

    </ul>
    <div class="actionbar">
      <img src="img/DHCP.png" class="button reset-button" title="Reset known hosts"/>
    </div>
  </div>
</div>
`;
    dragElement(div.children[0]);
    sw = new VLAN(div.children[0], this, `${this.vlans.length+1}`);
    window.devices.push(sw);
    this.vlans.push(sw);
    this.htmlElem.appendChild(div);
    this.drawData();
  }

  drawData() {
    this.htmlElem.querySelector(".vlans").innerHTML = `
<div class="table vlan-table">
  <div>ID</div>
  <div>Known hosts</div>
  ${this.vlans.map(vlan=>`<div>${vlan.id}</div><div>${Array.from(Object.keys(vlan.switchTable)).length}</div>`).join("")}
</div>
`
  }
}
class VLAN {
  constructor(elem, parent, id) {
    this.htmlElem = elem;
    this.switchTable = {};
    this.parent = parent;
    this.id = id;

    this.drawData();
  }
  getpos() {
    return {
      x: parseInt(this.htmlElem.getBoundingClientRect().x || "120"),
      cx:
        parseInt(this.htmlElem.getBoundingClientRect().x || "120") + ICON_SIZES.SWITCH[0] / 2,
      y: parseInt(this.htmlElem.getBoundingClientRect().y || "0"),
      cy: parseInt(this.htmlElem.getBoundingClientRect().y || "0") + ICON_SIZES.SWITCH[0] / 2,
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
    this.htmlElem.querySelector(".reset-button").onclick = (() => {
      this.switchTable = {};
      this.drawData();
    }).bind(this);
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
