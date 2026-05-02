import { VFSManager } from '../vfs/VFSManager';

export type QuestCategory = 
  | 'Sistemas Operacionais' 
  | 'Manipulação de Dados' 
  | 'Computação Científica' 
  | 'Versionamento'
  | 'Automação & Scripting'
  | 'Redes e Segurança'
  | 'DevOps e Infraestrutura';

export interface Stats {
  sudoCount: number;
  pipeCount: number;
  envCount: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: Stats) => boolean;
}

export interface Quest {
  id: string;
  category: QuestCategory;
  title: string;
  description: string;
  hint: string;
  xp: number;
  checkCondition: (vfs: VFSManager, lastCommand: string, fullLine: string) => boolean;
  completionMessage: string;
}

export interface Rank {
  name: string;
  minXp: number;
}

export const RANKS: Rank[] = [
  { name: 'Novato(a)', minXp: 0 },
  { name: 'Iniciante', minXp: 1000 },
  { name: 'Intermediário(a)', minXp: 3000 },
  { name: 'Avançado(a)', minXp: 7000 },
  { name: 'Especialista', minXp: 15000 },
  { name: 'Mestre da Bioinformática', minXp: 30000 },
  { name: 'Analista de Sistemas Pleno', minXp: 50000 },
  { name: 'Engenheiro(a) DevOps', minXp: 80000 },
  { name: 'Arquiteto(a) de Infraestrutura', minXp: 120000 }
];

export const quests: Quest[] = [
  // --- MÓDULO 1: SISTEMAS OPERACIONAIS (Básico -> Admin) ---
  {
    id: 'so-1',
    category: 'Sistemas Operacionais',
    title: 'Exploração Inicial',
    description: 'Para começar, você precisa saber o que há no seu diretório atual. Liste os arquivos e pastas disponíveis.',
    hint: 'Use o comando \'ls\'.',
    xp: 100,
    checkCondition: (_, cmd) => cmd === 'ls',
    completionMessage: 'Primeiro passo dado! O comando ls é fundamental.',
  },
  {
    id: 'so-2',
    category: 'Sistemas Operacionais',
    title: 'Arquivos Invisíveis',
    description: 'No Linux, arquivos que começam com ponto (.) são ocultos. Liste todos os arquivos, incluindo os ocultos.',
    hint: 'Tente adicionar a flag \'-a\' ao comando: \'ls -a\'.',
    xp: 150,
    checkCondition: (_, __, line) => line.includes('ls') && line.includes('-a'),
    completionMessage: 'Você descobriu os segredos ocultos do sistema!',
  },
  {
    id: 'so-3',
    category: 'Sistemas Operacionais',
    title: 'Onde estou?',
    description: 'Às vezes nos perdemos entre pastas. Descubra o caminho completo (path) do diretório onde você está agora.',
    hint: 'Use o comando \'pwd\' (Print Working Directory).',
    xp: 100,
    checkCondition: (_, cmd) => cmd === 'pwd',
    completionMessage: 'Localização confirmada! Você está em /home/dayhoff.',
  },
  {
    id: 'so-4',
    category: 'Sistemas Operacionais',
    title: 'Criando Espaço',
    description: 'Estando no seu diretório inicial (~), crie uma nova pasta chamada \'experimentos\' para organizar seus arquivos.',
    hint: 'Use \'mkdir experimentos\'. O comando mkdir cria diretórios.',
    xp: 150,
    checkCondition: (vfs) => vfs.getNode('/home/dayhoff/experimentos') !== null,
    completionMessage: 'Diretório criado com sucesso! Organização é tudo.',
  },
  {
    id: 'so-5',
    category: 'Sistemas Operacionais',
    title: 'Entrando na Pasta',
    description: 'Agora que a pasta existe, mude o seu terminal para dentro do diretório \'experimentos\'.',
    hint: 'Use \'cd experimentos\'. O comando cd serve para mudar de diretório.',
    xp: 100,
    checkCondition: (vfs) => vfs.getCwd() === '/home/dayhoff/experimentos',
    completionMessage: 'Navegação concluída. Agora você está "dentro" da pasta.',
  },
  {
    id: 'so-6',
    category: 'Sistemas Operacionais',
    title: 'Novo Registro',
    description: 'Certifique-se de estar dentro de \'experimentos\'. Crie um arquivo vazio chamado \'notas.txt\' para suas anotações.',
    hint: 'Use \'touch notas.txt\'. O comando touch cria arquivos vazios.',
    xp: 150,
    checkCondition: (vfs) => vfs.getNode('/home/dayhoff/experimentos/notas.txt') !== null,
    completionMessage: 'Arquivo criado! Você começou a documentar seu trabalho.',
  },
  {
    id: 'so-7',
    category: 'Sistemas Operacionais',
    title: 'Voltando para Casa',
    description: 'Saia da pasta \'experimentos\' e retorne ao seu diretório inicial (~).',
    hint: 'Use \'cd ..\' para subir um nível ou apenas \'cd\' para ir direto ao home.',
    xp: 100,
    checkCondition: (vfs) => vfs.getCwd() === '/home/dayhoff',
    completionMessage: 'Bem-vindo de volta ao diretório principal.',
  },
  {
    id: 'so-8',
    category: 'Sistemas Operacionais',
    title: 'Cópia de Segurança',
    description: 'Estando no seu diretório inicial (~), faça uma cópia do arquivo \'Dockerfile\' com o nome de \'Dockerfile.bak\'.',
    hint: 'A sintaxe é \'cp <origem> <destino>\'. Tente \'cp Dockerfile Dockerfile.bak\'.',
    xp: 200,
    checkCondition: (vfs) => vfs.getNode('/home/dayhoff/Dockerfile.bak') !== null,
    completionMessage: 'Backup garantido. Sempre bom ter uma cópia!',
  },
  {
    id: 'so-9',
    category: 'Sistemas Operacionais',
    title: 'Renomeando',
    description: 'Sem sair do seu diretório atual (~), mude o nome do arquivo \'notas.txt\' (que está em experimentos) para \'projeto.txt\'.',
    hint: 'O comando mv renomeia ou move arquivos. Use \'mv experimentos/notas.txt experimentos/projeto.txt\'.',
    xp: 200,
    checkCondition: (vfs) => vfs.getNode('/home/dayhoff/experimentos/projeto.txt') !== null && vfs.getNode('/home/dayhoff/experimentos/notas.txt') === null,
    completionMessage: 'Arquivo renomeado com sucesso.',
  },
  {
    id: 'so-10',
    category: 'Sistemas Operacionais',
    title: 'Limpeza Seletiva',
    description: 'Agora que você já sabe como copiar, remova o arquivo de backup \'Dockerfile.bak\' que você criou anteriormente.',
    hint: 'Use \'rm Dockerfile.bak\'. Cuidado: o comando rm é permanente!',
    xp: 150,
    checkCondition: (vfs) => vfs.getNode('/home/dayhoff/Dockerfile.bak') === null,
    completionMessage: 'Espaço liberado. O sistema agradece.',
  },
  {
    id: 'so-11',
    category: 'Sistemas Operacionais',
    title: 'Lendo o Conteúdo',
    description: 'Exiba o conteúdo completo do arquivo \'environment.yml\' diretamente no terminal.',
    hint: 'Use o comando \'cat environment.yml\'.',
    xp: 150,
    checkCondition: (_, cmd, line) => cmd === 'cat' && line.includes('environment.yml'),
    completionMessage: 'Leitura concluída. Você viu as configurações do ambiente.',
  },
  {
    id: 'so-12',
    category: 'Sistemas Operacionais',
    title: 'Primeiras Linhas',
    description: 'Para arquivos grandes, não queremos ler tudo. Veja apenas as primeiras 10 linhas do arquivo \'environment.yml\'.',
    hint: 'Use \'head environment.yml\'. Por padrão, o head mostra o topo do arquivo.',
    xp: 150,
    checkCondition: (_, cmd) => cmd === 'head',
    completionMessage: 'Cabeçalho visualizado. Rápido e eficiente.',
  },
  {
    id: 'so-13',
    category: 'Sistemas Operacionais',
    title: 'Poder de Root',
    description: 'Tente listar o conteúdo do diretório restrito \'/root\'. Você precisará usar privilégios de administrador.',
    hint: 'Use \'sudo ls /root\'. O sudo (superuser do) permite executar comandos como administrador.',
    xp: 300,
    checkCondition: (_, cmd, line) => cmd === 'sudo' && line.includes('ls /root'),
    completionMessage: 'Privilégios administrativos utilizados! Com grandes poderes...',
  },
  {
    id: 'so-14',
    category: 'Sistemas Operacionais',
    title: 'Identidade Digital',
    description: 'Verifique qual é o seu nome de usuário atual no sistema para confirmar seus privilégios.',
    hint: 'Use o comando \'whoami\'.',
    xp: 100,
    checkCondition: (_, cmd) => cmd === 'whoami',
    completionMessage: 'Você é o usuário dayhoff. Identidade confirmada.',
  },
  {
    id: 'so-15',
    category: 'Sistemas Operacionais',
    title: 'Permissão de Execução',
    description: 'O arquivo \'Makefile\' precisa ser executável. Adicione a permissão de execução (+x) para ele.',
    hint: 'Use \'chmod +x Makefile\'. Chmod altera permissões (Change Mode).',
    xp: 250,
    checkCondition: (_, cmd, line) => cmd === 'chmod' && line.includes('+x'),
    completionMessage: 'Agora o arquivo pode ser executado pelo sistema.',
  },
  {
    id: 'so-16',
    category: 'Sistemas Operacionais',
    title: 'Saúde do Disco',
    description: 'Verifique o espaço disponível em todas as partições do disco em um formato de fácil leitura.',
    hint: 'Use \'df -h\'. A flag -h significa "human-readable" (legível para humanos).',
    xp: 200,
    checkCondition: (_, cmd, line) => cmd === 'df' && line.includes('-h'),
    completionMessage: 'Relatório de armazenamento obtido. Tudo sob controle.',
  },
  {
    id: 'so-17',
    category: 'Sistemas Operacionais',
    title: 'Uso de Memória',
    description: 'Verifique quanto de memória RAM o sistema está utilizando no momento.',
    hint: 'Use o comando \'free -h\'. Novamente, o -h ajuda na leitura.',
    xp: 200,
    checkCondition: (_, cmd) => cmd === 'free' || cmd === 'mem',
    completionMessage: 'Status da memória verificado.',
  },
  {
    id: 'so-18',
    category: 'Sistemas Operacionais',
    title: 'Painel de Controle',
    description: 'Veja quais processos estão consumindo mais CPU e memória em tempo real.',
    hint: 'Use o comando \'top\'. Pressione \'q\' para sair do painel no Linux real.',
    xp: 250,
    checkCondition: (_, cmd) => cmd === 'top',
    completionMessage: 'Gerenciador de tarefas visualizado com sucesso.',
  },
  {
    id: 'so-19',
    category: 'Sistemas Operacionais',
    title: 'Histórico de Comandos',
    description: 'Esqueceu o que digitou? Reveja a lista dos últimos comandos executados nesta sessão.',
    hint: 'Use o comando \'history\'.',
    xp: 100,
    checkCondition: (_, cmd) => cmd === 'history',
    completionMessage: 'Memória do terminal consultada. Útil para repetir tarefas.',
  },
  {
    id: 'so-20',
    category: 'Sistemas Operacionais',
    title: 'Informações do Sistema',
    description: 'Obtenha detalhes sobre a versão do kernel Linux e a arquitetura do processador.',
    hint: 'Use \'uname -a\'. O -a mostra todas (all) as informações disponíveis.',
    xp: 200,
    checkCondition: (_, cmd, line) => cmd === 'uname' && line.includes('-a'),
    completionMessage: 'Você conhece o coração do sistema agora.',
  },

  // --- MÓDULO 2: MANIPULAÇÃO DE DADOS (Filtros -> Pipelines) ---
  {
    id: 'data-1',
    category: 'Manipulação de Dados',
    title: 'Coleta Web',
    description: 'Faça o download de um arquivo de dados de um servidor remoto simulado.',
    hint: 'Use \'wget http://labiomics.com/data.zip\'. Wget é um coletor web via terminal.',
    xp: 200,
    checkCondition: (_, cmd) => cmd === 'wget' || cmd === 'curl',
    completionMessage: 'Dados coletados! Você sabe baixar arquivos via linha de comando.',
  },
  {
    id: 'data-2',
    category: 'Manipulação de Dados',
    title: 'Compactando Projetos',
    description: 'Estando no seu diretório inicial (~), compacte a pasta \'experimentos\' inteira em um arquivo chamado \'backup.tar\'.',
    hint: 'Use \'tar -cvf backup.tar experimentos\'. Flags: -c (create), -v (verbose), -f (file).',
    xp: 300,
    checkCondition: (_, cmd, line) => cmd === 'tar' && line.includes('-c'),
    completionMessage: 'Pasta empacotada. Excelente para transferir múltiplos arquivos.',
  },
  {
    id: 'data-3',
    category: 'Manipulação de Dados',
    title: 'Extração de Dados',
    description: 'Agora que você tem um pacote, extraia o conteúdo do arquivo \'backup.tar\' no diretório atual.',
    hint: 'Use \'tar -xvf backup.tar\'. A flag -x significa extract (extrair).',
    xp: 300,
    checkCondition: (_, cmd, line) => cmd === 'tar' && line.includes('-x'),
    completionMessage: 'Dados extraídos com sucesso.',
  },
  {
    id: 'data-4',
    category: 'Manipulação de Dados',
    title: 'Busca de Padrões',
    description: 'Encontre todas as linhas que contenham a palavra \'bioconda\' dentro do arquivo \'environment.yml\'.',
    hint: 'Use \'grep bioconda environment.yml\'. Grep é a ferramenta de busca de texto.',
    xp: 250,
    checkCondition: (_, cmd, line) => cmd === 'grep' && line.includes('bioconda'),
    completionMessage: 'Padrão localizado! Grep é indispensável na Bioinfo.',
  },
  {
    id: 'data-5',
    category: 'Manipulação de Dados',
    title: 'Contagem de Itens',
    description: 'Descubra quantas linhas de texto existem no arquivo \'environment.yml\'.',
    hint: 'Use \'wc -l environment.yml\'. O comando wc (word count) com -l conta linhas.',
    xp: 200,
    checkCondition: (_, cmd, line) => cmd === 'wc' && line.includes('-l'),
    completionMessage: 'Contagem concluída. Você já sabe o tamanho do arquivo.',
  },
  {
    id: 'data-6',
    category: 'Manipulação de Dados',
    title: 'Mestre dos Pipes',
    description: 'Combine os comandos grep e wc usando um Pipe (|) para contar quantas vezes \'samtools\' aparece no arquivo.',
    hint: 'Tente \'grep samtools environment.yml | wc -l\'. O Pipe passa a saída de um para o outro.',
    xp: 400,
    checkCondition: (_, __, line) => line.includes('|') && line.includes('grep') && line.includes('wc'),
    completionMessage: 'Mestre dos Pipes! Você aprendeu a criar fluxos de dados.',
  },
  {
    id: 'data-7',
    category: 'Manipulação de Dados',
    title: 'Ordenação Alfabética',
    description: 'Coloque as linhas do arquivo \'environment.yml\' em ordem alfabética para facilitar a leitura.',
    hint: 'Use o comando \'sort environment.yml\'.',
    xp: 200,
    checkCondition: (_, cmd) => cmd === 'sort',
    completionMessage: 'Tudo em ordem. Organização visual é importante.',
  },
  {
    id: 'data-8',
    category: 'Manipulação de Dados',
    title: 'Removendo Duplicatas',
    description: 'Use um pipe para ordenar o arquivo \'lista.txt\' e remover todas as linhas repetidas consecutivas.',
    hint: 'Use \'sort lista.txt | uniq\'. O comando uniq remove duplicatas de listas ordenadas.',
    xp: 300,
    checkCondition: (_, __, line) => line.includes('sort') && line.includes('uniq'),
    completionMessage: 'Lista limpa e sem duplicatas. Dados prontos para análise.',
  },
  {
    id: 'data-9',
    category: 'Manipulação de Dados',
    title: 'Substituição de Texto',
    description: 'Substitua todas as ocorrências de \'samtools\' por \'bcftools\' na exibição do arquivo \'environment.yml\'.',
    hint: 'Use \'sed "s/samtools/bcftools/g" environment.yml\'. Sed é um editor de fluxo potente.',
    xp: 350,
    checkCondition: (_, cmd) => cmd === 'sed',
    completionMessage: 'Edição de fluxo concluída. Você alterou o texto sem abrir um editor.',
  },
  {
    id: 'data-10',
    category: 'Manipulação de Dados',
    title: 'Colunas de Dados',
    description: 'Use a ferramenta awk para extrair e imprimir apenas a primeira coluna de cada linha do arquivo.',
    hint: 'Use \'awk "{print $1}" environment.yml\'. Awk é excelente para arquivos em colunas.',
    xp: 400,
    checkCondition: (_, cmd) => cmd === 'awk',
    completionMessage: 'Manipulação de colunas efetuada. Útil para arquivos TSV/CSV.',
  },
  {
    id: 'data-11',
    category: 'Manipulação de Dados',
    title: 'Redirecionamento de Saída',
    description: 'Execute o comando \'ls\' e salve o resultado em um novo arquivo chamado \'arquivos.txt\' em vez de exibir na tela.',
    hint: 'Use \'ls > arquivos.txt\'. O símbolo \'>\' redireciona a saída para um arquivo.',
    xp: 250,
    checkCondition: (vfs) => vfs.getNode('/home/dayhoff/arquivos.txt') !== null,
    completionMessage: 'Saída capturada! Você aprendeu a salvar resultados de comandos.',
  },
  {
    id: 'data-12',
    category: 'Manipulação de Dados',
    title: 'Diferenças de Arquivos',
    description: 'Compare os arquivos \'arq1\' e \'arq2\' e veja quais linhas foram alteradas ou adicionadas.',
    hint: 'Use o comando \'diff arq1 arq2\'.',
    xp: 250,
    checkCondition: (_, cmd) => cmd === 'diff',
    completionMessage: 'Diferenças detectadas. Ótimo para conferir versões de scripts.',
  },
  {
    id: 'data-13',
    category: 'Manipulação de Dados',
    title: 'Busca de Arquivos',
    description: 'Encontre todos os arquivos que terminam com \'.yml\' em qualquer lugar abaixo do diretório atual.',
    hint: 'Use \'find . -name "*.yml"\'. O ponto (.) indica o diretório atual.',
    xp: 300,
    checkCondition: (_, cmd) => cmd === 'find',
    completionMessage: 'Localizado! O comando find é muito poderoso.',
  },
  {
    id: 'data-14',
    category: 'Manipulação de Dados',
    title: 'Processamento em Lote',
    description: 'Use xargs para passar uma lista de nomes de arquivos como argumentos para o comando grep.',
    hint: 'Exemplo: \'find . -name "*.txt" | xargs grep "bioconda"\'.',
    xp: 450,
    checkCondition: (_, __, line) => line.includes('xargs'),
    completionMessage: 'Automação avançada! Você sabe processar múltiplos arquivos de uma vez.',
  },
  {
    id: 'data-15',
    category: 'Manipulação de Dados',
    title: 'Build Automatizado',
    description: 'Execute o comando de build padrão para compilar o projeto simulado usando as instruções do Makefile.',
    hint: 'Basta digitar \'make\'. O comando make lê o arquivo Makefile e executa as regras.',
    xp: 500,
    checkCondition: (_, cmd) => cmd === 'make',
    completionMessage: 'Sistema compilado com sucesso via Makefile.',
  },

  // --- MÓDULO 3: VERSIONAMENTO (Git & GitHub) ---
  {
    id: 'git-1',
    category: 'Versionamento',
    title: 'Iniciando o Repositório',
    description: 'O primeiro passo para usar Git é transformar uma pasta comum em um repositório. Inicialize o Git no seu diretório atual.',
    hint: 'Use o comando \'git init\'. Isso criará uma pasta oculta .git.',
    xp: 200,
    checkCondition: (_, __, line) => line.includes('git init'),
    completionMessage: 'Repositório inicializado! Agora o Git está vigiando suas mudanças.',
  },
  {
    id: 'git-2',
    category: 'Versionamento',
    title: 'Verificando o Estado',
    description: 'É fundamental saber o que o Git está vendo. Verifique o estado atual do seu repositório.',
    hint: 'Use \'git status\'. Ele mostrará arquivos modificados, novos ou prontos para commit.',
    xp: 150,
    checkCondition: (_, __, line) => line.includes('git status'),
    completionMessage: 'Estado verificado. O status é seu melhor amigo no Git.',
  },
  {
    id: 'git-3',
    category: 'Versionamento',
    title: 'Preparando Arquivos',
    description: 'Antes de registrar uma mudança, você deve "estagiar" (stage) os arquivos. Adicione o arquivo \'environment.yml\' ao índice.',
    hint: 'Use \'git add environment.yml\'. O add prepara as mudanças para o commit.',
    xp: 200,
    checkCondition: (_, __, line) => line.includes('git add'),
    completionMessage: 'Arquivo estagiado! Ele está na "área de preparação".',
  },
  {
    id: 'git-4',
    category: 'Versionamento',
    title: 'Registrando Mudanças',
    description: 'Agora grave as mudanças estagiadas no histórico do repositório com uma mensagem descritiva.',
    hint: 'Use \'git commit -m "Adicionando configurações"\'. O -m define a mensagem.',
    xp: 300,
    checkCondition: (_, __, line) => line.includes('git commit'),
    completionMessage: 'Commit realizado! Você criou um ponto na história do seu projeto.',
  },
  {
    id: 'git-5',
    category: 'Versionamento',
    title: 'Histórico de Versões',
    description: 'Veja a lista de todos os commits (registros) feitos até agora no repositório.',
    hint: 'Use \'git log\'. Cada commit tem um autor, data e um código único (hash).',
    xp: 200,
    checkCondition: (_, __, line) => line.includes('git log'),
    completionMessage: 'Logs visualizados. Você pode viajar no tempo com o Git!',
  },
  {
    id: 'git-6',
    category: 'Versionamento',
    title: 'Conectando ao GitHub',
    description: 'Para enviar seu código para o GitHub, você precisa adicionar um "remoto". Adicione um remoto chamado \'origin\'.',
    hint: 'Use \'git remote add origin https://github.com/usuario/projeto.git\'.',
    xp: 300,
    checkCondition: (_, __, line) => line.includes('git remote add'),
    completionMessage: 'Remoto configurado! Seu repositório local agora conhece o GitHub.',
  },
  {
    id: 'git-7',
    category: 'Versionamento',
    title: 'Enviando para a Nuvem',
    description: 'Suba seus commits locais para o servidor remoto (GitHub) no ramo main.',
    hint: 'Use \'git push origin main\'. Isso sincroniza seu trabalho com o mundo.',
    xp: 400,
    checkCondition: (_, __, line) => line.includes('git push'),
    completionMessage: 'Push concluído! Seu código agora está seguro no GitHub.',
  },
  {
    id: 'git-8',
    category: 'Versionamento',
    title: 'Colaborando e Clonando',
    description: 'Baixe um projeto existente do GitHub para o seu computador criando uma cópia local.',
    hint: 'Use \'git clone https://github.com/outro/projeto.git\'.',
    xp: 350,
    checkCondition: (_, __, line) => line.includes('git clone'),
    completionMessage: 'Repositório clonado! É assim que começamos a colaborar em projetos abertos.',
  },
  {
    id: 'git-9',
    category: 'Versionamento',
    title: 'Sincronizando Mudanças',
    description: 'Traga as últimas atualizações do repositório remoto para a sua máquina local.',
    hint: 'Use \'git pull origin main\'. Isso mantém seu código local atualizado.',
    xp: 300,
    checkCondition: (_, __, line) => line.includes('git pull'),
    completionMessage: 'Repositório atualizado! Você está em sincronia com a equipe.',
  },

  // --- MÓDULO 4: COMPUTAÇÃO CIENTÍFICA (HPC & Bioinfo) ---
  {
    id: 'science-1',
    category: 'Computação Científica',
    title: 'Ambiente de Análise',
    description: 'Crie um novo ambiente virtual isolado chamado \'genomica\' usando o gerenciador de pacotes mamba.',
    hint: 'Use \'mamba create -n genomica\'. Ambientes isolados evitam conflitos de software.',
    xp: 400,
    checkCondition: () => {
      const envs = JSON.parse(localStorage.getItem('terminal_envs') || '[]');
      return envs.includes('genomica');
    },
    completionMessage: 'Ambiente criado! Isolamento é a chave para a reprodutibilidade.',
  },
  {
    id: 'science-2',
    category: 'Computação Científica',
    title: 'Ativando Ferramentas',
    description: 'Ative o ambiente \'genomica\' que você acabou de criar para começar a instalar ferramentas bioinformáticas.',
    hint: 'Use \'conda activate genomica\'. Note que o prompt mudará para indicar o ambiente ativo.',
    xp: 300,
    checkCondition: () => localStorage.getItem('current_env') === 'genomica',
    completionMessage: 'Ambiente ativo. Agora as ferramentas instaladas ficarão aqui.',
  },
  {
    id: 'science-3',
    category: 'Computação Científica',
    title: 'Instalando Samtools',
    description: 'Estando no ambiente \'genomica\', instale a ferramenta \'samtools\' usando o mamba.',
    hint: 'Use \'mamba install samtools\'. Isso simula a instalação via repositório Bioconda.',
    xp: 400,
    checkCondition: () => {
      const env = localStorage.getItem('current_env') || 'base';
      const pkgs = JSON.parse(localStorage.getItem(`pkgs_${env}`) || '[]');
      return pkgs.includes('samtools');
    },
    completionMessage: 'Software instalado! Você agora tem o samtools disponível.',
  },
  {
    id: 'science-4',
    category: 'Computação Científica',
    title: 'Sequências de DNA',
    description: 'Utilize a ferramenta bio-count para analisar a frequência de nucleotídeos (A, T, G, C) em uma sequência.',
    hint: 'Use \'bio-count ATGCATGC\'. Tente com diferentes sequências!',
    xp: 300,
    checkCondition: (_, cmd) => cmd === 'bio-count',
    completionMessage: 'Análise concluída. Ferramentas específicas de bioinfo são o seu arsenal.',
  },
  {
    id: 'science-5',
    category: 'Computação Científica',
    title: 'Visualizador Genômico',
    description: 'Visualize o conteúdo formatado e colorido do arquivo de genoma \'ref.fa\'.',
    hint: 'Use \'fasta-view ref.fa\'. Essa ferramenta facilita a leitura visual de arquivos FASTA.',
    xp: 300,
    checkCondition: (_, cmd) => cmd === 'fasta-view',
    completionMessage: 'Visualização completa. Ver as sequências ajuda a entender os dados.',
  },
  {
    id: 'science-6',
    category: 'Computação Científica',
    title: 'Qualidade de Reads',
    description: 'Execute o FastQC no arquivo de leituras \'reads.fq\' para gerar um relatório de qualidade.',
    hint: 'Use \'fastqc reads.fq\'. O controle de qualidade é sempre o primeiro passo.',
    xp: 500,
    checkCondition: (_, cmd) => cmd === 'fastqc',
    completionMessage: 'Controle de Qualidade executado. Analise os gráficos gerados!',
  },
  {
    id: 'science-7',
    category: 'Computação Científica',
    title: 'Limpeza de Leituras',
    description: 'Use a ferramenta fastp para remover adaptadores e bases de baixa qualidade do arquivo \'reads.fq\'.',
    hint: 'Use \'fastp -i reads.fq -o clean.fq\'. Flags: -i (input), -o (output).',
    xp: 500,
    checkCondition: (_, cmd) => cmd === 'fastp',
    completionMessage: 'Leituras limpas (trimmed). Seus dados estão prontos para o alinhamento.',
  },
  {
    id: 'science-8',
    category: 'Computação Científica',
    title: 'Indexação do Genoma',
    description: 'Antes de alinhar, você precisa criar um índice do genoma de referência (\'ref.fa\') usando a ferramenta bwa.',
    hint: 'Use \'bwa index ref.fa\'. Isso cria arquivos auxiliares para acelerar o mapeamento.',
    xp: 400,
    checkCondition: (_, cmd, line) => cmd === 'bwa' && line.includes('index'),
    completionMessage: 'Genoma indexado. O bwa agora sabe navegar rapidamente pela referência.',
  },
  {
    id: 'science-9',
    category: 'Computação Científica',
    title: 'Alinhamento de Reads',
    description: 'Mapeie as sequências (\'reads.fq\') contra a referência (\'ref.fa\') e salve o resultado em \'aln.sam\'.',
    hint: 'Use \'bwa mem ref.fa reads.fq > aln.sam\'. bwa mem é o padrão para alinhamento.',
    xp: 600,
    checkCondition: (_, cmd, line) => cmd === 'bwa' && line.includes('mem'),
    completionMessage: 'Alinhamento concluído! Você mapeou as reads no genoma.',
  },
  {
    id: 'science-10',
    category: 'Computação Científica',
    title: 'Ordenação de BAM',
    description: 'Converta e ordene seu arquivo de alinhamento para que ele possa ser processado com eficiência.',
    hint: 'Use \'samtools sort aln.sam -o aln.sorted.bam\'. Arquivos BAM são versões binárias comprimidas de SAM.',
    xp: 400,
    checkCondition: (_, cmd, line) => cmd === 'samtools' && line.includes('sort'),
    completionMessage: 'Arquivo ordenado e convertido para BAM. Menor espaço e maior velocidade.',
  },
  {
    id: 'science-11',
    category: 'Computação Científica',
    title: 'Chamada de Variantes',
    description: 'Use o bcftools para identificar polimorfismos e mutações (SNPs) a partir do alinhamento ordenado.',
    hint: 'Use \'bcftools call -mv aln.sorted.bam > var.vcf\'. O resultado é um arquivo VCF (Variant Call Format).',
    xp: 700,
    checkCondition: (_, cmd) => cmd === 'bcftools',
    completionMessage: 'Variantes identificadas! Você encontrou as diferenças genéticas.',
  },
  {
    id: 'science-12',
    category: 'Computação Científica',
    title: 'Pipeline Snakemake',
    description: 'Simule a execução de um pipeline de bioinformática completo definido no arquivo \'Snakefile\'.',
    hint: 'Use \'snakemake -n\'. A flag -n (dry-run) apenas mostra o que seria executado.',
    xp: 800,
    checkCondition: (_, cmd) => cmd === 'snakemake',
    completionMessage: 'Workflow automatizado! Snakemake gerencia a complexidade para você.',
  },
  {
    id: 'science-13',
    category: 'Computação Científica',
    title: 'Container Docker',
    description: 'Baixe uma imagem de software pré-configurada do repositório Bioconda no Docker Hub.',
    hint: 'Use \'docker pull bioconda/samtools\'. Containers garantem que o software rode igual em qualquer lugar.',
    xp: 500,
    checkCondition: (_, cmd, line) => cmd === 'docker' && line.includes('pull'),
    completionMessage: 'Imagem Docker baixada. Você domina o uso de containers.',
  },
  {
    id: 'science-14',
    category: 'Computação Científica',
    title: 'HPC com Singularity',
    description: 'Abra um terminal interativo dentro de um container Singularity, comum em clusters de alto desempenho (HPC).',
    hint: 'Use \'singularity shell image.sif\'. Singularity é a alternativa segura ao Docker para HPC.',
    xp: 600,
    checkCondition: (_, cmd) => cmd === 'singularity' || cmd === 'apptainer',
    completionMessage: 'Ambiente HPC isolado acessado com sucesso.',
  },
  {
    id: 'science-15',
    category: 'Computação Científica',
    title: 'Fila do Cluster',
    description: 'Verifique o status da fila de processamento do cluster Slurm para monitorar seus jobs.',
    hint: 'Use o comando \'squeue\'. Ele lista todos os jobs aguardando ou rodando no cluster.',
    xp: 400,
    checkCondition: (_, cmd) => cmd === 'squeue',
    completionMessage: 'Status do cluster verificado. Seu treinamento básico está completo!',
  },

  // --- MÓDULO 5: AUTOMAÇÃO & SCRIPTING ---
  {
    id: 'script-1',
    category: 'Automação & Scripting',
    title: 'O Primeiro Script',
    description: 'Crie um arquivo chamado \'ola.sh\' que contenha o shebang padrão do bash (#!/bin/bash).',
    hint: 'Use \'echo "#!/bin/bash" > ola.sh\'. Scripts Linux geralmente começam com o shebang.',
    xp: 500,
    checkCondition: (vfs) => {
      const node = vfs.getNode('/home/dayhoff/ola.sh');
      return node !== null && node.type === 'file' && node.content.includes('#!/bin/bash');
    },
    completionMessage: 'Script criado! O shebang indica ao sistema qual interpretador usar.',
  },
  {
    id: 'script-2',
    category: 'Automação & Scripting',
    title: 'Variáveis de Ambiente',
    description: 'Defina uma variável de ambiente chamada PROJETO com o valor \'genomica\' e verifique-a.',
    hint: 'Use \'export PROJETO=genomica\'. Depois você pode ver com \'env\'.',
    xp: 400,
    checkCondition: (_, cmd, line) => cmd === 'export' && line.includes('PROJETO=genomica'),
    completionMessage: 'Variável exportada. Elas são essenciais para configurar fluxos de trabalho.',
  },
  {
    id: 'script-3',
    category: 'Automação & Scripting',
    title: 'Execução de Scripts',
    description: 'Dê permissão de execução para o seu script \'ola.sh\' e execute-o simulando o comando bash.',
    hint: 'Use \'chmod +x ola.sh\' e depois \'bash ola.sh\'.',
    xp: 500,
    checkCondition: (_, cmd, line) => cmd === 'bash' && line.includes('ola.sh'),
    completionMessage: 'Script executado! Você agora sabe como rodar automações.',
  },
  {
    id: 'script-4',
    category: 'Automação & Scripting',
    title: 'Loops no Terminal',
    description: 'Use um loop FOR diretamente no terminal para criar 3 arquivos: amostra_1.txt, amostra_2.txt e amostra_3.txt.',
    hint: 'Exemplo: \'for i in 1 2 3; do touch amostra_$i.txt; done\'.',
    xp: 800,
    checkCondition: (vfs) => 
      vfs.getNode('/home/dayhoff/amostra_1.txt') !== null && 
      vfs.getNode('/home/dayhoff/amostra_2.txt') !== null && 
      vfs.getNode('/home/dayhoff/amostra_3.txt') !== null,
    completionMessage: 'Loop concluído! Automação em linha de comando economiza muito tempo.',
  },
  {
    id: 'script-5',
    category: 'Automação & Scripting',
    title: 'Agendamento Crontab',
    description: 'Simule a visualização das suas tarefas agendadas no sistema.',
    hint: 'Use o comando \'crontab -l\'. O cron é o agendador padrão do Linux.',
    xp: 400,
    checkCondition: (_, cmd) => cmd === 'crontab',
    completionMessage: 'Agendamentos verificados. Essencial para backups e limpezas automáticas.',
  },

  // --- MÓDULO 6: REDES E SEGURANÇA ---
  {
    id: 'net-1',
    category: 'Redes e Segurança',
    title: 'Teste de Conectividade',
    description: 'Verifique se o servidor de banco de dados genômico (simulado como google.com) está respondendo.',
    hint: 'Use \'ping -c 4 google.com\'. O ping testa a latência e conectividade.',
    xp: 400,
    checkCondition: (_, cmd) => cmd === 'ping',
    completionMessage: 'Conexão confirmada. O servidor está ativo e acessível.',
  },
  {
    id: 'net-2',
    category: 'Redes e Segurança',
    title: 'Chaves de Segurança',
    description: 'Gere um par de chaves SSH (pública/privada) para autenticação sem senha em servidores remotos.',
    hint: 'Use \'ssh-keygen\'. Pressione enter para as opções padrão.',
    xp: 600,
    checkCondition: (_, cmd) => cmd === 'ssh-keygen',
    completionMessage: 'Chaves geradas! A segurança baseada em chaves é o padrão profissional.',
  },
  {
    id: 'net-3',
    category: 'Redes e Segurança',
    title: 'Acesso Remoto',
    description: 'Simule um acesso remoto via SSH ao servidor de processamento \'hpc-cluster\'.',
    hint: 'Use \'ssh user@hpc-cluster\'.',
    xp: 500,
    checkCondition: (_, cmd) => cmd === 'ssh',
    completionMessage: 'Login remoto efetuado. Você agora pode gerenciar máquinas à distância.',
  },
  {
    id: 'net-4',
    category: 'Redes e Segurança',
    title: 'Donos e Grupos',
    description: 'Mude o dono do arquivo \'projeto.txt\' para o usuário \'root\' (você precisará de privilégios).',
    hint: 'Use \'sudo chown root projeto.txt\'.',
    xp: 600,
    checkCondition: (_, cmd, line) => line.includes('chown') && line.includes('root'),
    completionMessage: 'Propriedade alterada. O controle de acesso é vital em sistemas multiusuário.',
  },
  {
    id: 'net-5',
    category: 'Redes e Segurança',
    title: 'Transferência Segura',
    description: 'Simule o envio de um arquivo para um servidor remoto usando SCP.',
    hint: 'Use \'scp projeto.txt user@remote:/tmp\'.',
    xp: 500,
    checkCondition: (_, cmd) => cmd === 'scp',
    completionMessage: 'Arquivo transferido com segurança via túnel criptografado.',
  },

  // --- MÓDULO 7: PROCESSAMENTO AVANÇADO DE DADOS ---
  {
    id: 'data-adv-1',
    category: 'Manipulação de Dados',
    title: 'Monitoramento de Logs',
    description: 'Acompanhe as últimas linhas de um arquivo de log que está sendo atualizado.',
    hint: 'Use \'tail -f access.log\'. (Nota: no simulador, use Ctrl+C para parar ou apenas execute o comando).',
    xp: 400,
    checkCondition: (_, cmd) => cmd === 'tail',
    completionMessage: 'Monitoramento iniciado. O comando tail -f é essencial para debug em tempo real.',
  },
  {
    id: 'data-adv-2',
    category: 'Manipulação de Dados',
    title: 'Mestre do JSON com jq',
    description: 'Filtre um arquivo JSON para extrair apenas o campo "status".',
    hint: 'Use \'jq ".status" config.json\'. O jq é o padrão para processar JSON no terminal.',
    xp: 600,
    checkCondition: (_, cmd) => cmd === 'jq',
    completionMessage: 'JSON processado! Você domina a manipulação de APIs via terminal.',
  },
  {
    id: 'data-adv-3',
    category: 'Manipulação de Dados',
    title: 'Regex com Sed',
    description: 'Use o sed para remover todos os números de um arquivo de texto.',
    hint: 'Use \'sed "s/[0-9]//g" dados.txt\'. Expressões regulares são seu superpoder.',
    xp: 700,
    checkCondition: (_, cmd, line) => cmd === 'sed' && line.includes('[0-9]'),
    completionMessage: 'Filtro por regex concluído. Seus dados estão limpos.',
  },
  {
    id: 'data-adv-4',
    category: 'Manipulação de Dados',
    title: 'Estatísticas com Awk',
    description: 'Use o awk para somar os valores da segunda coluna de um arquivo CSV (separado por vírgula).',
    hint: 'Use \'awk -F "," "{sum += $2} END {print sum}" tabela.csv\'.',
    xp: 800,
    checkCondition: (_, cmd, line) => cmd === 'awk' && line.includes('sum'),
    completionMessage: 'Cálculo efetuado! Awk permite realizar análises complexas sem scripts externos.',
  },

  // --- MÓDULO 8: DEVOPS E INFRAESTRUTURA ---
  {
    id: 'devops-1',
    category: 'DevOps e Infraestrutura',
    title: 'Construindo Imagens',
    description: 'Crie uma imagem de container Docker baseada no seu Dockerfile local.',
    hint: 'Use \'docker build -t minha-app:v1 .\'.',
    xp: 1000,
    checkCondition: (_, cmd, line) => cmd === 'docker' && line.includes('build'),
    completionMessage: 'Imagem construída! Containers são a base da infraestrutura moderna.',
  },
  {
    id: 'devops-2',
    category: 'DevOps e Infraestrutura',
    title: 'Subindo Serviços',
    description: 'Execute seu container em segundo plano (detached mode).',
    hint: 'Use \'docker run -d minha-app:v1\'.',
    xp: 800,
    checkCondition: (_, cmd, line) => cmd === 'docker' && line.includes('-d'),
    completionMessage: 'Container rodando no background. O serviço está no ar.',
  },
  {
    id: 'devops-3',
    category: 'DevOps e Infraestrutura',
    title: 'Logs do Sistema',
    description: 'Verifique os logs do sistema para diagnosticar possíveis erros de boot ou serviços.',
    hint: 'Use \'journalctl -u docker.service\'.',
    xp: 600,
    checkCondition: (_, cmd) => cmd === 'journalctl',
    completionMessage: 'Logs analisados. O journalctl centraliza as mensagens do kernel e serviços.',
  },
  {
    id: 'devops-4',
    category: 'DevOps e Infraestrutura',
    title: 'Pipeline CI/CD',
    description: 'Simule a validação de um arquivo de configuração do GitLab CI.',
    hint: 'Use \'gitlab-runner verify\'.',
    xp: 700,
    checkCondition: (_, cmd) => cmd === 'gitlab-runner' || cmd === 'gh',
    completionMessage: 'Pipeline validado. Automação de entrega é o coração do DevOps.',
  },
  {
    id: 'devops-5',
    category: 'DevOps e Infraestrutura',
    title: 'Infra como Código',
    description: 'Simule o planejamento de uma infraestrutura usando Terraform.',
    hint: 'Use \'terraform plan\'.',
    xp: 1200,
    checkCondition: (_, cmd) => cmd === 'terraform',
    completionMessage: 'Plano gerado! Você atingiu o nível máximo de automação de infraestrutura. Parabéns, você é um Arquiteto!',
  },
];

export const achievements: Achievement[] = [
  { id: 'admin_badge', name: 'Administrador(a)', description: 'Usou comandos sudo com sucesso', icon: '⚡', condition: (s) => s.sudoCount > 0 },
  { id: 'pipe_badge', name: 'Mestre dos Pipes', description: 'Executou filtros complexos com pipes', icon: '🔗', condition: (s) => s.pipeCount >= 5 },
  { id: 'env_badge', name: 'Cientista de Ambientes', description: 'Gerenciou múltiplos ambientes virtuais', icon: '🧪', condition: (s) => s.envCount >= 2 }
];

export class QuestManager {
  private currentQuestIndex: number = 0;
  private totalXp: number = 0;
  private stats = { sudoCount: 0, pipeCount: 0, envCount: 1 };
  private isResetting = false;

  constructor() {
    this.loadState();
  }

  private loadState() {
    const saved = localStorage.getItem('quest_manager_state');
    if (saved) {
      const state = JSON.parse(saved);
      this.currentQuestIndex = state.index || 0;
      this.totalXp = state.xp || 0;
      this.stats = state.stats || this.stats;
    }
    const envs = JSON.parse(localStorage.getItem('terminal_envs') || '["base"]');
    this.stats.envCount = envs.length;
  }

  private saveState() {
    if (this.isResetting) return;
    localStorage.setItem('quest_manager_state', JSON.stringify({
      index: this.currentQuestIndex,
      xp: this.totalXp,
      stats: this.stats
    }));
  }

  public getRank() {
    return [...RANKS].reverse().find(r => this.totalXp >= r.minXp) || RANKS[0];
  }

  public getXP() { return this.totalXp; }
  
  public getProgressPercentage(): number {
    return Math.round((this.currentQuestIndex / quests.length) * 100);
  }

  public getCurrentQuest(): Quest | null {
    return this.currentQuestIndex < quests.length ? quests[this.currentQuestIndex] : null;
  }

  public getAchievements(): Achievement[] {
    return achievements.filter(a => a.condition(this.stats));
  }

  public reset() {
    this.isResetting = true;
    this.currentQuestIndex = 0;
    this.totalXp = 0;
    this.stats = { sudoCount: 0, pipeCount: 0, envCount: 1 };
    localStorage.removeItem('quest_manager_state');
    localStorage.removeItem('terminal_envs');
    localStorage.removeItem('current_env');
    localStorage.removeItem('vfs_state');
  }

  public checkProgress(vfs: VFSManager, lastCommand: string, fullLine: string): {quest: Quest, rankUp: boolean} | null {
    const current = this.getCurrentQuest();
    
    if (fullLine.startsWith('sudo')) this.stats.sudoCount++;
    if (fullLine.includes('|')) this.stats.pipeCount++;
    const envs = JSON.parse(localStorage.getItem('terminal_envs') || '["base"]');
    this.stats.envCount = envs.length;

    if (current && current.checkCondition(vfs, lastCommand, fullLine)) {
      const oldRank = this.getRank().name;
      this.totalXp += current.xp;
      this.currentQuestIndex++;
      const newRank = this.getRank().name;
      
      this.saveState();
      return { quest: current, rankUp: oldRank !== newRank };
    }
    
    this.saveState();
    return null;
  }
}
