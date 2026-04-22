import { VFSManager } from '../vfs/VFSManager';

export interface Quest {
  id: string;
  title: string;
  description: string;
  hint: string;
  checkCondition: (vfs: VFSManager) => boolean;
  completionMessage: string;
}

export const quests: Quest[] = [
  {
    id: 'intro-1',
    title: 'Welcome to the Temple',
    description: 'First, find out where you are. Use the command to print your current working directory.',
    hint: 'Try using \'pwd\'.',
    checkCondition: (vfs) => true, // Just an intro
    completionMessage: 'Great! You are in /home/student. This is your home.',
  },
  {
    id: 'ls-1',
    title: 'The Surroundings',
    description: 'List the files in your current directory to see what is around you.',
    hint: 'Try using \'ls\'.',
    checkCondition: (vfs) => true,
    completionMessage: 'Excellent. You can see your files now.',
  },
  {
    id: 'mkdir-1',
    title: 'Creating Space',
    description: 'Create a new directory called \'practice\'.',
    hint: 'Try \'mkdir practice\'.',
    checkCondition: (vfs) => {
      const node = vfs.getNode('/home/student/practice');
      return !!node && node.type === 'directory';
    },
    completionMessage: 'Well done! You have created your first directory.',
  },
  {
    id: 'cd-1',
    title: 'Moving In',
    description: 'Change your current directory to the \'practice\' folder you just created.',
    hint: 'Try \'cd practice\'.',
    checkCondition: (vfs) => vfs.getCwd() === '/home/student/practice',
    completionMessage: 'You are moving like a pro!',
  },
  {
    id: 'echo-1',
    title: 'Writing History',
    description: 'Create a file named \'note.txt\' containing the text \'Hello Linux\'.',
    hint: 'Try \'echo Hello Linux > note.txt\'.',
    checkCondition: (vfs) => {
      const content = vfs.readFile('/home/student/practice/note.txt');
      return content?.trim() === 'Hello Linux';
    },
    completionMessage: 'You just wrote your first file!',
  }
];

export class QuestManager {
  private currentQuestIndex: number = 0;
  private completedQuests: Set<string> = new Set();

  constructor(initialIndex: number = 0) {
    this.currentQuestIndex = initialIndex;
  }

  public getCurrentIndex(): number {
    return this.currentQuestIndex;
  }

  public getCurrentQuest(): Quest | null {
    if (this.currentQuestIndex < quests.length) {
      return quests[this.currentQuestIndex];
    }
    return null;
  }

  public checkProgress(vfs: VFSManager): Quest | null {
    const current = this.getCurrentQuest();
    if (current && current.checkCondition(vfs)) {
      this.completedQuests.add(current.id);
      this.currentQuestIndex++;
      return current;
    }
    return null;
  }

  public getProgress(): string {
    return `${this.currentQuestIndex}/${quests.length}`;
  }
}
