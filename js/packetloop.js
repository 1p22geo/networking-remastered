window.sendpack = (packet)=>{
  
  const div = document.createElement("div")
  div.innerHTML = `
<div class="packet">
  <img src="img/packet.png" />
</div>
`
  document.querySelector("#canvas").appendChild(div);
  packet.htmlElem = div.children[0]
  packet.onHTML();
  window.packets.push(packet)
}

window.packets = []


setInterval(() => {
  window.packets.forEach(packet => {
    packet.propagate()
  });
}, 50);
