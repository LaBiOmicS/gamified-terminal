import type { Command } from './types';

export const extendedCommands: Command[] = [
  {
    name: 'wget',
    description: 'O recuperador de arquivos não interativo',
    help: 'wget URL\n\nSimula o download de um arquivo a partir de uma URL.',
    execute: async (ctx) => {
      const url = ctx.args[0];
      if (!url) { ctx.printError('wget: URL ausente'); return; }
      ctx.print(`--${new Date().toISOString()}--  ${url}\nConectando... OK\nRequisição HTTP enviada, aguardando resposta... 200 OK\nSalvando em: '${url.split('/').pop() || 'index.html'}'`);
    }
  },
  {
    name: 'curl',
    description: 'Transfere dados de ou para um servidor',
    help: 'curl [OPÇÃO]... URL\n\nOpções:\n  -I, --head    exibe apenas os cabeçalhos da resposta\n  -v, --verbose torna a operação detalhada',
    execute: async (ctx) => {
      const url = ctx.args.find(a => !a.startsWith('-'));
      if (!url) { ctx.printError('curl: use --help para mais informações'); return; }
      if (ctx.args.includes('-v')) ctx.print(`*   Trying 127.0.0.1:80...\n* Connected to ${url} port 80`);
      ctx.print(`<html><body>Simulando resposta de ${url}</body></html>`);
    }
  },
  {
    name: 'tar',
    description: 'Utilitário de arquivamento',
    help: 'tar [OPÇÃO]... [ARQUIVO]...\n\nOpções: -c (criar), -x (extrair), -v (detalhado), -z (gzip), -f (arquivo)',
    execute: async (ctx) => {
      ctx.print(`Arquivado com sucesso.`);
    }
  },
  {
    name: 'grep',
    description: 'Busca padrões em arquivos usando expressões regulares',
    help: 'grep [OPÇÃO]... PADRÃO [ARQUIVO]...\n\nExemplo:\n  grep "seq1" genome.fa',
    execute: async (ctx) => {
      ctx.print('seq1: ATGCGTACGTG\nseq10: GCTAGCTAGCT');
    }
  },
  {
    name: 'find',
    description: 'Busca arquivos em uma hierarquia de diretórios',
    help: 'find [CAMINHO] [EXPRESSÃO]\n\nExemplo:\n  find . -name "*.fa"',
    execute: async (ctx) => {
      ctx.print('./data/seq1.fa\n./data/seq2.fa\n./ref/genome.fa');
    }
  },
  {
    name: 'diff',
    description: 'Compara arquivos linha por linha',
    help: 'diff ARQUIVO1 ARQUIVO2\n\nExibe as diferenças entre dois arquivos.',
    execute: async (ctx) => {
      ctx.print('--- arquivo1\n+++ arquivo2\n- ATGC\n+ ATGG');
    }
  },
  {
    name: 'sed',
    description: 'Editor de fluxo para filtrar e transformar texto',
    help: 'sed EXPRESSÃO [ARQUIVO]\n\nExemplo:\n  sed "s/antigo/novo/g" arquivo.txt',
    execute: async (ctx) => { ctx.print('Simulando transformação de fluxo...'); }
  },
  {
    name: 'awk',
    description: 'Linguagem de busca e processamento de padrões',
    help: 'awk \'PADRÃO { AÇÃO }\' [ARQUIVO]\n\nExemplo:\n  awk \'{print $1}\' tabela.txt',
    execute: async (ctx) => { ctx.print('Simulando processamento de colunas...'); }
  },
  {
    name: 'sort',
    description: 'Ordena linhas de arquivos de texto',
    help: 'sort [OPÇÃO]... [ARQUIVO]\n\nOpções:\n  -n   numérica\n  -r   inverso',
    execute: async (ctx) => {
      ctx.print('Linha 1\nLinha 2\nLinha 3');
    }
  },
  {
    name: 'uname',
    description: 'Imprime informações do sistema',
    help: 'uname [OPÇÃO]...\n\nOpções:\n  -a, --all    todas as informações\n  -r           versão do kernel',
    execute: async (ctx) => {
      ctx.print('Linux LaBiOmicS 5.15.0-generic #1 SMP x86_64 GNU/Linux');
    }
  },
  {
    name: 'hostname',
    description: 'Exibe o nome do host do sistema',
    help: 'hostname\n\nExibe o nome do nó na rede.',
    execute: async (ctx) => { ctx.print('LaBiOmicS'); }
  },
  {
    name: 'kill',
    description: 'Envia um sinal para um processo',
    help: 'kill PID\n\nEnvia o sinal TERM para o processo especificado.',
    execute: async (ctx) => {
      if (ctx.args[0]) ctx.print(`Processo ${ctx.args[0]} encerrado.`);
    }
  },
  {
    name: 'export',
    description: 'Define variáveis de ambiente',
    help: 'export NOME=VALOR\n\nExporta variáveis para processos filhos.',
    execute: async (ctx) => { ctx.print('Variável exportada.'); }
  },
  {
    name: 'env',
    description: 'Exibe as variáveis de ambiente',
    help: 'env\n\nLista todas as variáveis de ambiente da sessão.',
    execute: async (ctx) => { ctx.print('USER=dayhoff\nSHELL=/bin/bash\nHOME=/home/dayhoff'); }
  },
  {
    name: 'sleep',
    description: 'Atrasa por uma quantidade de tempo',
    help: 'sleep NÚMERO\n\nPausa a execução por N segundos.',
    execute: async (ctx) => {
      const sec = parseInt(ctx.args[0] || '1');
      await new Promise(r => setTimeout(r, Math.min(sec * 1000, 3000)));
    }
  },
  {
    name: 'which',
    description: 'Localiza um comando',
    help: 'which COMANDO\n\nMostra o caminho completo do executável.',
    execute: async (ctx) => { ctx.print(`/usr/bin/${ctx.args[0] || 'bash'}`); }
  },
  {
    name: 'locate',
    description: 'Busca arquivos pelo nome em um banco de dados',
    help: 'locate NOME\n\nExemplo:\n  locate samtools',
    execute: async (ctx) => { ctx.print('/usr/bin/samtools\n/usr/share/man/man1/samtools.1.gz'); }
  },
  {
    name: 'xargs',
    description: 'Constrói e executa comandos a partir da entrada padrão',
    help: 'xargs [COMANDO]\n\nExemplo:\n  find . -name "*.txt" | xargs rm',
    execute: async (ctx) => { ctx.print('Simulando execução em lote...'); }
  }
];
