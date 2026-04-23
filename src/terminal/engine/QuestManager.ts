import { VFSManager } from '../vfs/VFSManager';

export interface Quest {
  id: string;
  title: string;
  description: string;
  hint: string;
  checkCondition: (vfs: VFSManager, lastCommand: string) => boolean;
  completionMessage: string;
}

export const quests: Quest[] = [
  {
    id: 'intro-1',
    title: 'Bem-vindo ao Templo',
    description: 'Primeiro, descubra onde você está. Use o comando para imprimir seu diretório de trabalho atual.',
    hint: 'Tente usar \'pwd\'.',
    checkCondition: (_, cmd) => cmd === 'pwd',
    completionMessage: 'Ótimo! Você está em /home/dayhoff. Este é o seu lar.',
  },
  {
    id: 'ls-1',
    title: 'Explorando os Arredores',
    description: 'Liste os arquivos em seu diretório atual para ver o que há ao seu redor.',
    hint: 'Tente usar \'ls\'.',
    checkCondition: (_, cmd) => cmd === 'ls',
    completionMessage: 'Excelente. Você pode ver seus arquivos agora.',
  },
  {
    id: 'mkdir-1',
    title: 'Criando Espaço',
    description: 'Crie um novo diretório chamado \'pratica\'.',
    hint: 'Tente \'mkdir pratica\'.',
    checkCondition: (vfs, cmd) => {
      const node = vfs.getNode('/home/dayhoff/pratica');
      return cmd === 'mkdir' && !!node && node.type === 'directory';
    },
    completionMessage: 'Muito bem! Você criou seu primeiro diretório.',
  },
  {
    id: 'cd-1',
    title: 'Entrando na Pasta',
    description: 'Mude seu diretório atual para a pasta \'pratica\' que você acabou de criar.',
    hint: 'Tente \'cd pratica\'.',
    checkCondition: (vfs, cmd) => cmd === 'cd' && vfs.getCwd() === '/home/dayhoff/pratica',
    completionMessage: 'Você está se movendo como um profissional!',
  },
  {
    id: 'echo-1',
    title: 'Escrevendo a História',
    description: 'Crie um arquivo chamado \'nota.txt\' contendo o texto \'Ola Linux\'.',
    hint: 'Tente \'echo Ola Linux > nota.txt\'.',
    checkCondition: (vfs, cmd) => {
      const content = vfs.readFile('/home/dayhoff/pratica/nota.txt');
      return cmd === 'echo' && content?.trim() === 'Ola Linux';
    },
    completionMessage: 'Você acabou de escrever seu primeiro arquivo!',
  },
  {
    id: 'bio-1',
    title: 'Análise de Sequências',
    description: 'Vá até o diretório \'projetos\' e use o comando \'bio-count\' no arquivo \'genoma_curto.seq\' para ver a composição de bases.',
    hint: 'Use \'cd projetos\' e depois \'bio-count genoma_curto.seq\'.',
    checkCondition: (vfs, cmd) => {
      return cmd === 'bio-count' && vfs.getCwd().endsWith('/projetos');
    },
    completionMessage: 'Incrível! Você analisou sua primeira sequência genômica.',
  },
  {
    id: 'bio-2',
    title: 'Complemento Reverso',
    description: 'Gere o complemento reverso da sequência \'ATGC\' diretamente pelo terminal.',
    hint: 'Tente \'bio-rev-comp ATGC\'.',
    checkCondition: (_, cmd) => cmd === 'bio-rev-comp',
    completionMessage: 'Perfeito! O complemento reverso é fundamental para entender a dupla hélice.',
  },
  {
    id: 'bio-3',
    title: 'Visualização FASTA',
    description: 'Use o comando \'fasta-view\' para visualizar o arquivo \'sequencia.fasta\' com cores.',
    hint: 'Tente \'fasta-view sequencia.fasta\'.',
    checkCondition: (_, cmd) => cmd === 'fasta-view',
    completionMessage: 'Visualizar dados é o primeiro passo para grandes descobertas!',
  },
  {
    id: 'sudo-1',
    title: 'O Poder do Superusuário',
    description: 'Tente listar o conteúdo do diretório \'/root\'. Se falhar, use o poder do superusuário.',
    hint: 'Tente \'sudo ls /root\'.',
    checkCondition: (_, cmd) => cmd === 'sudo',
    completionMessage: 'Com grandes poderes vêm grandes responsabilidades!',
  },
  {
    id: 'find-1',
    title: 'O Detetive de Arquivos',
    description: 'Localize onde está o arquivo \'genoma_curto.seq\' em todo o sistema.',
    hint: 'Tente \'find / -name genoma_curto.seq\'.',
    checkCondition: (_, cmd) => cmd === 'find',
    completionMessage: 'Você encontrou! O comando find é indispensável em bioinformática.',
  },
  {
    id: 'chmod-1',
    title: 'Segredo de Estado',
    description: 'Crie um arquivo chamado \'segredo.txt\' e mude suas permissões para que apenas você possa ler (r--------).',
    hint: 'Use \'touch segredo.txt\' e depois \'chmod r-------- segredo.txt\'.',
    checkCondition: (vfs, cmd) => {
      const node = vfs.getNode('/home/dayhoff/segredo.txt');
      return cmd === 'chmod' && !!node && node.permissions === 'r--------';
    },
    completionMessage: 'Seu segredo está seguro agora!',
  },
  {
    id: 'pipe-1',
    title: 'Encanamentos de Dados',
    description: 'Liste todos os arquivos no diretório atual e filtre apenas aqueles que contêm \'seq\' no nome usando um pipe.',
    hint: 'Tente \'ls | grep seq\'.',
    checkCondition: (_, cmd) => cmd === 'ls' || cmd === 'grep', // Simplificação
    completionMessage: 'Pipes são a verdadeira magia do terminal!',
  },
  {
    id: 'env-1',
    title: 'O Laboratório Virtual',
    description: 'Para não bagunçar o sistema, crie um ambiente isolado chamado \'bioinfo\' usando o mamba.',
    hint: 'Tente \'mamba create -n bioinfo\'.',
    checkCondition: (_, cmd) => {
      const envs = JSON.parse(localStorage.getItem('terminal_envs') || '[]');
      return cmd === 'mamba' && envs.includes('bioinfo');
    },
    completionMessage: 'Excelente! Ambientes isolados garantem a reprodutibilidade da ciência.',
  },
  {
    id: 'env-2',
    title: 'Ativando os Motores',
    description: 'Agora ative o ambiente \'bioinfo\' que você acabou de criar.',
    hint: 'Tente \'conda activate bioinfo\'.',
    checkCondition: (_, cmd) => {
      return (cmd === 'conda' || cmd === 'mamba') && localStorage.getItem('current_env') === 'bioinfo';
    },
    completionMessage: 'O prompt mudou! Você agora está operando dentro do ambiente bioinfo.',
  },
  {
    id: 'bio-adv-1',
    title: 'Canivete Suíço Genômico',
    description: 'Instale a ferramenta \'samtools\' no seu ambiente atual usando o mamba.',
    hint: 'Tente \'mamba install samtools\'.',
    checkCondition: (_, cmd) => {
      const pkgs = JSON.parse(localStorage.getItem('pkgs_bioinfo') || '[]');
      return cmd === 'mamba' && pkgs.includes('samtools');
    },
    completionMessage: 'Samtools instalado! Esta é uma das ferramentas mais usadas no mundo para Bioinformática.',
  },
  {
    id: 'bio-adv-2',
    title: 'Visão de Raios-X',
    description: 'Use o comando \'samtools view\' para visualizar os alinhamentos simulados.',
    hint: 'Apenas digite \'samtools view\'.',
    checkCondition: (_, cmd) => cmd === 'samtools',
    completionMessage: 'Incrível! Você concluiu a jornada avançada de bioinformática no terminal.',
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

  public checkProgress(vfs: VFSManager, lastCommand: string): Quest | null {
    const current = this.getCurrentQuest();
    if (current && current.checkCondition(vfs, lastCommand)) {
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
