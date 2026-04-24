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
const removePkg = (env: string, pkg: string) => {
  const pkgs = getInstalledPkgs(env).filter((p: string) => p !== pkg);
  localStorage.setItem(`pkgs_${env}`, JSON.stringify(pkgs));
};

export const packageManagerCommands: Command[] = [
  {
    name: 'conda',
    description: 'Gerenciador de pacotes e ambientes (Conda)',
    help: 'conda [COMANDO] [OPÇÕES]\n\nGerencia ambientes virtuais e pacotes.\n\nComandos:\n  install [pacote]    Instala um novo pacote\n  remove [pacote]     Remove um pacote\n  list                Lista pacotes instalados no ambiente atual\n  activate [env]      Ativa um ambiente virtual\n  deactivate          Desativa o ambiente atual\n  env list            Lista todos os ambientes disponíveis\n  env create -f [yml] Cria ambiente a partir de um arquivo',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      const currentEnv = localStorage.getItem('current_env') || 'base';
      const channelIdx = ctx.args.indexOf('-c');
      const channel = channelIdx !== -1 ? ctx.args[channelIdx + 1] : 'defaults';

      if (sub === 'install') {
        const pkg = ctx.args.find(a => !a.startsWith('-') && a !== 'install');
        if (!pkg) { ctx.printError('conda install: erro: especifique o pacote'); return; }
        
        ctx.print(`Collecting package metadata (current_repodata.json): ...working... done`);
        ctx.print(`Solving environment: ...working... done`);
        ctx.print(`\n## Package Plan ##\n  environment location: /home/dayhoff/miniconda3/envs/${currentEnv}\n`);
        ctx.print(`  added / updated specs:\n    - ${pkg}\n`);
        ctx.print(`The following packages will be downloaded:\n\n    package                    |            build\n    ---------------------------|-----------------\n    ${pkg.padEnd(26)} |      h1234567_0   1.2 MB\n`);
        ctx.print(`Proceed ([y]/n)? y`);
        ctx.print(`Preparing transaction: done\nVerifying transaction: done\nExecuting transaction: done`);
        installPkg(currentEnv, pkg);
      } else if (sub === 'remove' || sub === 'uninstall') {
        const pkg = ctx.args.find(a => !a.startsWith('-') && a !== sub);
        if (!pkg) { ctx.printError('conda remove: erro: especifique o pacote'); return; }
        ctx.print(`Collecting package metadata... done\nSolving environment... done`);
        ctx.print(`\n## Package Plan ##\n\nThe following packages will be REMOVED:\n  ${pkg}`);
        ctx.print(`\nProceed ([y]/n)? y\nPreparing transaction: done\nExecuting transaction: done`);
        removePkg(currentEnv, pkg);
      } else if (sub === 'env' && ctx.args[1] === 'create') {
        const fileIdx = ctx.args.indexOf('-f');
        const fileName = fileIdx !== -1 ? ctx.args[fileIdx + 1] : null;
        if (fileName) {
          const content = ctx.vfs.readFile(fileName, ctx.user);
          if (content && content.includes('name:')) {
            const envName = content.match(/name:\s*(.+)/)?.[1].trim() || 'new_env';
            ctx.print(`\x1b[1;34mInstalando ambiente '${envName}' a partir de ${fileName}...\x1b[0m`);
            addEnv(envName);
            installPkg(envName, 'samtools'); installPkg(envName, 'bwa');
            ctx.print(`\x1b[1;32mAmbiente criado com sucesso.\x1b[0m`);
          }
        }
      } else if (sub === 'list') {
        ctx.print(`# packages in environment at /home/dayhoff/miniconda3/envs/${currentEnv}:\n#\n# Name                    Version                   Build  Channel`);
        getInstalledPkgs(currentEnv).forEach((p: string) => ctx.print(`${p.padEnd(25)} 1.2.3                py310_0  ${channel}`));
      } else if (sub === 'activate') {
        const target = ctx.args[1] || 'base';
        if (getEnvs().includes(target)) { ctx.setEnv(target); ctx.print(`Ambiente '${target}' ativado.`); }
        else ctx.printError(`conda activate: ambiente não encontrado: ${target}`);
      } else if (sub === 'deactivate') {
        ctx.setEnv('');
        ctx.print('Ambiente desativado.');
      } else if (sub === 'env' && ctx.args[1] === 'list') {
        ctx.print('# conda environments:\n#');
        getEnvs().forEach((e: string) => ctx.print(`${e.padEnd(20)} ${e === currentEnv ? '*' : ' '} /home/dayhoff/miniconda3/envs/${e}`));
      } else {
        ctx.print('Uso: conda [install|remove|activate|list|env list]');
      }
    }
  },
  {
    name: 'mamba',
    description: 'Gerenciador de pacotes rápido (Mamba)',
    help: 'mamba [COMANDO] [OPÇÕES]\n\nAlternativa ultra-rápida ao conda.\n\nComandos:\n  install [pacote]    Instala um pacote rapidamente\n  remove [pacote]     Remove um pacote\n  activate [env]      Ativa um ambiente virtual',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      const currentEnv = localStorage.getItem('current_env') || 'base';
      if (sub === 'install') {
        const pkg = ctx.args.find(a => !a.startsWith('-') && a !== 'install') || 'fastqc';
        ctx.print(`\x1b[1;36mbioconda/linux-64\x1b[0m                   \x1b[1;32m[OK]\x1b[0m`);
        ctx.print(`\x1b[1;36mconda-forge/noarch\x1b[0m                   \x1b[1;32m[OK]\x1b[0m`);
        ctx.print(`\n\x1b[1mTransaction\x1b[0m\n  \x1b[1;32m+\x1b[0m ${pkg} 0.11.9 (bioconda)\n\n\x1b[1;32mConfirm? [Y/n]\x1b[0m y`);
        ctx.print(`\r\x1b[32m${pkg}\x1b[0m [####################] 100%`);
        installPkg(currentEnv, pkg);
        ctx.print(`\n\x1b[1;32mTransaction finished\x1b[0m`);
      } else if (sub === 'remove') {
        const pkg = ctx.args.find(a => !a.startsWith('-') && a !== 'remove');
        if (pkg) { ctx.print(`Removing ${pkg}... \x1b[1;32mdone\x1b[0m`); removePkg(currentEnv, pkg); }
      } else if (sub === 'activate') {
        const target = ctx.args[1] || 'base';
        if (getEnvs().includes(target)) { ctx.setEnv(target); ctx.print(`Ambiente '${target}' ativado.`); }
        else ctx.printError(`mamba activate: ambiente não encontrado: ${target}`);
      } else {
        ctx.print('Uso: mamba [install|remove|activate|list]');
      }
    }
  },
  {
    name: 'pip',
    description: 'Instalador de pacotes para Python',
    help: 'pip [COMANDO] [OPÇÕES]\n\nGerenciador de pacotes oficial do Python.\n\nComandos:\n  install [pacote]       Instala pacotes\n  install -r [file.txt]  Instala pacotes de um arquivo de requisitos\n  uninstall [pacote]     Remove pacotes\n  list                   Lista pacotes Python instalados',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'install') {
        const isFile = ctx.args.includes('-r');
        const pkg = isFile ? ctx.args[ctx.args.indexOf('-r') + 1] : ctx.args.find(a => !a.startsWith('-') && a !== 'install');
        if (!pkg) { ctx.printError('pip install: erro: especifique o pacote ou arquivo'); return; }
        
        if (isFile) ctx.print(`Installing from ${pkg}...`);
        ctx.print(`Collecting ${pkg}\n  Downloading ${pkg}-2.4.1.whl (156 kB)`);
        ctx.print(`\x1b[32m|████████████████████████████████| 156 kB 1.8 MB/s\x1b[0m`);
        ctx.print(`Successfully installed ${isFile ? 'requirements' : pkg}`);
      } else if (sub === 'uninstall') {
        const pkg = ctx.args.find(a => a !== 'uninstall');
        ctx.print(`Proceed (y/n)? y\n  Successfully uninstalled ${pkg}`);
      } else if (sub === 'list') {
        ctx.print('Package    Version\n---------- -------\npip        23.0.1\nsetuptools 67.8.0');
      } else {
        ctx.print('Usage: pip [install|uninstall|list]');
      }
    }
  },
  {
    name: 'apt',
    description: 'Gerenciador de pacotes do Debian/Ubuntu',
    help: 'apt [COMANDO] [PACOTE]\n\nInterface simplificada para gerenciamento de pacotes do sistema.\n\nComandos:\n  update      Atualiza a lista de repositórios\n  install     Instala um novo pacote\n  remove      Remove um pacote do sistema',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      const pkg = ctx.args[1];
      if (sub === 'install' && pkg) {
        ctx.print(`Lendo listas de pacotes... Pronto\nConstruindo árvore de dependências... Pronto`);
        ctx.print(`Os seguintes pacotes NOVOS serão instalados:\n  ${pkg}`);
        ctx.print(`0 atualizados, 1 novos instalados, 0 a serem removidos.\nInstalando ${pkg}... [OK]`);
        installPkg('system', pkg);
      } else if (sub === 'remove' && pkg) {
        ctx.print(`Removendo ${pkg}... [OK]\nLimpando base de dados... Pronto`);
        removePkg('system', pkg);
      } else if (sub === 'update') {
        ctx.print('Atingido:1 http://archive.ubuntu.com/ubuntu jammy InRelease\nLendo listas de pacotes... Pronto');
      } else {
        ctx.print('Uso: apt [install|remove|update] [pacote]');
      }
    }
  },
  {
    name: 'docker',
    description: 'Gerenciador de containers Docker',
    help: 'docker [COMANDO] [OPÇÕES]\n\nPlataforma para containers e orquestração.\n\nComandos:\n  pull [img]      Baixa uma imagem\n  run [img]       Inicia um container\n  ps              Lista containers\n  images          Lista imagens\n  build -t [tag]  Cria imagem a partir do Dockerfile\n  compose up      Inicia serviços (docker-compose)\n  swarm init      Inicia modo Swarm\n  service create  Cria serviço no Swarm\n  rm/rmi          Remove container/imagem',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      
      interface Container { id: string; image: string; name: string; status: string; }
      const getImages = () => JSON.parse(localStorage.getItem('docker_images') || '["ubuntu:latest", "nginx:latest"]');
      const addImage = (name: string) => {
        const imgs = getImages();
        if (!imgs.includes(name)) { imgs.push(name); localStorage.setItem('docker_images', JSON.stringify(imgs)); }
      };
      const getContainers = (): Container[] => JSON.parse(localStorage.getItem('docker_containers') || '[]');
      const addContainer = (img: string, name: string) => {
        const cnts = getContainers();
        cnts.push({ id: Math.random().toString(36).substring(2, 14), image: img, name, status: 'Up 2 minutes' });
        localStorage.setItem('docker_containers', JSON.stringify(cnts));
      };

      if (sub === 'pull') {
        const img = ctx.args[1];
        if (!img) { ctx.printError('docker pull: imagem não especificada'); return; }
        ctx.print(`Pulling from library/${img}...\n\x1b[32mDone\x1b[0m`);
        addImage(img.includes(':') ? img : `${img}:latest`);
      } else if (sub === 'run') {
        const img = ctx.args.find(a => !a.startsWith('-') && a !== 'run');
        if (!img) { ctx.printError('docker run: imagem não especificada'); return; }
        addContainer(img, `brave_${Math.random().toString(36).substring(7)}`);
        ctx.print(`Container started.`);
      } else if (sub === 'ps') {
        ctx.print('CONTAINER ID   IMAGE          STATUS         NAMES');
        getContainers().forEach(c => ctx.print(`${c.id.padEnd(14)} ${c.image.padEnd(14)} ${c.status.padEnd(14)} ${c.name}`));
      } else if (sub === 'compose' && ctx.args[1] === 'up') {
        ctx.print(`\x1b[1;34m[+] Running 2/2\x1b[0m\n ⠿ Container db      Created\n ⠿ Container web     Created\n\x1b[1;32m⠿ Container db      Started\x1b[0m\n\x1b[1;32m⠿ Container web     Started\x1b[0m`);
      } else if (sub === 'swarm' && ctx.args[1] === 'init') {
        ctx.print(`Swarm initialized: current node (node-1) is now a manager.`);
        ctx.print(`To add a worker to this swarm, run the following command:\n  docker swarm join --token SWMTKN-1-abc... 192.168.1.1:2377`);
      } else if (sub === 'service' && ctx.args[1] === 'create') {
        const name = ctx.args.find(a => a.startsWith('--name'))?.split('=')[1] || 'myservice';
        ctx.print(`Service created: ${name} (ID: ${Math.random().toString(36).substring(2, 10)})`);
      } else if (sub === 'images') {
        ctx.print('REPOSITORY     TAG       IMAGE ID');
        getImages().forEach((img: string) => ctx.print(`${img.split(':')[0].padEnd(14)} ${img.split(':')[1].padEnd(9)} ba627c2e3661`));
      } else {
        ctx.print('Uso: docker [pull|run|ps|images|compose up|swarm init|service create]');
      }
    }
  },
  {
    name: 'singularity',
    description: 'Plataforma de containers para HPC e Ciência',
    help: 'singularity [COMANDO] [OPÇÕES]\n\nFoco em segurança e ambientes científicos.\n\nComandos:\n  pull [url]      Baixa imagem do Sylabs/Docker Hub (.sif)\n  build [img]     Cria uma imagem a partir de uma receita\n  exec [img] [cmd] Executa um comando dentro do container\n  run [img]       Executa o script padrão do container\n  shell [img]     Inicia um shell interativo\n  inspect [img]   Mostra metadados da imagem',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      const img = ctx.args[1] || 'ubuntu.sif';

      if (sub === 'pull') {
        ctx.print(`INFO:    Converting SIF file to temporary sandbox...`);
        ctx.print(`INFO:    Creating SIF file...`);
        ctx.print(`\x1b[1;32mINFO:    Build complete: ${img.split('/').pop() || 'image.sif'}\x1b[0m`);
      } else if (sub === 'exec') {
        ctx.print(`\x1b[1;30m(Singularity: ${img})\x1b[0m\n${ctx.user}`);
      } else if (sub === 'run') {
        ctx.print(`Iniciando ambiente científico em ${img}...`);
        ctx.print(`Ubuntu 22.04 LTS (Singularity Instance)`);
      } else if (sub === 'shell') {
        ctx.print(`Singularity> \x1b[1;30m(Simulando shell... digite 'exit' para sair)\x1b[0m`);
      } else if (sub === 'build') {
        ctx.print(`INFO:    Starting build...`);
        ctx.print(`INFO:    Running post-install scripts...`);
        ctx.print(`\x1b[1;32mINFO:    Build complete: ${img}\x1b[0m`);
      } else {
        ctx.print('Uso: singularity [pull|build|exec|run|shell|inspect]');
      }
    }
  },
  {
    name: 'apptainer',
    description: 'O sucessor do Singularity (HPC)',
    help: 'apptainer [COMANDO] [OPÇÕES]\n\nAlias moderno para o Singularity. Mesma sintaxe e funcionalidades.',
    execute: async (ctx) => {
      // Reutiliza a lógica do singularity
      const sing = packageManagerCommands.find(c => c.name === 'singularity');
      if (sing) await sing.execute(ctx);
    }
  },
  {
    name: 'pixi',
    description: 'Gerenciador moderno (Pixi)',
    help: 'pixi [COMANDO] [OPÇÕES]\n\nGerenciador de pacotes baseado em Conda para múltiplos sistemas operacionais.\n\nComandos:\n  add [pacote]    Adiciona um novo pacote ao projeto\n  remove [pkg]    Remove um pacote\n  list            Lista pacotes do projeto',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'add') {
        const pkg = ctx.args[1] || 'python';
        ctx.print(`\x1b[1;32m✔\x1b[0m \x1b[1mResolving\x1b[0m dependencies\n\x1b[1;32m✔\x1b[0m \x1b[1mDownloaded\x1b[0m ${pkg}\n\x1b[1;32m✔\x1b[0m \x1b[1mUpdated\x1b[0m pixi.lock`);
      } else if (sub === 'remove') {
        ctx.print(`\x1b[1;32m✔\x1b[0m \x1b[1mRemoved\x1b[0m ${ctx.args[1]}`);
      } else if (sub === 'list') {
        ctx.print('Package    Version    Build\n---------- ---------- -------\npython     3.11.0     h123');
      } else {
        ctx.print('pixi 0.15.0\nUsage: pixi [init|add|remove|list|run|shell]');
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
