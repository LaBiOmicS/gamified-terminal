import type { Command } from './types';

export const devopsCommands: Command[] = [
  {
    name: 'jq',
    description: 'Processador de JSON via linha de comando',
    help: 'jq [OPÇÕES] FILTRO [ARQUIVO]\n\nExemplo:\n  jq ".status" config.json',
    execute: async (ctx) => {
      const filter = ctx.args[0];
      if (filter === '.status') {
        ctx.print('"success"');
      } else {
        ctx.print('{\n  "name": "aramas",\n  "version": "1.2.0",\n  "status": "active"\n}');
      }
    }
  },
  {
    name: 'terraform',
    description: 'Ferramenta para construir, alterar e versionar infraestrutura com segurança',
    help: 'terraform [COMANDO] [OPÇÕES]\n\nComandos:\n  init      Prepara o diretório de trabalho\n  plan      Mostra mudanças planejadas\n  apply     Aplica as mudanças\n  destroy   Remove a infraestrutura gerenciada',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'init') {
        ctx.print('Initializing the backend...\nInitializing provider plugins...\n\x1b[1;32mTerraform has been successfully initialized!\x1b[0m');
      } else if (sub === 'plan') {
        ctx.print('Terraform used the selected providers to generate the following execution plan:');
        ctx.print('  + create aws_instance.web\n  + create aws_db_instance.db');
        ctx.print('\n\x1b[1mPlan:\x1b[0m 2 to add, 0 to change, 0 to destroy.');
      } else {
        ctx.print('Usage: terraform [init|plan|apply|destroy]');
      }
    }
  },
  {
    name: 'gitlab-runner',
    description: 'Agente do GitLab CI/CD',
    help: 'gitlab-runner [COMANDO]\n\nComandos:\n  verify    Verifica os runners registrados\n  register  Registra um novo runner',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'verify') {
        ctx.print('Verifying runner... is alive\x1b[1;32m [OK]\x1b[0m');
      } else {
        ctx.print('Usage: gitlab-runner [verify|register|run]');
      }
    }
  }
];
