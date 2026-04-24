import type { Command } from './types';
import { basicCommands } from './basicCommands';
import { focaCommands } from './focaCommands';
import { bioCommands } from './bioCommands';
import { extendedCommands } from './extendedCommands';
import { packageManagerCommands } from './packageManagerCommands';

export class CommandRegistry {
  private commands: Map<string, Command> = new Map();

  constructor() {
    [...basicCommands, ...focaCommands, ...bioCommands, ...extendedCommands, ...packageManagerCommands].forEach(cmd => {
      this.commands.set(cmd.name, cmd);
    });

    // Adicionar comando ajuda
    const helpCommand: Command = {
      name: 'ajuda',
      description: 'Exibe informações sobre os comandos disponíveis',
      help: 'ajuda\n\nLista todos os comandos registrados e exibe dicas de uso para iniciantes.',
      execute: async (ctx) => {
        const uniqueCommands = new Map<string, Command>();
        this.commands.forEach((cmd) => {
          if (!uniqueCommands.has(cmd.name)) {
            uniqueCommands.set(cmd.name, cmd);
          }
        });

        const sortedCommands = Array.from(uniqueCommands.values()).sort((a, b) => a.name.localeCompare(b.name));
        
        ctx.print(`\x1b[1;32m=== AMBIENTE LABIOMICS - AJUDA ===\x1b[0m`);
        ctx.print(`Total de comandos disponíveis: \x1b[1;36m${sortedCommands.length}\x1b[0m`);
        ctx.print(`\nDigite \x1b[1;33mcomando --help\x1b[0m para detalhes de uso.\n`);

        for (const cmd of sortedCommands) {
          const name = cmd.name.padEnd(15);
          ctx.print(`  \x1b[1;36m${name}\x1b[0m - ${cmd.description}`);
        }
        
        ctx.print('\n\x1b[1;33mDicas Rápidas:\x1b[0m');
        ctx.print('  \x1b[1;36mmissao\x1b[0m      - Ver o que fazer agora');
        ctx.print('  \x1b[1;36mtema\x1b[0m        - Mudar visual do prompt');
        ctx.print('  \x1b[1;36mclear\x1b[0m       - Limpar o terminal');
      }
    };
    this.commands.set('ajuda', helpCommand);
    this.commands.set('help', helpCommand);

    // O comando 'tema' e 'missao' são tratados no TerminalEngine.ts
    // mas vamos registrar aqui para aparecerem no 'ajuda'
    this.commands.set('tema', { name: 'tema', description: 'Muda o estilo visual do terminal', execute: async () => {} });
    this.commands.set('missao', { name: 'missao', description: 'Mostra o objetivo atual', execute: async () => {} });
    this.commands.set('quest', { name: 'missao', description: 'Mostra o objetivo atual', execute: async () => {} });
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  public getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }
}
