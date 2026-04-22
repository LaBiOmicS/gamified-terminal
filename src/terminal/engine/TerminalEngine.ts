import { Terminal } from '@xterm/xterm';
import { VFSManager } from '../vfs/VFSManager';
import { CommandRegistry } from '../commands/registry';
import type { CommandContext } from '../commands/types';
import { QuestManager } from './QuestManager';

export class TerminalEngine {
  private vfs: VFSManager;
  private registry: CommandRegistry;
  private questManager: QuestManager;
  private terminal: Terminal;
  private currentLine: string = '';
  private history: string[] = [];
  private historyIndex: number = -1;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
    
    // Load from localStorage
    const savedVFS = localStorage.getItem('vfs_state');
    this.vfs = new VFSManager(savedVFS ? JSON.parse(savedVFS) : undefined);
    
    this.registry = new CommandRegistry();
    
    const savedQuestIndex = localStorage.getItem('quest_index');
    this.questManager = new QuestManager(savedQuestIndex ? parseInt(savedQuestIndex) : 0);
    
    this.terminal.onData(e => this.handleData(e));
    this.terminal.write('\x1b[1;33mWelcome to the Linux Learning Temple!\x1b[0m\r\n');
    this.terminal.write('Type \x1b[1;36mquest\x1b[0m to see your current objective.\r\n');
    this.printPrompt();
  }

  private printPrompt() {
    const cwd = this.vfs.getCwd();
    const shortCwd = cwd.replace('/home/dayhoff', '~');
    this.terminal.write(`\r\n\x1b[1;32mdayhoff@LaBiOmicS\x1b[0m:\x1b[1;34m${shortCwd}\x1b[0m$ `);
  }

  private async handleData(data: string) {
    switch (data) {
      case '\r': // Enter
        await this.handleEnter();
        break;
      case '\u007F': // Backspace
        this.handleBackspace();
        break;
      case '\u001b[A': // Up arrow
        this.handleHistory(-1);
        break;
      case '\u001b[B': // Down arrow
        this.handleHistory(1);
        break;
      default:
        if (data >= ' ' && data <= '~') {
          this.currentLine += data;
          this.terminal.write(data);
        }
    }
  }

  private saveState() {
    localStorage.setItem('vfs_state', JSON.stringify(this.vfs.getState()));
    localStorage.setItem('quest_index', this.questManager.getCurrentIndex().toString());
  }

  private async handleEnter() {
    const line = this.currentLine.trim();
    this.terminal.write('\r\n');
    
    if (line) {
      this.history.push(line);
      this.historyIndex = this.history.length;
      await this.executeCommand(line);
    }
    
    // Check quest progress after each command
    const completed = this.questManager.checkProgress(this.vfs);
    if (completed) {
      this.terminal.write(`\r\n\x1b[1;32mQUEST COMPLETED: ${completed.title}\x1b[0m\r\n`);
      this.terminal.write(`${completed.completionMessage}\r\n`);
      
      const next = this.questManager.getCurrentQuest();
      if (next) {
        this.terminal.write(`\r\n\x1b[1;33mNEW QUEST: ${next.title}\x1b[0m\r\n`);
        this.terminal.write(`${next.description}\r\n`);
      } else {
        this.terminal.write(`\r\n\x1b[1;35mCongratulations! You have completed all quests!\x1b[0m\r\n`);
      }
    }
    
    this.saveState();
    this.currentLine = '';
    this.printPrompt();
  }

  private handleBackspace() {
    if (this.currentLine.length > 0) {
      this.currentLine = this.currentLine.slice(0, -1);
      this.terminal.write('\b \b');
    }
  }

  private handleHistory(dir: number) {
    const newIndex = this.historyIndex + dir;
    if (newIndex >= 0 && newIndex < this.history.length) {
      // Clear current line
      for (let i = 0; i < this.currentLine.length; i++) {
        this.terminal.write('\b \b');
      }
      this.historyIndex = newIndex;
      this.currentLine = this.history[this.historyIndex];
      this.terminal.write(this.currentLine);
    }
  }

  private async executeCommand(line: string) {
    const parts = line.split(/\s+/);
    const cmdName = parts[0];
    const args = parts.slice(1);

    if (cmdName === 'quest') {
      const q = this.questManager.getCurrentQuest();
      if (q) {
        this.terminal.write(`\x1b[1;33mCURRENT QUEST: ${q.title}\x1b[0m\r\n`);
        this.terminal.write(`${q.description}\r\n`);
        this.terminal.write(`Hint: ${q.hint}\r\n`);
      } else {
        this.terminal.write('No active quest.\r\n');
      }
      return;
    }

    const command = this.registry.getCommand(cmdName);
    if (command) {
      const context: CommandContext = {
        vfs: this.vfs,
        args,
        print: (text) => this.terminal.write(text.replace(/\n/g, '\r\n') + '\r\n'),
        printError: (text) => this.terminal.write(`\x1b[31m${text}\x1b[0m\r\n`),
        clear: () => this.terminal.clear(),
      };
      try {
        await command.execute(context);
      } catch (err) {
        this.terminal.write(`\x1b[31mError executing command: ${err}\x1b[0m\r\n`);
      }
    } else {
      this.terminal.write(`${cmdName}: command not found\r\n`);
    }
  }
}
