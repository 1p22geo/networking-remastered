function createFS() {
  return {
    echo: {
      type: "exec",
      content: async (handle, argv) => {
        handle.printf(argv[1]);
        return 0;
      },
    },
    help: {
      type: "exec",
      content: async (handle, argv) => {
        switch (argv[1]) {
          case "ls":
            handle.printf(
              "ls - lists the files.\n\tls -l shows more info.\n\tThe emulated filesystem currently does not support directories. Sorry.",
            );
            break;
          case "cat":
            handle.printf(
              "cat - reads a file.\n\tcat note - reads the file named 'note'",
            );
            break;
          case "echo":
            handle.printf(
              "echo - literally gives back the first argument provided.\n\techo asdf - returns asdf",
            );
            break;
          case "writeline":
            handle.printf(
              'writeline - writes a single line to a file.\n\twriteline note hello world - will save "hello world" in file "note"',
            );
            break;
          case "touch":
            handle.printf(
              "touch - creates a filen\n\ttouch file2 - will create a file named file2",
            );
            break;
          case "rm":
            handle.printf(
              "rm - removes a file\n\trm file2 - will remove the file named file2\n\tplease don't remove the built-in executables.",
            );
            break;

          default:
            handle.printf(`
Nothing OS 1 - literally eight executables and a text file.

  This is a very simple simulated OS, remotely resembling Linux.
  Does not support directories, standard input, or anything you're used to.
  
  But hey - JavaScript.
`);
            break;
        }
      },
    },
    ls: {
      type: "exec",
      content: async (handle, argv) => {
        let files = Object.keys(this.fs);
        for (let ix = 0; ix < files.length; ix++) {
          const file = files[ix];
          if (argv[1] == "-l") {
            switch (this.fs[file].type) {
              case "exec":
                handle.printf("x ");
                break;
              case "text":
                handle.printf("- ");
                break;
            }
            handle.printf(file + "\n");
          } else {
            handle.printf(file + " ");
          }
        }
        return 0;
      },
    },
    cat: {
      type: "exec",
      content: async (handle, argv) => {
        let file = argv[1];
        if (!this.fs[file]) {
          handle.printf("No such file or directory");
          return 1;
        }

        handle.printf(this.fs[file].content);
        return 0;
      },
    },
    touch: {
      type: "exec",
      content: async (handle, argv) => {
        if (!argv[1]) {
          handle.printf("No filename provided");
          return 1;
        }
        if (this.fs[argv[1]]) {
          handle.printf(
            "File already exists. This filesystem doesn't feature modification dates yet.",
          );
          return 0;
        }
        this.fs[argv[1]] = { type: "text", content: "" };
        return 0;
      },
    },
    writeline: {
      type: "exec",
      content: async (handle, argv) => {
        if (!argv[1]) {
          handle.printf("No filename provided");
          return 1;
        }
        if (!this.fs[argv[1]]) {
          handle.printf(`creating ${argv[1]}`);
          this.fs[argv[1]] = { type: "text", content: "" };
        }
        this.fs[argv[1]].content += argv.slice(2).join(" ") + "\n";
        return 0;
      },
    },
    rm: {
      type: "exec",
      content: async (handle, argv) => {
        if (!argv[1]) {
          handle.printf("No filename provided");
          return 1;
        }
        if (this.fs[argv[1]]) {
          delete this.fs[argv[1]];
        }
      },
    },
    note: {
      type: "text",
      content: "Hello world!\nI am a file in an emulated computer!\n",
    },
  };
}
