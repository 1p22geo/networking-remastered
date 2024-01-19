class OSKernel {
  constructor(hw) {
    this.hw = hw;
    this.processes = [];
    this.fs = createFS.bind(this)();
  }
  run(proc, argv) {
    const p = new Process(proc, argv);
    this.processes.push(p);
    return p;
  }
  sh(cmd) {
    if (!this.fs[cmd[0]] || this.fs[cmd[0]].type != "exec") {
      throw "No such executable file";
    }
    return this.run(this.fs[cmd[0]].content, cmd);
  }
}
