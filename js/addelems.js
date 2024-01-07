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
      <tr>
        <th>Gateway</th>
        <td class="gw">undefined</td>
      </tr>
    </table>
    <div class="actionbar">
      <dialog class="host-config">
        <form class="host-form form">
          <h2>Host config</h2>
          
        IP address: <input name="ip">
        Gateway: <input name="gw">
            <div class="actionbar">
            DHCP autoconfig
      <img src="img/DHCP.png" class="button dhcp-button" title="Use DHCP to automagically configure host"/>
            </div>
          <div class="actionbar">
            Ping gateway
      <img src="img/DHCP.png" class="button ping-button" title="Send ICMP PING to the configured gateway address"/>
            </div>

          </form>
          <button class="close-config" autofocus>Save</button>
        </dialog>
      <img src="img/DHCP.png" class="button config-button" title="Configure host"/>
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
    <h2>Switch</h2>
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
        <td class="mac">undefined</td>
      </tr>
      <tr>
        <th>IP</th>
        <td class="ip">undefined</td>
      </tr>
      <tr>
        <th>Gateway</th>
        <td class="gw">undefined</td>
      </tr>

    </table>
    <div class="actionbar">
      <img src="img/DHCP.png" class="button dhcp-button"/>
    </div>
    <dialog>
      <form class="form form-dhcp">
        <h2>DHCP server config</h2>
        IP address: <input name="ip">
        Gateway: <input name="gw">
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
