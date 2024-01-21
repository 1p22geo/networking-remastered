class Process {
  constructor(proc, argv, hooks = []) {
    this.stdout = "";
    this.stdoutHooks = [];
    hooks.forEach((hook) => {
      if (!KERN_LATE_HOOKS.includes(hook[0])) this.hook(...hook);
    });
    this.handle = {
      printf: ((msg) => {
        this.stdout += msg;
        for (let ix = 0; ix < this.stdoutHooks.length; ix++) {
          const hook = this.stdoutHooks[ix];
          hook(msg, this.stdout);
        }
      }).bind(this),
    };
    this.argv = argv;
    this._proc = proc(this.handle, this.argv);
    hooks.forEach((hook) => {
      if (KERN_LATE_HOOKS.includes(hook[0])) this.hook(...hook);
    });
  }
  async join() {
    return await this._proc;
  }
  hook(type, f) {
    switch (type) {
      case "stdout": {
        this.stdoutHooks.push(f);
        break;
      }
      case "join": {
        this._proc.then((res) => {
          f({
            exitcode: res,
            stdout: this.stdout,
          });
        });
        break;
      }
    }
  }
}
