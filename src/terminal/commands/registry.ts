import type { Command } from './types';
import { basicCommands } from './basicCommands';
import { focaCommands } from './focaCommands';

export class CommandRegistry {
  private commands: Map<string, Command> = new Map();

  constructor() {
    [...basicCommands, ...focaCommands].forEach(cmd => {
      this.commands.set(cmd.name, cmd);
    });

    // Adicionar comando ajuda
    const helpCommand: Command = {
      name: 'ajuda',
      description: 'Exibe informações sobre os comandos disponíveis',
      execute: async (ctx) => {
        ctx.print('Comandos disponíveis:');
        const sortedNames = Array.from(this.commands.keys()).sort();
        ctx.print(sortedNames.join('  '));
        ctx.print('\nDigite \'ajuda <comando>\' para mais informações (TODO).');
      }
    };
    this.commands.set('ajuda', helpCommand);
    this.commands.set('help', helpCommand);
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  public getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }
}
