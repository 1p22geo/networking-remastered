class OSKernel {
  constructor(hw) {
    this.hw = hw;
    this.processes = [];
    this.fs = createFS.bind(this)();
  }
  run(proc, argv, hooks = []) {
    const p = new Process(proc, argv, hooks);
    this.processes.push(p);
    return p;
  }
  sh(cmd, hooks = []) {
    if (!this.fs[cmd[0]] || this.fs[cmd[0]].type != "exec") {
      throw `No such command or executable: ${cmd[0]}`;
    }
    return this.run(this.fs[cmd[0]].content, cmd, hooks);
  }
}
