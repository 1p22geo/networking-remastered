class Ether {
  constructor(src, dest) {
    this.src = src;
    this.dest = dest;
    this._layer = "L2";
    this._packtype = "Ether";
  }
  render() {
    return prep(`Ethernet ->
  source MAC:&nbsp;${this.src}
  dest MAC:&nbsp;&nbsp;&nbsp;${this.dest}`);
  }
}
class IP {
  constructor(src, dest) {
    this.src = src;
    this.dest = dest;
    this._layer = "L3";
    this._packtype = "IP";
  }
  render() {
    return prep(`IP ->
  source address:&nbsp;${this.src}
  dest address:&nbsp;&nbsp;&nbsp;${this.dest}`);
  }
}
class DHCPD {
  // I know there's technically UDP and BOOTP and all that other stuff. This is a MAJOR simplification. It's just here to simplify the code and remove boilerplate.
  //
  // Allowed DHCP messages:
  //     DISCOVER - initial client message
  //     OFFER - initial server offer
  //     REQUEST - client requesting offered IP address
  //     ACK - server acknowledging IP address assignment
  //     NAK - server disallowing (not acknowledging) IP assignment
  constructor(msg) {
    this.msg = msg;
    this._layer = "L5"; // DHCP is application layer, so it's layer 5 in TCP/IP
    this._packtype = "DHCPD";
  }
  render() {
    return prep(`DHCP&nbsp;${this.msg}`);
  }
}

var flatten_layers = (packet) => {
  // Flattens a packet with its packet-payload structure (each layer holds the next one as a payload) into an array of layer-specific objects
  let layers = [];
  let payload = payload.payload;
  while (true) {
    if (!payload) break;
    layers.push(payload);
    payload = payload.payload;
  }
  return layers;
};
