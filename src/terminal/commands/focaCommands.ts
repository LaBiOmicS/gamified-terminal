import type { Command } from './types';

export const focaCommands: Command[] = [
  {
    name: 'man',
    description: 'Interface para os manuais de referência do sistema',
    execute: async (ctx) => {
      const page = ctx.args[0];
      if (!page) {
        ctx.print('Qual página de manual você deseja?');
        return;
      }
      
      const manuals: Record<string, string> = {
        ls: 'LS(1) - lista o conteúdo do diretório\n\nSINOPSE: ls [ARQUIVO]...\nDESCRIÇÃO: Lista informações sobre os ARQUIVOS (o diretório atual por padrão).',
        cd: 'CD(1) - muda o diretório de trabalho\n\nSINOPSE: cd [DIR]\nDESCRIÇÃO: Muda o diretório atual para DIR.',
        cat: 'CAT(1) - concatena arquivos e imprime na saída padrão\n\nSINOPSE: cat [ARQUIVO]...\nDESCRIÇÃO: Concatena ARQUIVO(s) para a saída padrão.',
        pwd: 'PWD(1) - imprime o nome do diretório atual\n\nSINOPSE: pwd\nDESCRIÇÃO: Imprime o nome completo do diretório de trabalho atual.',
        mkdir: 'MKDIR(1) - cria diretórios\n\nSINOPSE: mkdir DIRETÓRIO...\nDESCRIÇÃO: Cria o(s) DIRETÓRIO(s), se ainda não existirem.',
        rm: 'RM(1) - remove arquivos ou diretórios\n\nSINOPSE: rm [OPÇÃO]... [ARQUIVO]...\nDESCRIÇÃO: rm remove cada arquivo especificado.',
        grep: 'GREP(1) - imprime linhas que combinam com padrões\n\nSINOPSE: grep PADRÃO [ARQUIVO]...\nDESCRIÇÃO: grep busca pelo PADRÃO em cada ARQUIVO.',
      };

      if (manuals[page]) {
        ctx.print(manuals[page]);
      } else {
        ctx.print(`Nenhuma entrada de manual para ${page}`);
      }
    }
  },
  {
    name: 'grep',
    description: 'Imprime linhas que combinam com padrões',
    execute: async (ctx) => {
      if (ctx.args.length < 1) {
        ctx.printError('Uso: grep PADRÃO [ARQUIVO]...');
        return;
      }
      const pattern = ctx.args[0];
      const files = ctx.args.slice(1);
      
      if (files.length === 0) {
        ctx.printError('grep: operando de arquivo ausente');
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
          ctx.printError(`grep: ${path}: Arquivo ou diretório não encontrado`);
        }
      }
    }
  },
  {
    name: 'wc',
    description: 'Imprime contagem de linhas, palavras e bytes',
    execute: async (ctx) => {
      if (ctx.args.length === 0) {
        ctx.printError('wc: operando de arquivo ausente');
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
          ctx.printError(`wc: ${path}: Arquivo ou diretório não encontrado`);
        }
      }
    }
  },
  {
    name: 'head',
    description: 'Saída da primeira parte de arquivos',
    execute: async (ctx) => {
      const n = 10;
      const path = ctx.args[0];
      if (!path) return;
      
      const content = ctx.vfs.readFile(path);
      if (content !== null) {
        ctx.print(content.split('\n').slice(0, n).join('\n'));
      } else {
        ctx.printError(`head: ${path}: Arquivo ou diretório não encontrado`);
      }
    }
  },
  {
    name: 'tail',
    description: 'Saída da última parte de arquivos',
    execute: async (ctx) => {
      const n = 10;
      const path = ctx.args[0];
      if (!path) return;
      
      const content = ctx.vfs.readFile(path);
      if (content !== null) {
        const lines = content.split('\n');
        ctx.print(lines.slice(Math.max(0, lines.length - n)).join('\n'));
      } else {
        ctx.printError(`tail: ${path}: Arquivo ou diretório não encontrado`);
      }
    }
  },
  {
    name: 'ps',
    description: 'Relatório do status dos processos atuais',
    execute: async (ctx) => {
      ctx.print('  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 zsh\n 5678 pts/0    00:00:00 ps');
    }
  },
  {
    name: 'top',
    description: 'Exibe processos do Linux',
    execute: async (ctx) => {
      ctx.print('top - 12:34:56 up 1 day, 2:30,  1 user,  load average: 0.00, 0.01, 0.05\nTasks: 1 total, 1 running, 0 sleeping, 0 stopped, 0 zombie\n%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni, 100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st\nMiB Mem :   8192.0 total,   4096.0 free,   2048.0 used,   2048.0 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 5678 dayhoff   20   0   12345   6789   1234 R   0.0   0.1   0:00.01 top');
    }
  },
  {
    name: 'free',
    description: 'Exibe quantidade de memória livre e usada no sistema',
    execute: async (ctx) => {
      ctx.print('              total        used        free      shared  buff/cache   available\nMem:        8192000     2048000     4096000      102400     2048000     6144000\nSwap:       2048000           0     2048000');
    }
  },
  {
    name: 'uptime',
    description: 'Informa há quanto tempo o sistema está ligado',
    execute: async (ctx) => {
      ctx.print(' 12:34:56 up 1 day, 2:30,  1 user,  load average: 0.00, 0.01, 0.05');
    }
  },
  {
    name: 'chmod',
    description: 'Altera as permissões de acesso a arquivos',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('chmod: operando ausente');
        return;
      }
      const mode = ctx.args[0];
      const path = ctx.args[1];
      if (!ctx.vfs.chmod(path, mode)) {
        ctx.printError(`chmod: não foi possível acessar '${path}': Arquivo ou diretório não encontrado`);
      }
    }
  },
  {
    name: 'chown',
    description: 'Altera o dono e o grupo de arquivos',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('chown: operando ausente');
        return;
      }
      const owner = ctx.args[0];
      const path = ctx.args[1];
      if (!ctx.vfs.chown(path, owner)) {
        ctx.printError(`chown: não foi possível acessar '${path}': Arquivo ou diretório não encontrado`);
      }
    }
  },
  {
    name: 'apt',
    description: 'Ferramenta de gerenciamento de pacotes',
    execute: async (ctx) => {
      const command = ctx.args[0];
      const pkg = ctx.args[1];
      if (command === 'install' && pkg) {
        ctx.print(`Lendo listas de pacotes... Pronto`);
        ctx.print(`Construindo árvore de dependências... Pronto`);
        ctx.print(`Os seguintes pacotes NOVOS serão instalados: ${pkg}`);
        ctx.print(`0 atualizados, 1 novos instalados, 0 a serem removidos.`);
        ctx.print(`Instalando ${pkg}... [OK]`);
      } else if (command === 'update') {
        ctx.print('Atingido:1 http://br.archive.ubuntu.com/ubuntu jammy InRelease');
        ctx.print('Lendo listas de pacotes... Pronto');
      } else {
        ctx.print('Uso: apt [install|update] [pacote]');
      }
    }
  },
  {
    name: 'ping',
    description: 'Envia pacotes ICMP ECHO_REQUEST para hosts da rede',
    execute: async (ctx) => {
      const host = ctx.args[0];
      if (!host) {
        ctx.printError('ping: host ausente');
        return;
      }
      ctx.print(`PING ${host} (127.0.0.1) 56(84) bytes of data.`);
      ctx.print(`64 bytes from ${host} (127.0.0.1): icmp_seq=1 ttl=64 time=0.045 ms`);
      ctx.print(`64 bytes from ${host} (127.0.0.1): icmp_seq=2 ttl=64 time=0.048 ms`);
      ctx.print(`--- ${host} ping statistics ---`);
      ctx.print('2 packets transmitted, 2 received, 0% packet loss, time 1001ms');
    }
  },
  {
    name: 'tracert',
    description: 'Rastreia a rota para um host (alias para traceroute)',
    execute: async (ctx) => {
      const host = ctx.args[0];
      if (!host) {
        ctx.printError('tracert: host ausente');
        return;
      }
      ctx.print(`traceroute to ${host} (127.0.0.1), 30 hops max, 60 byte packets`);
      ctx.print(` 1  gateway (192.168.1.1)  0.521 ms  0.498 ms  0.472 ms`);
      ctx.print(` 2  ${host} (127.0.0.1)  0.589 ms  0.564 ms  0.541 ms`);
    }
  }
];
