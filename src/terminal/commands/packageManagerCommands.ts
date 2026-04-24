import type { Command } from './types';

// Helpers para persistência de Ambientes e Pacotes
const getEnvs = () => JSON.parse(localStorage.getItem('terminal_envs') || '["base"]');
const addEnv = (name: string) => {
  const envs = getEnvs();
  if (!envs.includes(name)) {
    envs.push(name);
    localStorage.setItem('terminal_envs', JSON.stringify(envs));
  }
};

const getInstalledPkgs = (env: string) => JSON.parse(localStorage.getItem(`pkgs_${env}`) || '["python", "pip", "bash"]');
const installPkg = (env: string, pkg: string) => {
  const pkgs = getInstalledPkgs(env);
  if (!pkgs.includes(pkg)) {
    pkgs.push(pkg);
    localStorage.setItem(`pkgs_${env}`, JSON.stringify(pkgs));
  }
};

export const packageManagerCommands: Command[] = [
  {
    name: 'conda',
    description: 'Gerenciador de pacotes e ambientes (Conda)',
    help: 'conda [COMANDO] [OPÇÕES]\n\nGerencia ambientes virtuais e pacotes.\n\nComandos:\n  install [pacote]    Instala um novo pacote\n  remove [pacote]     Remove um pacote\n  list                Lista pacotes instalados no ambiente atual\n  activate [env]      Ativa um ambiente virtual\n  deactivate          Desativa o ambiente atual\n  search [query]      Busca por pacotes disponíveis\n  info                Exibe informações do sistema conda\n  env list            Lista todos os ambientes disponíveis\n  env create -f [yml] Cria ambiente a partir de um arquivo',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      const currentEnv = localStorage.getItem('current_env') || 'base';
      const channelIdx = ctx.args.indexOf('-c');
      const channel = channelIdx !== -1 ? ctx.args[channelIdx + 1] : 'defaults';

      if (sub === 'install') {
        const pkg = ctx.args.find(a => !a.startsWith('-') && a !== 'install');
        if (!pkg) { ctx.printError('conda install: erro: especifique o pacote'); return; }
        ctx.print(`Solving environment: done\n## Package Plan ##\n  added: ${pkg}\nProceed ([y]/n)? y\nExecuting transaction: done`);
        installPkg(currentEnv, pkg);
      } else if (sub === 'search') {
        const pkg = ctx.args[1] || 'python';
        ctx.print(`Loading channels: done\n# Name                       Version           Build  Channel\n${pkg.padEnd(26)} 3.10.4      h1234567_0  ${channel}`);
      } else if (sub === 'info') {
        ctx.print(`     active environment : ${currentEnv}\n    active env location : /home/dayhoff/conda/envs/${currentEnv}\n            shell level : 1\n       conda version : 23.1.0`);
      } else if (sub === 'list') {
        ctx.print(`# packages in environment at /home/dayhoff/conda/envs/${currentEnv}:`);
        getInstalledPkgs(currentEnv).forEach((p: string) => ctx.print(`${p.padEnd(25)} 1.2.3                py310_0` ));
      } else if (sub === 'activate') {
        const target = ctx.args[1] || 'base';
        if (getEnvs().includes(target)) { ctx.setEnv(target); ctx.print(`Ambiente '${target}' ativado.`); }
        else ctx.printError(`conda activate: ambiente não encontrado: ${target}`);
      } else if (sub === 'env' && ctx.args[1] === 'list') {
        ctx.print('# conda environments:\n#');
        getEnvs().forEach((e: string) => ctx.print(`${e.padEnd(20)} ${e === currentEnv ? '*' : ' '} /home/dayhoff/conda/envs/${e}`));
      } else {
        ctx.print('Uso: conda [install|remove|activate|list|search|info|env list]');
      }
    }
  },
  {
    name: 'mamba',
    description: 'Gerenciador de pacotes rápido (Mamba)',
    help: 'mamba [COMANDO] [OPÇÕES]\n\nAlternativa ultra-rápida ao conda usando libsolv.\n\nComandos:\n  install [pacote]    Instala um pacote rapidamente\n  create -n [nome]    Cria um novo ambiente\n  repoquery search    Busca detalhada no repositório\n  activate [env]      Ativa um ambiente virtual',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      const currentEnv = localStorage.getItem('current_env') || 'base';
      if (sub === 'install') {
        const pkg = ctx.args.find(a => !a.startsWith('-') && a !== 'install') || 'fastqc';
        ctx.print(`\x1b[1;36mbioconda/linux-64\x1b[0m                   \x1b[1;32m[OK]\x1b[0m\n\x1b[1;32mConfirm? [Y/n]\x1b[0m y\n\x1b[32m${pkg}\x1b[0m [####################] 100%`);
        installPkg(currentEnv, pkg);
      } else if (sub === 'create') {
        const nIdx = ctx.args.indexOf('-n');
        const name = nIdx !== -1 ? ctx.args[nIdx+1] : null;
        if (name) { ctx.print(`Creating environment ${name}... done`); addEnv(name); }
      } else if (sub === 'repoquery') {
        ctx.print(`Searching for ${ctx.args[2] || 'samtools'}...\nsamtools 1.16.1 (bioconda)\nbwa 0.7.17 (bioconda)`);
      } else {
        ctx.print('Uso: mamba [install|create|activate|repoquery|list]');
      }
    }
  },
  {
    name: 'micromamba',
    description: 'Executável mamba minúsculo e autossuficiente',
    help: 'micromamba [COMANDO] [OPÇÕES]\n\nVersão standalone do mamba que não precisa de instalação prévia do conda.\n\nComandos:\n  shell init          Inicializa o shell para o micromamba\n  install [pacote]    Instala pacotes\n  create -n [nome]    Cria ambiente\n  env list            Lista ambientes',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'shell' && ctx.args[1] === 'init') {
        ctx.print(`Enabling micromamba shell support in ~/.bashrc...\nSuccessfully initialized.`);
      } else {
        // Reutiliza lógica do mamba/conda
        const mamba = packageManagerCommands.find(c => c.name === 'mamba');
        if (mamba) await mamba.execute(ctx);
      }
    }
  },
  {
    name: 'pip',
    description: 'Instalador de pacotes para Python',
    help: 'pip [COMANDO] [OPÇÕES]\n\nGerenciador de pacotes oficial do Python.\n\nComandos:\n  install [pacote]       Instala pacotes\n  uninstall [pacote]     Remove pacotes\n  list                   Lista pacotes instalados\n  show [pacote]          Exibe detalhes sobre um pacote\n  freeze                 Exibe pacotes no formato de requirements.txt\n  search [query]         Busca pacotes no PyPI',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'install') {
        const pkg = ctx.args.find(a => !a.startsWith('-') && a !== 'install');
        if (!pkg) { ctx.printError('pip install: especifique o pacote'); return; }
        ctx.print(`Collecting ${pkg}\n  Downloading ${pkg}-2.4.1.whl\nSuccessfully installed ${pkg}`);
      } else if (sub === 'show') {
        ctx.print(`Name: ${ctx.args[1] || 'pandas'}\nVersion: 1.5.3\nSummary: Powerful data structures for data analysis\nLocation: /usr/local/lib/python3.10/dist-packages`);
      } else if (sub === 'freeze') {
        ctx.print('numpy==1.24.2\npandas==1.5.3\nscipy==1.10.1\nmatplotlib==3.7.1');
      } else if (sub === 'list') {
        ctx.print('Package    Version\n---------- -------\npip        23.0.1\nsetuptools 67.8.0');
      } else {
        ctx.print('Usage: pip [install|uninstall|list|show|freeze|search]');
      }
    }
  },
  {
    name: 'pyenv',
    description: 'Gerenciador de versões do Python',
    help: 'pyenv [COMANDO] [OPÇÕES]\n\nPermite alternar facilmente entre múltiplas versões do Python.\n\nComandos:\n  install [ver]     Instala uma versão do Python (ex: 3.11.0)\n  versions          Lista todas as versões instaladas\n  global [ver]      Define a versão global do Python\n  local [ver]       Define a versão do Python para o diretório atual\n  which [cmd]       Mostra o caminho absoluto para o executável',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'versions') {
        ctx.print(`  system\n* 3.10.4 (set by /home/dayhoff/.pyenv/version)\n  3.11.0\n  3.12-dev`);
      } else if (sub === 'install') {
        const ver = ctx.args[1] || '3.11.0';
        ctx.print(`Downloading Python-${ver}.tar.xz...\nInstalling Python-${ver}... [OK]`);
      } else if (sub === 'global') {
        ctx.print(`Global Python version set to ${ctx.args[1] || '3.10.4'}`);
      } else {
        ctx.print('Usage: pyenv [install|versions|global|local|which]');
      }
    }
  },
  {
    name: 'docker',
    description: 'Gerenciador de containers Docker',
    help: 'docker [COMANDO] [OPÇÕES]\n\nPlataforma para containers e orquestração.\n\nComandos:\n  run [img]       Cria e inicia um container\n  ps              Lista containers\n  exec [id] [cmd] Executa comando em container rodando\n  stop [id]       Para um container\n  logs [id]       Mostra logs do container\n  network ls      Lista redes\n  volume ls       Lista volumes\n  compose up      Docker Compose (orquestração local)\n  swarm init      Docker Swarm (cluster)',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      const getContainers = () => JSON.parse(localStorage.getItem('docker_containers') || '[]');

      if (sub === 'ps') {
        ctx.print('CONTAINER ID   IMAGE          STATUS         NAMES');
        getContainers().forEach((c: any) => ctx.print(`${c.id.padEnd(14)} ${c.image.padEnd(14)} ${c.status.padEnd(14)} ${c.name}`));
      } else if (sub === 'network' && ctx.args[1] === 'ls') {
        ctx.print('NETWORK ID     NAME      DRIVER    SCOPE\ne12345678901   bridge    bridge    local\nf12345678901   host      host      local');
      } else if (sub === 'volume' && ctx.args[1] === 'ls') {
        ctx.print('DRIVER    VOLUME NAME\nlocal     db_data\nlocal     web_static');
      } else if (sub === 'logs') {
        ctx.print(`[INFO] Starting server...\n[INFO] Listening on port 80\n[DEBUG] Connection from 192.168.1.5`);
      } else if (sub === 'compose' && ctx.args[1] === 'up') {
        ctx.print(`\x1b[1;34m[+] Running 2/2\x1b[0m\n ⠿ Container db      Started\n ⠿ Container web     Started`);
      } else if (sub === 'swarm') {
        ctx.print('Swarm initialized: current node (manager) is now node-1.');
      } else {
        ctx.print('Uso: docker [run|ps|exec|stop|logs|network|volume|compose|swarm]');
      }
    }
  },
  {
    name: 'singularity',
    description: 'Plataforma de containers para HPC e Ciência',
    help: 'singularity [COMANDO] [OPÇÕES]\n\nFoco em segurança e ambientes científicos.\n\nComandos:\n  pull [url]      Baixa imagem .sif\n  exec [img] [cmd] Executa comando\n  shell [img]     Shell interativo\n  instance start  Inicia container em background\n  instance list   Lista instâncias rodando\n  cache list      Mostra cache de imagens\n  inspect [img]   Metadados da imagem',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'instance' && ctx.args[1] === 'list') {
        ctx.print('INSTANCE NAME    PID      IP              IMAGE\nweb_server       12345    10.0.0.1        nginx.sif');
      } else if (sub === 'cache' && ctx.args[1] === 'list') {
        ctx.print('NAME                     DATE        SIZE\nubuntu_latest.sif        2026-04-20  75MB\npython_3.10.sif          2026-04-21  120MB');
      } else if (sub === 'pull') {
        ctx.print(`INFO:    Pulling from Docker Hub...\n\x1b[1;32mINFO:    Build complete: image.sif\x1b[0m`);
      } else {
        ctx.print('Uso: singularity [pull|exec|shell|instance|cache|inspect]');
      }
    }
  },
  {
    name: 'apptainer',
    description: 'O sucessor do Singularity (HPC)',
    help: 'apptainer [COMANDO] [OPÇÕES]\n\nAlias moderno para o Singularity. Mesma sintaxe e funcionalidades.',
    execute: async (ctx) => {
      const sing = packageManagerCommands.find(c => c.name === 'singularity');
      if (sing) await sing.execute(ctx);
    }
  },
  {
    name: 'pixi',
    description: 'Gerenciador de pacotes e projetos moderno',
    help: 'pixi [COMANDO] [OPÇÕES]\n\nGerenciador baseado em conda com foco em reprodutibilidade e projetos.\n\nComandos:\n  init [dir]      Cria um novo projeto pixi\n  add [pacote]    Adiciona dependência\n  run [tarefa]    Executa uma tarefa do projeto\n  shell           Inicia um shell com o ambiente do projeto\n  project help    Ajuda sobre gerenciamento de projeto',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'init') {
        ctx.print(`\x1b[1;32m✔\x1b[0m Created pixi.toml\n\x1b[1;32m✔\x1b[0m Initialized project in ${ctx.args[1] || 'current directory'}`);
      } else if (sub === 'run') {
        ctx.print(`\x1b[1;30m(pixi run: ${ctx.args[1] || 'python'})\x1b[0m\nPython 3.11.0 (main, Apr 23 2026)`);
      } else if (sub === 'shell') {
        ctx.print(`\x1b[1;34m(pixi-env)\x1b[0m dayhoff@LaBiOmicS:~$ `);
      } else if (sub === 'add') {
        ctx.print(`\x1b[1;32m✔\x1b[0m Added ${ctx.args[1] || 'numpy'} to [dependencies]`);
      } else {
        ctx.print('Usage: pixi [init|add|run|shell|list|remove]');
      }
    }
  },
  {
    name: 'deactivate',
    description: 'Desativa o ambiente virtual atual',
    help: 'deactivate\n\nSai do ambiente virtual ativo e retorna ao ambiente base.',
    execute: async (ctx) => {
      ctx.setEnv('');
      ctx.print('Ambiente desativado.');
    }
  }
];
