import type { Command } from './types';

export const sysadminCommands: Command[] = [
  {
    name: 'chown',
    description: 'Altera o dono e o grupo de um arquivo',
    help: 'chown [OPÇÃO]... [DONO][:[GRUPO]] ARQUIVO...\n\nExemplo:\n  sudo chown root:root script.sh',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('chown: operando ausente');
        return;
      }
      const owner = ctx.args[0].split(':')[0];
      const target = ctx.args[1];
      if (ctx.vfs.chown(target, owner, ctx.user)) {
        ctx.print(`Dono de '${target}' alterado para '${owner}'.`);
      } else {
        ctx.printError(`chown: alteração de dono de '${target}': Operação não permitida`);
      }
    }
  },
  {
    name: 'chgrp',
    description: 'Altera o grupo de um arquivo',
    help: 'chgrp [OPÇÃO]... GRUPO ARQUIVO...\n\nExemplo:\n  sudo chgrp admin projeto.txt',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('chgrp: operando ausente');
        return;
      }
      ctx.print(`Grupo de '${ctx.args[1]}' alterado para '${ctx.args[0]}'.`);
    }
  },
  {
    name: 'ps',
    description: 'Informa o estado atual dos processos',
    help: 'ps [OPÇÕES]\n\nOpções comuns:\n  aux    lista todos os processos de todos os usuários',
    execute: async (ctx) => {
      ctx.print('USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND');
      ctx.print('root         1  0.0  0.1  16844  9612 ?        Ss   May01   0:02 /sbin/init');
      ctx.print('dayhoff   1234  0.5  2.1 456780 89120 pts/0    S+   10:30   0:15 /usr/bin/zsh');
      ctx.print('dayhoff   5678  12.0 4.5 1200340 340120 ?      Sl   10:35   5:30 /usr/bin/docker-desktop');
      ctx.print('dayhoff   8901  0.0  0.0   7890  1234 pts/0    R+   11:00   0:00 ps aux');
    }
  },
  {
    name: 'tail',
    description: 'Exibe a última parte de um arquivo',
    help: 'tail [OPÇÃO]... [ARQUIVO]...\n\nOpções:\n  -n, --lines=K    exibe as últimas K linhas\n  -f, --follow     acompanha o crescimento do arquivo',
    execute: async (ctx) => {
      const follow = ctx.args.includes('-f') || ctx.args.includes('--follow');
      const filename = ctx.args.find(a => !a.startsWith('-')) || 'access.log';
      
      ctx.print(`==> ${filename} <==`);
      ctx.print('192.168.1.1 - - [01/May/2026:10:00:01] "GET /index.html HTTP/1.1" 200 1234');
      ctx.print('192.168.1.5 - - [01/May/2026:10:05:22] "POST /api/data HTTP/1.1" 201 567');
      
      if (follow) {
        ctx.print('\x1b[1;30m(Acompanhando arquivo... Pressione Ctrl+C para parar no terminal real)\x1b[0m');
        await new Promise(r => setTimeout(r, 1000));
        ctx.print('192.168.1.12 - - [01/May/2026:11:02:45] "GET /api/status HTTP/1.1" 200 89');
      }
    }
  },
  {
    name: 'journalctl',
    description: 'Consulta e exibe logs do systemd journal',
    help: 'journalctl [OPÇÕES]\n\nOpções:\n  -u, --unit=UNIT    mostra logs de uma unidade específica\n  -f, --follow       acompanha novos logs',
    execute: async (ctx) => {
      ctx.print('-- Logs begin at Fri 2026-05-01 08:00:00 UTC. --');
      ctx.print('May 01 08:00:01 LaBiOmics systemd[1]: Starting Docker Application Container Engine...');
      ctx.print('May 01 08:00:05 LaBiOmics dockerd[123]: libcontainerd: started HTTP response handler');
      ctx.print('May 01 08:00:06 LaBiOmics systemd[1]: Started Docker Application Container Engine.');
    }
  },
  {
    name: 'crontab',
    description: 'Mantém arquivos crontab para usuários individuais',
    help: 'crontab [-u usuário] [-l | -r | -e]\n\nOpções:\n  -l    lista as tarefas agendadas\n  -e    edita as tarefas agendadas',
    execute: async (ctx) => {
      if (ctx.args.includes('-l')) {
        ctx.print('# m h  dom mon dow   command');
        ctx.print('0 2 * * * /home/dayhoff/scripts/backup.sh');
        ctx.print('*/15 * * * * /usr/bin/python3 /home/dayhoff/monitor.py');
      } else {
        ctx.print('no crontab for dayhoff');
      }
    }
  },
  {
    name: 'bash',
    description: 'Interpretador de linguagem de comandos GNU Bourne-Again SHell',
    help: 'bash [OPÇÃO] [ARQUIVO]\n\nExecuta comandos ou scripts shell.',
    execute: async (ctx) => {
      const script = ctx.args.find(a => !a.startsWith('-'));
      if (script) {
        const content = ctx.vfs.readFile(script, ctx.user);
        if (content) {
          ctx.print(`\x1b[1;30mExecuting script: ${script}...\x1b[0m`);
          if (content.includes('echo')) {
            const match = content.match(/echo\s+['"]?([^'"]+)['"]?/);
            if (match) ctx.print(match[1]);
          }
          ctx.print(`\x1b[1;32mScript ${script} finalizado.\x1b[0m`);
        } else {
          ctx.printError(`bash: ${script}: Arquivo não encontrado`);
        }
      } else {
        ctx.print('Bem-vindo ao Bash simulado. Digite exit para sair (ou apenas execute comandos).');
      }
    }
  }
];
