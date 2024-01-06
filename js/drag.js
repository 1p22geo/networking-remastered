document.addEventListener("contextmenu", (event) => event.preventDefault());
document.querySelectorAll(".draggable").forEach((elem) => {
  dragElement(elem);
});

let linkstartx = 0;
let linkstarty = 0;
let linkendx = 0;
let linkendy = 0;

function drawLink(ctx, startx, starty, endx, endy) {
  ctx.beginPath();
  ctx.moveTo(startx - 120, starty);
  ctx.lineTo(endx - 120, endy);
  ctx.stroke();
}

function renderCanvas() {
  const canvas = document.getElementById("maincanvas");
  if (canvas.getContext) {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);
    drawLink(ctx, linkstartx, linkstarty, linkendx, linkendy);
    window.links.forEach((link) => {
      drawLink(
        ctx,
        link.start.getpos().cx,
        link.start.getpos().cy,
        link.end.getpos().cx,
        link.end.getpos().cy,
      );
    });
  }
}

window.addEventListener("resize", renderCanvas);
window.addEventListener("scroll", renderCanvas);
function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  Array.from(elmnt.children).forEach((child) => {
    if (child.classList.contains("handle")) {
      child.onmousedown = dragMouseDown;
    }
  });

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    if (window.action == "cursor") {
      pos3 = e.clientX;
      pos4 = e.clientY;
    }
    if (window.action == "connect") {
      linkstartx =
        parseInt(e.target.parentElement.parentElement.style.left || "120") + 25;
      linkstarty =
        parseInt(e.target.parentElement.parentElement.style.top || "0") + 25;
    }
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    if (window.action == "cursor") {
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }
    if (window.action == "connect") {
      linkendx = e.clientX;
      linkendy = e.clientY;
    }
    renderCanvas();
  }

  function closeDragElement() {
    let me;
    let end;
    window.devices.forEach((dev) => {
      if (dev.inrect(linkstartx, linkstarty)) {
        me = dev;
      }
    });
    if (me) {
      window.devices.forEach((dev) => {
        if (dev.inrect(linkendx, linkendy)) {
          end = dev;
        }
      });
    }
    if (end) {
      if (me) {
        let add = true;

        window.links.forEach((l) => {
          if (l.start == me && l.end == end) add = false;
          if (l.start == end && l.end == me) add = false;
        });
        if (add) window.links.push({ start: me, end: end });
        if (add) window.links.push({ start: end, end: me });
      }
    }
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    linkstartx = 0;
    linkstarty = 0;
    linkendx = 0;
    linkendy = 0;
    renderCanvas();
  }
}
