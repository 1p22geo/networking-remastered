window.devices = [];
window.links = [];

function addHost() {
  let div = document.createElement("div");
  div.innerHTML = `
<div class="draggable">
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
