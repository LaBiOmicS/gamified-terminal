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
      const showHidden = ctx.args.some(a => a.includes('a') && a.startsWith('-'));
      const longFormat = ctx.args.some(a => a.includes('l') && a.startsWith('-'));
      const pathArg = ctx.args.find(a => !a.startsWith('-')) || ctx.vfs.getCwd();
      
      const childrenNames = ctx.vfs.listDirectory(pathArg, ctx.user);
      if (childrenNames) {
        const filtered = showHidden ? ['.', '..', ...childrenNames] : childrenNames.filter(n => !n.startsWith('.'));
        
        if (longFormat) {
          ctx.print('total ' + filtered.length * 4);
          for (const name of filtered) {
            let node;
            if (name === '.') node = ctx.vfs.getNode(pathArg);
            else if (name === '..') node = ctx.vfs.getNode(ctx.vfs.resolvePath(pathArg + '/..'));
            else node = ctx.vfs.getNode(ctx.vfs.resolvePath(pathArg + '/' + name));

            if (node) {
              const type = node.type === 'directory' ? 'd' : '-';
              const date = new Date(node.modifiedAt).toLocaleDateString('pt-BR', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
              ctx.print(`${type}${node.permissions} 1 ${node.owner} ${node.group} 4096 ${date} ${name}`);
            }
          }
        } else {
          ctx.print(filtered.join('  '));
        }
      } else {
        ctx.printError(`ls: não foi possível acessar '${pathArg}': Permissão negada ou Diretório não encontrado`);
      }
    }
  },
  {
    name: 'cd',
    description: 'Muda o diretório de trabalho',
    execute: async (ctx) => {
      const path = ctx.args[0] || '/home/dayhoff';
      if (!ctx.vfs.setCwd(path, ctx.user)) {
        ctx.printError(`cd: ${path}: Permissão negada ou Arquivo ou diretório não encontrado`);
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
        const content = ctx.vfs.readFile(path, ctx.user);
        if (content !== null && content !== 'Permissão negada') {
          ctx.print(content);
        } else {
          ctx.printError(`cat: ${path}: Permissão negada ou Arquivo ou diretório não encontrado`);
        }
      }
    }
  },
  {
    name: 'mkdir',
    description: 'Cria diretórios',
    execute: async (ctx) => {
      const createParents = ctx.args.includes('-p');
      const paths = ctx.args.filter(a => !a.startsWith('-'));
      
      if (paths.length === 0) {
        ctx.printError('mkdir: operando ausente');
        return;
      }
      
      for (const path of paths) {
        if (createParents) {
          const absolutePath = ctx.vfs.resolvePath(path);
          const parts = absolutePath.split('/').filter(Boolean);
          let current = '';
          for (const part of parts) {
            current += '/' + part;
            if (!ctx.vfs.getNode(current)) {
              ctx.vfs.mkdir(current, ctx.user);
            }
          }
        } else {
          if (!ctx.vfs.mkdir(path, ctx.user)) {
            ctx.printError(`mkdir: não foi possível criar o diretório '${path}': Permissão negada ou arquivo já existe`);
          }
        }
      }
    }
  },
  {
    name: 'rm',
    description: 'Remove arquivos ou diretórios',
    execute: async (ctx) => {
      let recursive = false;
      let force = false;
      const paths: string[] = [];

      for (const arg of ctx.args) {
        if (arg.startsWith('-')) {
          if (arg.includes('r')) recursive = true;
          if (arg.includes('f')) force = true;
        } else {
          paths.push(arg);
        }
      }

      if (paths.length === 0) {
        if (!force) ctx.printError('rm: operando ausente');
        return;
      }

      for (const path of paths) {
        if (!ctx.vfs.rm(path, ctx.user, recursive)) {
          if (!force) ctx.printError(`rm: não foi possível remover '${path}': Permissão negada ou diretório não vazio`);
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
        
        if (!ctx.vfs.writeFile(target, content, ctx.user, isAppend)) {
          ctx.printError(`zsh: ${target}: Permissão negada ou Diretório não encontrado`);
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
      ctx.print(ctx.user);
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
      const content = ctx.vfs.readFile(source, ctx.user);
      if (content !== null && content !== 'Permissão negada') {
        if (!ctx.vfs.writeFile(dest, content, ctx.user)) {
          ctx.printError(`cp: não foi possível criar o arquivo '${dest}': Permissão negada`);
        }
      } else {
        ctx.printError(`cp: não foi possível obter estado de '${source}': Permissão negada ou Arquivo não encontrado`);
      }
    }
  },
  {
    name: 'touch',
    description: 'Cria um arquivo vazio ou atualiza a data de acesso e modificação',
    execute: async (ctx) => {
      if (ctx.args.length === 0) {
        ctx.printError('touch: operando de arquivo ausente');
        return;
      }
      for (const path of ctx.args) {
        const content = ctx.vfs.readFile(path, ctx.user);
        if (content === null) {
          ctx.vfs.writeFile(path, '', ctx.user);
        } else if (content !== 'Permissão negada') {
          ctx.vfs.writeFile(path, content, ctx.user);
        } else {
          ctx.printError(`touch: ${path}: Permissão negada`);
        }
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
      const content = ctx.vfs.readFile(source, ctx.user);
      if (content !== null && content !== 'Permissão negada') {
        if (ctx.vfs.writeFile(dest, content, ctx.user)) {
          ctx.vfs.rm(source, ctx.user);
        } else {
          ctx.printError(`mv: não foi possível mover '${source}' para '${dest}': Permissão negada`);
        }
      } else {
        ctx.printError(`mv: não foi possível obter estado de '${source}': Permissão negada ou Arquivo não encontrado`);
      }
    }
  }
];
