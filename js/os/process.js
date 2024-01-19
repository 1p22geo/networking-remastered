class Process {
  constructor(proc, argv) {
    this.stdout = "";
    this.handle = {
      printf: ((msg) => {
        this.stdout += msg;
      }).bind(this),
    };
    this.argv = argv;
    this._proc = proc(this.handle, this.argv);
  }
  async join() {
    return await this._proc;
  }
  hook(f) {
    this._proc.then((res) => {
      f({
        exitcode: res,
        stdout: this.stdout,
      });
    });
  }
}
