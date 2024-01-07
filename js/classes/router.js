class Router {
  constructor(elem) {
    this.htmlElem = elem;
    this.routingTable = [];
    this.interfaces = [];

    this.dialog = this.htmlElem.querySelector("dialog");
    this.drawData();
    this.htmlElem.querySelector(".config-button").onclick = () => {
      window.dragDisabled = true;
      this.dialog.showModal();
    };
    this.htmlElem.querySelector(".close-config").onclick = () => {
      window.dragDisabled = false;
      this.dialog.close();
    };

    this.htmlElem.querySelector(".add-button").onclick = this.addIF.bind(this);
    this.htmlElem.querySelector(".add-route").onclick =
      this.addRoute.bind(this);
  }
  getpos() {
    return {
      x: parseInt(this.htmlElem.style.left || "120"),
      cx:
        parseInt(this.htmlElem.style.left || "120") + ICON_SIZES.ROUTER[0] / 2,
      y: parseInt(this.htmlElem.style.top || "0"),
      cy: parseInt(this.htmlElem.style.top || "0") + ICON_SIZES.ROUTER[0] / 2,
      width: ICON_SIZES.ROUTER[0],
      height: ICON_SIZES.ROUTER[1],
    };
  }
  addRoute() {
    this.routingTable.push({
      ip: "0.0.0.0",
      subnet: "/24",
      interface: "ETH0",
      dest: "0.0.0.0",
    });
    this.drawData();
  }
  inrect(x, y) {
    let pos = this.getpos();
    if (x < pos.x) return false;
    if (x > pos.x + pos.width) return false;
    if (y < pos.y) return false;
    if (y > pos.y + pos.height) return false;
    return true;
  }
  addIF() {
    let div = document.createElement("div");
    div.innerHTML = `
<div class="draggable tooltip-container">
   <div class="handle">
     <img src="img/routerIF.png" />
  </div>
  <div class="tooltip">
    <h2><span class="name"></span></h2>  
    <table>
      <tr>
        <th>MAC</th>
        <td class="mac">AF:43:3B:37:B1:BC</td>
      </tr>
      <tr>
        <th>IP</th>
        <td class="ip">undefined</td>
      </tr>
    </table>

    <div class="actionbar">
      <img src="img/DHCP.png" class="button config-button" title="Open interface config"/>
      <dialog>
      <form class="form config-form">
        <h2 class="head">Interface config</h2>
        IP address: <input name="ip">
        <div class="actionbar">
      Use DHCP<img src="img/DHCP.png" class="button dhcp-button" title="Use DHCP"/>
    </div>

      </form>
      <button class="close-config" autofocus>Save</button>
    </dialog>
    </div>
  </div>
</div>
`;
    dragElement(div.children[0]);
    sw = new RouterIF(div.children[0], this, `ETH${this.interfaces.length}`);
    window.devices.push(sw);
    this.interfaces.push(sw);
    this.htmlElem.appendChild(div);
    this.drawData();
  }

  drawData() {
    let ids = [];
    this.htmlElem.querySelector(".routes").innerHTML = `
<div class="table routing-table">
    <div class="rowspan-2">Route</div>
    <div>Interface</div>
    <div>Destination</div>
  ${this.routingTable
    .map((route) => {
      let n1 = "i" + randHex(50);
      let n2 = "s" + randHex(50);
      let n3 = "e" + randHex(50);
      let n4 = "q" + randHex(50);
      ids.push([n1, n2, n3, n4]);
      return `<input id=${n1} value="${route.ip}"><input id=${n2} value="${route.subnet}"><input id=${n3} value="${route.interface}"><input id=${n4} value=${route.dest}>`;
    })
    .join("")}
</div>
`;
    ids.map((tab, index) => {
      document.querySelector(`#${tab[0]}`).onchange = ((e) =>
        (this.routingTable[index].ip = e.target.value)).bind(this);
      document.querySelector(`#${tab[1]}`).onchange = ((e) =>
        (this.routingTable[index].subnet = e.target.value)).bind(this);
      document.querySelector(`#${tab[2]}`).onchange = ((e) =>
        (this.routingTable[index].interface = e.target.value)).bind(this);
      document.querySelector(`#${tab[3]}`).onchange = ((e) =>
        (this.routingTable[index].dest = e.target.value)).bind(this);
    });
    this.htmlElem.querySelector(".interfaces").innerHTML = `
<div class="table interface-table">
  <div>Name</div>
  <div>IP address</div>
  <div>MAC address</div>
  ${this.interfaces
    .map((f) => `<div>${f.name}</div><div>${f.ip}</div><div>${f.mac}</div>`)
    .join("")}
  </div>
`;
  }
  forward(packet) {
    console.log("Forwarding packet:");
    console.log(packet);
  }
}
class RouterIF {
  constructor(elem, parent, name) {
    this.htmlElem = elem;
    this.parent = parent;
    this.name = name;
    this.mac = randMAC();
    this.ip = "0.0.0.0";
    this.subnet = "/24";
    this.ARPtable = {};
    this.TXqueue = [];

    this.drawData();
    this.dialog = this.htmlElem.querySelector("dialog");
    this.htmlElem.querySelector(".config-button").onclick = () => {
      this.dialog.showModal();
    };
    this.htmlElem.querySelector(".close-config").onclick = () => {
      this.dialog.close();
    };
    this.htmlElem.querySelector(".config-form").onchange = () => {
      this.updateConfig();
    };
  }
  getpos() {
    return {
      x: parseInt(this.htmlElem.getBoundingClientRect().x || "120"),
      cx:
        parseInt(this.htmlElem.getBoundingClientRect().x || "120") +
        ICON_SIZES.ROUTERIF[0] / 2,
      y: parseInt(this.htmlElem.getBoundingClientRect().y || "0"),
      cy:
        parseInt(this.htmlElem.getBoundingClientRect().y || "0") +
        ICON_SIZES.ROUTERIF[0] / 2,
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
  drawData() {
    this.htmlElem.querySelector("[name=ip]").value = this.ip;
    this.htmlElem.querySelector(".head").innerText =
      `Interface config (${this.name})`;
    this.htmlElem.querySelector(".mac").innerText = this.mac;
    this.htmlElem.querySelector(".name").innerText = this.name;
    this.htmlElem.querySelector(".ip").innerText = this.ip + this.subnet;
    this.htmlElem.querySelector(".dhcp-button").onclick =
      this.DHCPConfig.bind(this);
  }
  updateConfig() {
    this.ip = this.htmlElem.querySelector("[name=ip]").value;
    this.drawData();
  }
  sendL3(packet) {
    const layers = [packet, ...flatten_layers(packet)];
    if (layers[0]._layer != "L3") {
      throw "Use the low-level window.sendpack instead.";
    }
    const ip = layers[0].dest;
    if (!this.ARPtable.hasOwnProperty(ip)) {
      this.discover(ip);
      this.TXqueue.push(packet);
      return;
    }
    window.links.forEach((link) => {
      if (link.start == this) {
        const dest = link.end;
        const pack = new Packet(this, dest);
        const eth = new Ether(this.mac, this.ARPtable[ip]);
        pack.payload = eth;
        eth.payload = packet;
        window.sendpack(pack);
      }
    });
  }
  discover(ip) {
    if (this.ARPtable.hasOwnProperty(ip)) return;
    window.links.forEach((link) => {
      if (link.start == this) {
        const dest = link.end;
        const pack = new Packet(this, dest);
        const eth = new Ether(this.mac, ETHER_BROADCAST);
        pack.payload = eth;
        const arp = new ARP(this.ip, ip, "REQUEST");
        eth.payload = arp;
        window.sendpack(pack);
      }
    });
  }
  onRecv(packet) {
    const layers = flatten_layers(packet);
    if (layers.map((l) => l._packtype).includes("ICMP")) {
      if ((layers[1].dest = this.ip)) {
        if (layers[2].msg == "PING") {
          const ip = new IP(this.ip, layers[1].src);
          const icmp = new ICMP("ECHO");
          ip.payload = icmp;
          this.sendL3(ip);
          return;
        }
      }
    }
    if (layers.map((l) => l._packtype).includes("ARP")) {
      if (layers[1].msg == "RESPONSE") {
        if (layers[1].dest == this.ip) {
          this.ARPtable[layers[1].src] = layers[0].src;
          let q = [...this.TXqueue];
          this.TXqueue = [];
          q.forEach((packet) => this.sendL3(packet));
        }
      }
      if (layers[1].msg == "REQUEST") {
        if (layers[1].dest == this.ip) {
          this.ARPtable[layers[1].src] = layers[0].src;
          window.links.forEach((link) => {
            if (link.start == this) {
              const dest = link.end;
              const pack = new Packet(this, dest);
              const eth = new Ether(this.mac, layers[0].src);
              pack.payload = eth;
              const arp = new ARP(this.ip, layers[1].src, "RESPONSE");
              eth.payload = arp;
              window.sendpack(pack);
            }
          });
        }
      }
      return;
    }
    if (layers.map((l) => l._packtype).includes("DHCPD")) {
      if (layers[2].msg == "ACK") {
        this.ip = layers[1].dest;
        this.subnet = layers[2].config.subnet;
        this.drawData();
      }
      if (layers[2].msg == "OFFER") {
        const mac = layers[0].src;
        window.links.forEach((link) => {
          if (link.start == this) {
            const dest = link.end;
            const pack = new Packet(this, dest);
            const eth = new Ether(this.mac, mac);
            pack.payload = eth;
            const ip = new IP(layers[1].dest, layers[1].src);
            eth.payload = ip;
            const dhcpd = new DHCPD("REQUEST");
            ip.payload = dhcpd;
            window.sendpack(pack);
          }
        });
      }
      return;
    }
    // the packet is not ARP, not DHCP and not ping to us.
    // give it to the parent router to forward

    this.parent.forward(packet);
  }
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
