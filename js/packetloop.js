window.sendpack = (packet) => {
  const div = document.createElement("div");
  div.innerHTML = `
<div class="packet tooltip-container">
  <img src="img/packet.png" />
  <pre class="tooltip">
  </pre>
</div>
`;
  document.querySelector("#canvas").appendChild(div);
  packet.htmlElem = div.children[0];
  packet.onHTML();
  window.packets.push(packet);
};

window.packets = [];
window.pause = false;
document.body.onkeydown = (e) => {
  if (e.keyCode == 32) window.pause = true;
};
document.body.onkeyup = (e) => {
  if (e.keyCode == 32) window.pause = false;
};
setInterval(() => {
  window.packets.forEach((packet) => {
    if (!window.pause) packet.propagate();
  });
}, 50);
