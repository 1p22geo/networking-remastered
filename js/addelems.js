window.devices = [];
window.links = [];

function addHost() {
  let div = document.createElement("div");
  div.innerHTML = `
<div class="draggable tooltip-container">
   <div class="handle">
     <img src="img/host.png" />
  </div>
  <div class="tooltip">
    Host
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
      <img src="img/DHCP.png" class="button dhcp-button"/>
    </div>
  </div>
</div>
`;
  dragElement(div.children[0]);
  host = new Host(div.children[0]);
  window.devices.push(host);
  document.querySelector("#canvas").appendChild(div);
}

function addSwitch() {
  let div = document.createElement("div");
  div.innerHTML = `
<div class="draggable tooltip-container">
   <div class="handle">
     <img src="img/switch.png" />
  </div>
  <div class="tooltip">
    Switch
    <div class="actionbar">
      <img src="img/DHCP.png" class="button reset-button"/>
    </div>
  </div>
</div>
`;
  dragElement(div.children[0]);
  sw = new Switch(div.children[0]);
  window.devices.push(sw);
  document.querySelector("#canvas").appendChild(div);
}

function addDHCP() {
  let div = document.createElement("div");
  div.innerHTML = `
<div class="draggable tooltip-container">
   <div class="handle">
     <img src="img/DHCPserver.png" />
  </div>
  <div class="tooltip">
    DHCP server
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
      <img src="img/DHCP.png" class="button dhcp-button"/>
    </div>
    <dialog>
      <form class="form-dhcp">
        <h2>DHCP server config</h2>
        IP address: <input name="ip">
        Subnet mask: <select name="subnet"><option value="/24">/24 (class C) &lt;-- recommended</option><option value="/16">/16 (class B)</option><option value="/8">/8 (class A)</option></select>
      </form>
      <button class="close-dhcp" autofocus>Save</button>
    </dialog>
  </div>
</div>
`;
  dragElement(div.children[0]);
  host = new DHCPserver(div.children[0]);
  window.devices.push(host);
  document.querySelector("#canvas").appendChild(div);
}
