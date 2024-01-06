class Host {
  constructor(elem) {
    this.htmlElem = elem;
    this.links = [];
  }
  getpos() {
    return {
      x: parseInt(this.htmlElem.style.left || "120"),
      cx: parseInt(this.htmlElem.style.left || "120") + 25,
      y: parseInt(this.htmlElem.style.top || "0"),
      cy: parseInt(this.htmlElem.style.top || "0") + 25,
      width: 50,
      height: 50,
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
}
