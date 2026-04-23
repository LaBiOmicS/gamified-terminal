import type { Command } from './types';

export const bioCommands: Command[] = [
  {
    name: 'bio-count',
    description: 'Conta a frequência de bases (A, T, C, G) em uma sequência ou arquivo',
    execute: async (ctx) => {
      let input = ctx.args[0];
      if (!input) {
        ctx.printError('Uso: bio-count [sequência ou arquivo]');
        return;
      }

      // Tenta ler como arquivo, se falhar usa como string literal
      const fileContent = ctx.vfs.readFile(input);
      const sequence = (fileContent || input).toUpperCase();
      
      const counts: Record<string, number> = { A: 0, T: 0, C: 0, G: 0, N: 0 };
      for (const char of sequence) {
        if (counts[char] !== undefined) counts[char]++;
        else if (/[A-Z]/.test(char)) counts['N']++;
      }

      ctx.print('\x1b[1;32mRelatório de Sequência:\x1b[0m');
      ctx.print(`  A: ${counts.A}`);
      ctx.print(`  T: ${counts.T}`);
      ctx.print(`  C: ${counts.C}`);
      ctx.print(`  G: ${counts.G}`);
      if (counts.N > 0) ctx.print(`  Outros/N: ${counts.N}`);
      
      const total = counts.A + counts.T + counts.C + counts.G + counts.N;
      const gc = ((counts.G + counts.C) / (counts.A + counts.T + counts.C + counts.G) * 100).toFixed(2);
      ctx.print(`  Total: ${total} bp`);
      ctx.print(`  Conteúdo GC: ${gc}%`);
    }
  },
  {
    name: 'bio-rev-comp',
    description: 'Gera o complemento reverso de uma sequência de DNA',
    execute: async (ctx) => {
      let input = ctx.args[0];
      if (!input) {
        ctx.printError('Uso: bio-rev-comp [sequência ou arquivo]');
        return;
      }

      const fileContent = ctx.vfs.readFile(input);
      const sequence = (fileContent || input).toUpperCase();
      
      const complement: Record<string, string> = {
        'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C',
        'N': 'N', 'R': 'Y', 'Y': 'R', 'S': 'S', 'W': 'W'
      };

      const revComp = sequence
        .split('')
        .reverse()
        .map(base => complement[base] || base)
        .join('');

      ctx.print(revComp);
    }
  },
  {
    name: 'fasta-view',
    description: 'Visualiza arquivos FASTA com destaque de cor',
    execute: async (ctx) => {
      const path = ctx.args[0];
      if (!path) {
        ctx.printError('Uso: fasta-view [arquivo]');
        return;
      }

      const content = ctx.vfs.readFile(path);
      if (content === null) {
        ctx.printError(`fasta-view: ${path}: Arquivo não encontrado`);
        return;
      }

      const lines = content.split('\n');
      for (const line of lines) {
        if (line.startsWith('>')) {
          ctx.print(`\x1b[1;34m${line}\x1b[0m`);
        } else {
          const colored = line.replace(/A/g, '\x1b[1;32mA\x1b[0m')
                             .replace(/T/g, '\x1b[1;31mT\x1b[0m')
                             .replace(/C/g, '\x1b[1;33mC\x1b[0m')
                             .replace(/G/g, '\x1b[1;36mG\x1b[0m');
          ctx.print(colored);
        }
      }
    }
  }
];
