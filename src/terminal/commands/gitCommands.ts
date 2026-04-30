import type { Command } from './types';

export const gitCommands: Command[] = [
  {
    name: 'git',
    description: 'O sistema de controle de versão distribuído',
    help: 'git [subcomando] [opções]\n\nSubcomandos comuns:\n  init      Inicializa um repositório\n  status    Mostra o estado do diretório de trabalho\n  add       Adiciona arquivos ao índice (staging)\n  commit    Grava as alterações no repositório\n  log       Exibe o histórico de commits\n  remote    Gerencia repositórios remotos\n  push      Envia alterações para o remoto\n  pull      Recebe alterações do remoto\n  clone     Clona um repositório existente',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      const args = ctx.args.slice(1);

      if (!sub) {
        ctx.print('uso: git <comando> [<args>]\n\nDigite \'git --help\' para ver os comandos disponíveis.');
        return;
      }

      // Simulação simples de estado do Git no localStorage
      const getGitState = () => JSON.parse(localStorage.getItem('git_state') || '{"init": false, "staged": [], "commits": [], "remotes": {}}');
      const saveGitState = (state: any) => localStorage.setItem('git_state', JSON.stringify(state));

      const state = getGitState();

      switch (sub) {
        case 'init':
          state.init = true;
          saveGitState(state);
          ctx.vfs.mkdir(ctx.vfs.resolvePath('.git'));
          ctx.print('Repositório Git vazio inicializado em /home/dayhoff/.git/');
          break;

        case 'status':
          if (!state.init) {
            ctx.printError('fatal: nem um repositório git (nem qualquer um dos diretórios pai): .git');
            return;
          }
          ctx.print('No ramo main');
          if (state.staged.length === 0) {
            ctx.print('Nada para registrar, diretório de trabalho limpo (ou arquivos não rastreados)');
          } else {
            ctx.print('Mudanças para serem registradas:');
            state.staged.forEach((f: string) => ctx.print(`  \x1b[32mmodificado:   ${f}\x1b[0m`));
          }
          break;

        case 'add':
          if (!state.init) { ctx.printError('fatal: nem um repositório git'); return; }
          const fileToAdd = args[0] || '.';
          state.staged.push(fileToAdd);
          saveGitState(state);
          ctx.print(`Arquivos adicionados ao índice: ${fileToAdd}`);
          break;

        case 'commit':
          if (!state.init) { ctx.printError('fatal: nem um repositório git'); return; }
          const msgAttr = args.indexOf('-m');
          const msg = msgAttr !== -1 ? args[msgAttr + 1] : 'Commit sem mensagem';
          if (state.staged.length === 0) {
            ctx.print('Nada para registrar (índice vazio)');
            return;
          }
          const commit = { id: Math.random().toString(16).substring(2, 9), msg, date: new Date().toISOString() };
          state.commits.push(commit);
          state.staged = [];
          saveGitState(state);
          ctx.print(`[main ${commit.id}] ${msg}\n 1 file changed, 1 insertion(+)`);
          break;

        case 'log':
          if (!state.init) { ctx.printError('fatal: nem um repositório git'); return; }
          if (state.commits.length === 0) {
            ctx.print('fatal: seu ramo atual \'main\' não possui nenhum commit ainda');
            return;
          }
          state.commits.slice().reverse().forEach((c: any) => {
            ctx.print(`\x1b[33mcommit ${c.id}\x1b[0m\nAuthor: dayhoff <dayhoff@labiomics.com>\nDate:   ${c.date}\n\n    ${c.msg}\n`);
          });
          break;

        case 'remote':
          if (!state.init) { ctx.printError('fatal: nem um repositório git'); return; }
          if (args[0] === 'add') {
            const name = args[1];
            const url = args[2];
            state.remotes[name] = url;
            saveGitState(state);
            ctx.print(`Remoto ${name} adicionado: ${url}`);
          } else {
            Object.keys(state.remotes).forEach(r => ctx.print(r));
          }
          break;

        case 'push':
          if (!state.init) { ctx.printError('fatal: nem um repositório git'); return; }
          const remote = args[0] || 'origin';
          if (!state.remotes[remote]) {
            ctx.printError(`fatal: \'${remote}\' não parece ser um repositório git`);
            return;
          }
          ctx.print(`Enumerando objetos: 5, concluído.\nContando objetos: 100% (5/5), concluído.\nDelta compression using up to 8 threads\nCompressing objects: 100% (3/3), concluído.\nWriting objects: 100% (3/3), 324 bytes | 324.00 KiB/s, concluído.\nTotal 3 (delta 1), reused 0 (delta 0), pack-reused 0\nTo ${state.remotes[remote]}\n   ${state.commits[state.commits.length-1]?.id || 'initial'}..main  main -> main`);
          break;

        case 'clone':
          const url = args[0];
          if (!url) { ctx.printError('fatal: você deve especificar um repositório para clonar'); return; }
          const folder = url.split('/').pop()?.replace('.git', '') || 'repo';
          ctx.print(`Clonando em \'${folder}\'...\nremote: Enumerating objects: 12, done.\nremote: Counting objects: 100% (12/12), done.\nremote: Compressing objects: 100% (8/8), done.\nremote: Total 12 (delta 2), reused 10 (delta 1), pack-reused 0\nRecebendo objetos: 100% (12/12), 4.56 KiB | 4.56 MiB/s, concluído.`);
          ctx.vfs.mkdir(ctx.vfs.resolvePath(folder));
          break;

        case 'pull':
          if (!state.init) { ctx.printError('fatal: nem um repositório git'); return; }
          ctx.print(`Atualizando branch main...\nremote: Enumerating objects: 4, done.\nremote: Counting objects: 100% (4/4), done.\nUnpacking objects: 100% (4/4), 1.23 KiB | 1.23 MiB/s, concluído.\nFrom github.com:user/repo\n   a1b2c3d..e5f6g7h  main       -> origin/main\nUpdating a1b2c3d..e5f6g7h\nFast-forward\n README.md | 2 +- \n 1 file changed, 1 insertion(+), 1 deletion(-)`);
          break;

        default:
          ctx.print(`git: \'${sub}\' não é um comando git. Veja \'git --help\'.`);
      }
    }
  }
];
