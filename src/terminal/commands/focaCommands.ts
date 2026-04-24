import type { Command } from './types';

export const focaCommands: Command[] = [
  {
    name: 'man',
    description: 'Interface para os manuais de referência do sistema',
    help: 'man COMANDO\n\nExibe a página de manual do sistema para o COMANDO especificado.',
    execute: async (ctx) => {
      const page = ctx.args[0];
      if (!page) { ctx.print('Qual página de manual você deseja?'); return; }
      const manuals: Record<string, string> = {
        ls: 'LS(1) - lista o conteúdo do diretório\n\nSINOPSE: ls [ARQUIVO]...\nDESCRIÇÃO: Lista informações sobre os ARQUIVOS.',
        chmod: 'CHMOD(1) - altera permissões de acesso a arquivos\n\nSINOPSE: chmod [OPÇÃO]... MODO[,MODO]... ARQUIVO...',
        sbatch: 'SBATCH(1) - envia um script de lote para o Slurm\n\nSINOPSE: sbatch [OPÇÕES] SCRIPT'
      };
      ctx.print(manuals[page] || `Nenhuma entrada de manual para ${page}`);
    }
  },
  {
    name: 'sudo',
    description: 'Executa um comando como superusuário (root)',
    help: 'sudo COMANDO [ARGUMENTOS]\n\nPermite que usuários comuns executem comandos com privilégios de administrador.',
    execute: async (ctx) => {
      if (ctx.args.length === 0) ctx.print('Uso: sudo [comando]');
    }
  },
  {
    name: 'history',
    description: 'Exibe a lista de comandos executados anteriormente',
    help: 'history\n\nMostra o histórico de comandos da sessão atual.',
    execute: async (ctx) => {
      ctx.print('  1  ls -la\n  2  cd /home/dayhoff\n  3  mkdir analise\n  4  history');
    }
  },
  {
    name: 'wc',
    description: 'Imprime contagem de linhas, palavras e bytes',
    help: 'wc [OPÇÃO]... [ARQUIVO]...\n\nOpções:\n  -l, --lines    exibe o número de linhas\n  -w, --words    exibe o número de palavras',
    execute: async (ctx) => {
      ctx.print(`      10      45     320 ${ctx.args[0] || ''}`);
    }
  },
  {
    name: 'uptime',
    description: 'Informa há quanto tempo o sistema está ligado',
    help: 'uptime\n\nExibe a hora atual, tempo de atividade e carga média do sistema.',
    execute: async (ctx) => {
      ctx.print(' 14:30:05 up 2 days,  4:12,  1 user,  load average: 0.05, 0.02, 0.01');
    }
  },
  {
    name: 'ssh',
    description: 'Cliente de login remoto OpenSSH',
    help: 'ssh [USUÁRIO@]HOST\n\nConecta-se a um servidor remoto de forma segura.',
    execute: async (ctx) => {
      if (!ctx.args[0]) { ctx.print('Uso: ssh usuario@host'); return; }
      ctx.print(`Conectando-se a ${ctx.args[0]}...\nSSH connection established.`);
    }
  },
  {
    name: 'groups',
    description: 'Exibe os grupos aos quais o usuário pertence',
    help: 'groups [USUÁRIO]\n\nExibe os nomes dos grupos aos quais o usuário atual ou especificado pertence.',
    execute: async (ctx) => {
      ctx.print(ctx.user === 'root' ? 'root' : 'dayhoff sudo bioinfo labiomics');
    }
  },
  {
    name: 'id',
    description: 'Exibe os IDs de usuário e grupo',
    help: 'id [USUÁRIO]\n\nExibe informações de UID (usuário) e GID (grupo) reais e efetivos.',
    execute: async (ctx) => {
      ctx.print(ctx.user === 'root' ? 'uid=0(root) gid=0(root) grupos=0(root)' : 'uid=1000(dayhoff) gid=1000(dayhoff) grupos=1000(dayhoff),27(sudo),1001(labiomics)');
    }
  },
  {
    name: 'du',
    description: 'Estima o uso de espaço de arquivos',
    help: 'du [OPÇÃO]... [ARQUIVO]...\n\nOpções:\n  -h, --human-readable   tamanhos legíveis\n  -s, --summarize        exibe apenas o total',
    execute: async (ctx) => {
      const h = ctx.args.includes('-h');
      ctx.print(`${h ? '452M' : '462848'}\t${ctx.args.find(a => !a.startsWith('-')) || '.'}`);
    }
  },
  {
    name: 'vim',
    description: 'Editor de texto visual para programadores',
    help: 'vim [ARQUIVO]\n\nInicia a simulação do editor Vim. Use :q para sair.',
    execute: async (ctx) => {
      ctx.clear();
      ctx.print(`\x1b[1;34m~\x1b[0m\n\x1b[1;34m~\x1b[0m   VIM - Vi IMproved\n\x1b[1;34m~\x1b[0m   Simulação para aprendizado\n\x1b[1;34m~\n\x1b[7m"${ctx.args[0] || '[Novo]'}" 0L, 0C                          1,1           Tudo\x1b[0m`);
    }
  },
  {
    name: 'sbatch',
    description: 'Envia um script de lote para o Slurm',
    help: 'sbatch [OPÇÕES] SCRIPT\n\nEnvia um script para execução no cluster HPC.',
    execute: async (ctx) => {
      if (!ctx.args[0]) { ctx.printError('sbatch: erro: nenhum script especificado'); return; }
      ctx.print(`Submitted batch job ${Math.floor(Math.random() * 900000) + 100000}`);
    }
  },
  {
    name: 'squeue',
    description: 'Exibe a fila de jobs do Slurm',
    help: 'squeue\n\nLista todos os jobs em execução ou pendentes no cluster.',
    execute: async (ctx) => {
      ctx.print('             JOBID PARTITION     NAME     USER ST       TIME  NODES\n123456     batch   align     dayhoff  R       5:12      1');
    }
  },
  {
    name: 'sinfo',
    description: 'Exibe informações sobre os nós do cluster Slurm',
    help: 'sinfo\n\nExibe o estado e disponibilidade das partições e nós do cluster.',
    execute: async (ctx) => {
      ctx.print('PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST\nbatch*       up   infinite      8   idle node-[01-08]');
    }
  },
  {
    name: 'scancel',
    description: 'Cancela jobs no Slurm',
    help: 'scancel JOBID\n\nInterrompe um job em execução no cluster.',
    execute: async (ctx) => {
      if (ctx.args[0]) ctx.print(`Job ${ctx.args[0]} cancelled.`);
    }
  },
  {
    name: 'top',
    description: 'Exibe processos do Linux de forma dinâmica',
    help: 'top\n\nVisão em tempo real dos processos e recursos do sistema.',
    execute: async (ctx) => {
      ctx.print('\x1b[H\x1b[Jtop - 14:35:00 up 2 days\nTasks: 120 total, 1 running\n%Cpu(s): 0.5 us, 0.2 sy\nMiB Mem: 8192 total, 4096 free\n\n  PID USER      PR  NI    VIRT    RES  S  %CPU  %MEM     TIME+ COMMAND\n  124 dayhoff   20   0  543200  42100  S   0.5   0.5   0:05.12 bash');
    }
  },
  {
    name: 'free',
    description: 'Exibe quantidade de memória livre e usada',
    help: 'free [OPÇÃO]\n\nOpções:\n  -h, --human   formato legível',
    execute: async (ctx) => {
      ctx.print('              total        used        free\nMem:           7.8G        2.4G        3.1G');
    }
  },
  {
    name: 'lsblk',
    description: 'Lista dispositivos de bloco',
    help: 'lsblk\n\nExibe informações sobre discos e partições.',
    execute: async (ctx) => {
      ctx.print('NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS\nsda      8:0    0    50G  0 disk \n└─sda1   8:1    0    50G  0 part /');
    }
  }
];
