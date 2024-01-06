class Packet{
  constructor(src, dest){
    this.src = src
    this.dest = dest
    this.htmlElem = undefined;
    this.payload;
    this.x = src.getpos().cx
    this.y = src.getpos().cy
    this.width = 40
    this.height = 30
    this.speed = 2
  }

  onHTML(){
      this.htmlElem.style.left = this.x + "px"
      this.htmlElem.style.top = this.y + "px"
  }

  propagate(){
    let dx = this.dest.getpos().cx - this.x
    let dy = this.dest.getpos().cy - this.y

    let d = Math.sqrt(dx**2 + dy**2)
    dx = dx/d
    dy = dy/d

    this.x += dx * this.speed
    this.y += dy * this.speed

    if(Math.abs(this.dest.getpos().cx - this.x) <10){
      this.htmlElem.remove()
      this.htmlElem = undefined
      const index = window.packets.indexOf(this);
      if (index > -1) {
        window.packets.splice(index, 1); 
      }
      delete this
    }

    if(this.htmlElem){
      this.htmlElem.style.left = this.x - 0.5*this.width + "px"
      this.htmlElem.style.top = this.y - 0.5*this.height + "px"
    }
  }
}
