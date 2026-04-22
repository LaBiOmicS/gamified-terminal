import type { Command } from './types';

export const focaCommands: Command[] = [
  {
    name: 'man',
    description: 'An interface to the system reference manuals',
    execute: async (ctx) => {
      const page = ctx.args[0];
      if (!page) {
        ctx.print('What manual page do you want?');
        return;
      }
      
      const manuals: Record<string, string> = {
        ls: 'LS(1) - list directory contents\n\nSYNOPSIS: ls [FILE]...\nDESCRIPTION: List information about the FILEs (the current directory by default).',
        cd: 'CD(1) - change the working directory\n\nSYNOPSIS: cd [DIR]\nDESCRIPTION: Change the current directory to DIR.',
        cat: 'CAT(1) - concatenate files and print on the standard output\n\nSYNOPSIS: cat [FILE]...\nDESCRIPTION: Concatenate FILE(s) to standard output.',
        pwd: 'PWD(1) - print name of current/working directory\n\nSYNOPSIS: pwd\nDESCRIPTION: Print the full filename of the current working directory.',
        mkdir: 'MKDIR(1) - make directories\n\nSYNOPSIS: mkdir DIRECTORY...\nDESCRIPTION: Create the DIRECTORY(ies), if they do not already exist.',
        rm: 'RM(1) - remove files or directories\n\nSYNOPSIS: rm [OPTION]... [FILE]...\nDESCRIPTION: rm removes each specified file.',
        grep: 'GREP(1) - print lines that match patterns\n\nSYNOPSIS: grep PATTERN [FILE]...\nDESCRIPTION: grep searches for PATTERN in each FILE.',
      };

      if (manuals[page]) {
        ctx.print(manuals[page]);
      } else {
        ctx.print(`No manual entry for ${page}`);
      }
    }
  },
  {
    name: 'grep',
    description: 'Print lines that match patterns',
    execute: async (ctx) => {
      if (ctx.args.length < 1) {
        ctx.printError('Usage: grep PATTERN [FILE]...');
        return;
      }
      const pattern = ctx.args[0];
      const files = ctx.args.slice(1);
      
      if (files.length === 0) {
        ctx.printError('grep: missing file operand');
        return;
      }

      for (const path of files) {
        const content = ctx.vfs.readFile(path);
        if (content !== null) {
          const lines = content.split('\n');
          const matches = lines.filter(line => line.includes(pattern));
          if (matches.length > 0) {
            ctx.print(matches.join('\n'));
          }
        } else {
          ctx.printError(`grep: ${path}: No such file or directory`);
        }
      }
    }
  },
  {
    name: 'wc',
    description: 'Print newline, word, and byte counts for each file',
    execute: async (ctx) => {
      if (ctx.args.length === 0) {
        ctx.printError('wc: missing file operand');
        return;
      }
      for (const path of ctx.args) {
        const content = ctx.vfs.readFile(path);
        if (content !== null) {
          const lines = content.split('\n').length;
          const words = content.trim().split(/\s+/).filter(Boolean).length;
          const bytes = content.length;
          ctx.print(`${lines} ${words} ${bytes} ${path}`);
        } else {
          ctx.printError(`wc: ${path}: No such file or directory`);
        }
      }
    }
  },
  {
    name: 'head',
    description: 'Output the first part of files',
    execute: async (ctx) => {
      const n = 10; // Default
      const path = ctx.args[0];
      if (!path) return;
      
      const content = ctx.vfs.readFile(path);
      if (content !== null) {
        ctx.print(content.split('\n').slice(0, n).join('\n'));
      } else {
        ctx.printError(`head: ${path}: No such file or directory`);
      }
    }
  },
  {
    name: 'tail',
    description: 'Output the last part of files',
    execute: async (ctx) => {
      const n = 10; // Default
      const path = ctx.args[0];
      if (!path) return;
      
      const content = ctx.vfs.readFile(path);
      if (content !== null) {
        const lines = content.split('\n');
        ctx.print(lines.slice(Math.max(0, lines.length - n)).join('\n'));
      } else {
        ctx.printError(`tail: ${path}: No such file or directory`);
      }
    }
  },
  {
    name: 'ps',
    description: 'Report a snapshot of the current processes',
    execute: async (ctx) => {
      ctx.print('  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 5678 pts/0    00:00:00 ps');
    }
  },
  {
    name: 'top',
    description: 'Display Linux processes',
    execute: async (ctx) => {
      ctx.print('top - 12:34:56 up 1 day, 2:30,  1 user,  load average: 0.00, 0.01, 0.05\nTasks: 1 total, 1 running, 0 sleeping, 0 stopped, 0 zombie\n%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni, 100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st\nMiB Mem :   8192.0 total,   4096.0 free,   2048.0 used,   2048.0 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 5678 dayhoff   20   0   12345   6789   1234 R   0.0   0.1   0:00.01 top');
    }
  },
  {
    name: 'free',
    description: 'Display amount of free and used memory in the system',
    execute: async (ctx) => {
      ctx.print('              total        used        free      shared  buff/cache   available\nMem:        8192000     2048000     4096000      102400     2048000     6144000\nSwap:       2048000           0     2048000');
    }
  },
  {
    name: 'uptime',
    description: 'Tell how long the system has been running',
    execute: async (ctx) => {
      ctx.print(' 12:34:56 up 1 day, 2:30,  1 user,  load average: 0.00, 0.01, 0.05');
    }
  },
  {
    name: 'chmod',
    description: 'Change file mode bits',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('chmod: missing operand');
        return;
      }
      const mode = ctx.args[0];
      const path = ctx.args[1];
      if (!ctx.vfs.chmod(path, mode)) {
        ctx.printError(`chmod: cannot access '${path}': No such file or directory`);
      }
    }
  },
  {
    name: 'chown',
    description: 'Change file owner and group',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('chown: missing operand');
        return;
      }
      const owner = ctx.args[0];
      const path = ctx.args[1];
      if (!ctx.vfs.chown(path, owner)) {
        ctx.printError(`chown: cannot access '${path}': No such file or directory`);
      }
    }
  }
];
