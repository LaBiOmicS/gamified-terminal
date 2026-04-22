import type { Command } from './types';
import { basicCommands } from './basicCommands';
import { focaCommands } from './focaCommands';

export class CommandRegistry {
  private commands: Map<string, Command> = new Map();

  constructor() {
    [...basicCommands, ...focaCommands].forEach(cmd => {
      this.commands.set(cmd.name, cmd);
    });

    // Add help command
    this.commands.set('help', {
      name: 'help',
      description: 'Display information about available commands',
      execute: async (ctx) => {
        ctx.print('Available commands:');
        const sortedNames = Array.from(this.commands.keys()).sort();
        ctx.print(sortedNames.join('  '));
        ctx.print('\nType \'help <command>\' for more info (TODO).');
      }
    });
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  public getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }
}
