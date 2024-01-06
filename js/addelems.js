window.devices = [];
window.links = []

function addHost() {
  let div = document.createElement("div");
  div.innerHTML = `
<div class="draggable">
   <div class="handle">
     <img src="img/host.png" />
  </div>
</div>
`;
  dragElement(div.children[0]);
  host = new Host(div.children[0]);
  window.devices.push(host);
  document.querySelector("#canvas").appendChild(div);
}
