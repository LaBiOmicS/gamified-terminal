import { Command } from './types';

export const basicCommands: Command[] = [
  {
    name: 'pwd',
    description: 'Print working directory',
    execute: async (ctx) => {
      ctx.print(ctx.vfs.getCwd());
    }
  },
  {
    name: 'ls',
    description: 'List directory contents',
    execute: async (ctx) => {
      const path = ctx.args[0] || ctx.vfs.getCwd();
      const children = ctx.vfs.listDirectory(path);
      if (children) {
        ctx.print(children.join('  '));
      } else {
        ctx.printError(`ls: cannot access '${path}': No such file or directory`);
      }
    }
  },
  {
    name: 'cd',
    description: 'Change directory',
    execute: async (ctx) => {
      const path = ctx.args[0] || '/home/student';
      if (!ctx.vfs.setCwd(path)) {
        ctx.printError(`cd: ${path}: No such directory`);
      }
    }
  },
  {
    name: 'cat',
    description: 'Concatenate and print files',
    execute: async (ctx) => {
      if (ctx.args.length === 0) {
        ctx.printError('cat: missing file operand');
        return;
      }
      for (const path of ctx.args) {
        const content = ctx.vfs.readFile(path);
        if (content !== null) {
          ctx.print(content);
        } else {
          ctx.printError(`cat: ${path}: No such file or directory`);
        }
      }
    }
  },
  {
    name: 'mkdir',
    description: 'Make directories',
    execute: async (ctx) => {
      if (ctx.args.length === 0) {
        ctx.printError('mkdir: missing operand');
        return;
      }
      for (const path of ctx.args) {
        if (!ctx.vfs.mkdir(path)) {
          ctx.printError(`mkdir: cannot create directory '${path}': File exists or parent directory missing`);
        }
      }
    }
  },
  {
    name: 'rm',
    description: 'Remove files or directories',
    execute: async (ctx) => {
      let recursive = false;
      const paths: string[] = [];

      for (const arg of ctx.args) {
        if (arg === '-r' || arg === '-rf') {
          recursive = true;
        } else {
          paths.push(arg);
        }
      }

      if (paths.length === 0) {
        ctx.printError('rm: missing operand');
        return;
      }

      for (const path of paths) {
        if (!ctx.vfs.rm(path, recursive)) {
          ctx.printError(`rm: cannot remove '${path}': No such file or directory or directory not empty`);
        }
      }
    }
  },
  {
    name: 'echo',
    description: 'Display a line of text',
    execute: async (ctx) => {
      // Basic redirection support
      const redirectIndex = ctx.args.indexOf('>');
      const appendIndex = ctx.args.indexOf('>>');
      
      if (redirectIndex !== -1 || appendIndex !== -1) {
        const isAppend = appendIndex !== -1;
        const index = isAppend ? appendIndex : redirectIndex;
        const content = ctx.args.slice(0, index).join(' ');
        const target = ctx.args[index + 1];
        
        if (!target) {
          ctx.printError('bash: syntax error near unexpected token `newline\'');
          return;
        }
        
        if (!ctx.vfs.writeFile(target, content, isAppend)) {
          ctx.printError(`bash: ${target}: No such file or directory`);
        }
      } else {
        ctx.print(ctx.args.join(' '));
      }
    }
  },
  {
    name: 'clear',
    description: 'Clear the terminal screen',
    execute: async (ctx) => {
      ctx.clear();
    }
  },
  {
    name: 'whoami',
    description: 'Print effective userid',
    execute: async (ctx) => {
      ctx.print('student');
    }
  },
  {
    name: 'date',
    description: 'Print or set the system date and time',
    execute: async (ctx) => {
      ctx.print(new Date().toString());
    }
  },
  {
    name: 'cp',
    description: 'Copy files and directories',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('cp: missing file operand');
        return;
      }
      const source = ctx.args[0];
      const dest = ctx.args[1];
      const content = ctx.vfs.readFile(source);
      if (content !== null) {
        if (!ctx.vfs.writeFile(dest, content)) {
          ctx.printError(`cp: cannot create regular file '${dest}': No such file or directory`);
        }
      } else {
        ctx.printError(`cp: cannot stat '${source}': No such file or directory`);
      }
    }
  },
  {
    name: 'mv',
    description: 'Move (rename) files',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('mv: missing file operand');
        return;
      }
      const source = ctx.args[0];
      const dest = ctx.args[1];
      const content = ctx.vfs.readFile(source);
      if (content !== null) {
        if (ctx.vfs.writeFile(dest, content)) {
          ctx.vfs.rm(source);
        } else {
          ctx.printError(`mv: cannot move '${source}' to '${dest}': No such file or directory`);
        }
      } else {
        ctx.printError(`mv: cannot stat '${source}': No such file or directory`);
      }
    }
  }
];
