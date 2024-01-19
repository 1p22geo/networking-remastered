class Host {
  constructor(elem) {
    this.os = null;
    this.htmlElem = elem;
    this.mac = randMAC();
    this.ip = "0.0.0.0";
    this.subnet = "/24";
    this.gateway = "0.0.0.0";
    this.ARPtable = {};
    this.TXqueue = [];
    this.drawData();
    this.dialog = this.htmlElem.querySelector(".host-config");
    this.term = this.htmlElem.querySelector(".host-terminal");
    this.htmlElem.querySelector(".term-form").onsubmit = (e) => {
      e.preventDefault();
      let prompt = document.createElement("pre");
      prompt.innerText = "# " + this.term.querySelector("input").value;
      this.term.querySelector(".terminal-window").appendChild(prompt);

      try {
        let c = this.os.sh(this.term.querySelector("input").value.split(" "));
        c.hook((res) => {
          let line = document.createElement("pre");
          line.innerText = res.stdout;
          this.term.querySelector(".terminal-window").appendChild(line);
        });
      } catch {
        let line = document.createElement("pre");
        line.innerText = `unknown command or executable: ${this.term.querySelector("input").value.split(" ")[0]}`;
        this.term.querySelector(".terminal-window").appendChild(line);
      }
      this.term.querySelector("input").value = "";
    };
    this.htmlElem.querySelector(".terminal-button").onclick = () => {
      this.term.showModal();
    };
    this.htmlElem.querySelector(".close-term").onclick = () => {
      this.term.close();
    };

    this.htmlElem.querySelector(".config-button").onclick = () => {
      this.dialog.showModal();
    };
    this.htmlElem.querySelector(".close-config").onclick = () => {
      this.dialog.close();
    };
    this.htmlElem.querySelector(".host-form").onchange = () => {
      this.updateConfig();
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
  sendL3(packet) {
    const layers = [packet, ...flatten_layers(packet)];
    if (layers[0]._layer != "L3") {
      throw "Use the low-level window.sendpack instead.";
    }
    const ip = layers[0].dest;
    let dest_ip;
    const block_ip = layers[0].dest.split(".").map((e) => parseInt(e));
    const host_ip = this.ip.split(".").map((e) => parseInt(e));
    switch (this.subnet) {
      case "/24": {
        if (
          block_ip[0] == host_ip[0] &&
          block_ip[1] == host_ip[1] &&
          block_ip[2] == host_ip[2]
        ) {
          dest_ip = ip;
        } else {
          dest_ip = this.gateway;
        }
      }
    }
    if (!this.ARPtable.hasOwnProperty(dest_ip)) {
      this.discover(dest_ip);
      this.TXqueue.push(packet);
      return;
    }
    window.links.forEach((link) => {
      if (link.start == this) {
        const dest = link.end;
        const pack = new Packet(this, dest);
        const eth = new Ether(this.mac, this.ARPtable[dest_ip]);
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
  pingGW() {
    const ip = new IP(this.ip, prompt("What IP to ping?", this.gateway));
    const icmp = new ICMP("PING");
    ip.payload = icmp;
    this.sendL3(ip);
  }
  drawData() {
    this.htmlElem.querySelector("[name=gw]").value = this.gateway;
    this.htmlElem.querySelector("[name=ip]").value = this.ip;
    this.htmlElem.querySelector(".mac").innerText = this.mac;
    this.htmlElem.querySelector(".gw").innerText = this.gateway;
    this.htmlElem.querySelector(".ip").innerText = this.ip + this.subnet;
    this.htmlElem.querySelector(".dhcp-button").onclick =
      this.DHCPConfig.bind(this);
    this.htmlElem.querySelector(".ping-button").onclick =
      this.pingGW.bind(this);
  }
  updateConfig() {
    this.gateway = this.htmlElem.querySelector("[name=gw]").value;
    this.ip = this.htmlElem.querySelector("[name=ip]").value;
    this.drawData();
  }
  onRecv(packet) {
    const layers = flatten_layers(packet);
    if (layers.map((l) => l._packtype).includes("ICMP")) {
      if (layers[1].dest == this.ip) {
        if (layers[2].msg == "PING") {
          const ip = new IP(this.ip, layers[1].src);
          const icmp = new ICMP("ECHO");
          ip.payload = icmp;
          this.sendL3(ip);
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
    }
    if (layers.map((l) => l._packtype).includes("DHCPD")) {
      if (layers[2].msg == "ACK") {
        this.ip = layers[1].dest;
        this.gateway = layers[2].config.gateway;
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
    }
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
