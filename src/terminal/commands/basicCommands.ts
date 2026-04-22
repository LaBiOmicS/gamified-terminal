import type { Command } from './types';

export const basicCommands: Command[] = [
  {
    name: 'pwd',
    description: 'Imprime o nome do diretório atual',
    execute: async (ctx) => {
      ctx.print(ctx.vfs.getCwd());
    }
  },
  {
    name: 'ls',
    description: 'Lista o conteúdo do diretório',
    execute: async (ctx) => {
      const path = ctx.args[0] || ctx.vfs.getCwd();
      const children = ctx.vfs.listDirectory(path);
      if (children) {
        ctx.print(children.join('  '));
      } else {
        ctx.printError(`ls: não foi possível acessar '${path}': Arquivo ou diretório não encontrado`);
      }
    }
  },
  {
    name: 'cd',
    description: 'Muda o diretório de trabalho',
    execute: async (ctx) => {
      const path = ctx.args[0] || '/home/dayhoff';
      if (!ctx.vfs.setCwd(path)) {
        ctx.printError(`cd: ${path}: Arquivo ou diretório não encontrado`);
      }
    }
  },
  {
    name: 'cat',
    description: 'Concatena arquivos e imprime na saída padrão',
    execute: async (ctx) => {
      if (ctx.args.length === 0) {
        ctx.printError('cat: operando de arquivo ausente');
        return;
      }
      for (const path of ctx.args) {
        const content = ctx.vfs.readFile(path);
        if (content !== null) {
          ctx.print(content);
        } else {
          ctx.printError(`cat: ${path}: Arquivo ou diretório não encontrado`);
        }
      }
    }
  },
  {
    name: 'mkdir',
    description: 'Cria diretórios',
    execute: async (ctx) => {
      if (ctx.args.length === 0) {
        ctx.printError('mkdir: operando ausente');
        return;
      }
      for (const path of ctx.args) {
        if (!ctx.vfs.mkdir(path)) {
          ctx.printError(`mkdir: não foi possível criar o diretório '${path}': O arquivo já existe ou o diretório pai não existe`);
        }
      }
    }
  },
  {
    name: 'rm',
    description: 'Remove arquivos ou diretórios',
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
        ctx.printError('rm: operando ausente');
        return;
      }

      for (const path of paths) {
        if (!ctx.vfs.rm(path, recursive)) {
          ctx.printError(`rm: não foi possível remover '${path}': Arquivo ou diretório não encontrado ou diretório não vazio`);
        }
      }
    }
  },
  {
    name: 'echo',
    description: 'Exibe uma linha de texto',
    execute: async (ctx) => {
      const redirectIndex = ctx.args.indexOf('>');
      const appendIndex = ctx.args.indexOf('>>');
      
      if (redirectIndex !== -1 || appendIndex !== -1) {
        const isAppend = appendIndex !== -1;
        const index = isAppend ? appendIndex : redirectIndex;
        const content = ctx.args.slice(0, index).join(' ');
        const target = ctx.args[index + 1];
        
        if (!target) {
          ctx.printError('zsh: erro de sintaxe próximo ao token inesperado `newline\'');
          return;
        }
        
        if (!ctx.vfs.writeFile(target, content, isAppend)) {
          ctx.printError(`zsh: ${target}: Arquivo ou diretório não encontrado`);
        }
      } else {
        ctx.print(ctx.args.join(' '));
      }
    }
  },
  {
    name: 'clear',
    description: 'Limpa a tela do terminal',
    execute: async (ctx) => {
      ctx.clear();
    }
  },
  {
    name: 'whoami',
    description: 'Imprime o nome do usuário atual',
    execute: async (ctx) => {
      ctx.print('dayhoff');
    }
  },
  {
    name: 'date',
    description: 'Exibe a data e hora do sistema',
    execute: async (ctx) => {
      ctx.print(new Date().toLocaleString('pt-BR'));
    }
  },
  {
    name: 'cp',
    description: 'Copia arquivos e diretórios',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('cp: operando de arquivo ausente');
        return;
      }
      const source = ctx.args[0];
      const dest = ctx.args[1];
      const content = ctx.vfs.readFile(source);
      if (content !== null) {
        if (!ctx.vfs.writeFile(dest, content)) {
          ctx.printError(`cp: não foi possível criar o arquivo '${dest}': Arquivo ou diretório não encontrado`);
        }
      } else {
        ctx.printError(`cp: não foi possível obter estado de '${source}': Arquivo ou diretório não encontrado`);
      }
    }
  },
  {
    name: 'mv',
    description: 'Move (renomeia) arquivos',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('mv: operando de arquivo ausente');
        return;
      }
      const source = ctx.args[0];
      const dest = ctx.args[1];
      const content = ctx.vfs.readFile(source);
      if (content !== null) {
        if (ctx.vfs.writeFile(dest, content)) {
          ctx.vfs.rm(source);
        } else {
          ctx.printError(`mv: não foi possível mover '${source}' para '${dest}': Arquivo ou diretório não encontrado`);
        }
      } else {
        ctx.printError(`mv: não foi possível obter estado de '${source}': Arquivo ou diretório não encontrado`);
      }
    }
  }
];
