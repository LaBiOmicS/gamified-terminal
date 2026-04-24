import type { Command } from './types';

export const bioCommands: Command[] = [
  // Ferramentas Básicas
  {
    name: 'bio-count',
    description: 'Conta a frequência de bases (A, T, C, G) em uma sequência ou arquivo',
    help: 'bio-count [SEQUÊNCIA | ARQUIVO]\n\nCalcula a frequência de nucleotídeos, total de pares de bases e conteúdo GC.\nSe o argumento for um arquivo existente, lê o arquivo; caso contrário, processa a string fornecida.',
    execute: async (ctx) => {
      const input = ctx.args[0];
      if (!input) { ctx.printError('Uso: bio-count [sequência ou arquivo]'); return; }
      const fileContent = ctx.vfs.readFile(input);
      const sequence = (fileContent || input).toUpperCase();
      const counts: Record<string, number> = { A: 0, T: 0, C: 0, G: 0, N: 0 };
      for (const char of sequence) {
        if (counts[char] !== undefined) counts[char]++;
        else if (/[A-Z]/.test(char)) counts['N']++;
      }
      ctx.print('\x1b[1;32mRelatório de Sequência:\x1b[0m');
      ctx.print(`  A: ${counts.A}\n  T: ${counts.T}\n  C: ${counts.C}\n  G: ${counts.G}`);
      if (counts.N > 0) ctx.print(`  Outros/N: ${counts.N}`);
      const total = counts.A + counts.T + counts.C + counts.G + counts.N;
      const gc = total > 0 ? ((counts.G + counts.C) / (counts.A + counts.T + counts.C + counts.G) * 100).toFixed(2) : '0.00';
      ctx.print(`  Total: ${total} bp\n  Conteúdo GC: ${gc}%`);
    }
  },
  {
    name: 'bio-rev-comp',
    description: 'Gera o complemento reverso de uma sequência de DNA',
    help: 'bio-rev-comp [SEQUÊNCIA | ARQUIVO]\n\nGera a sequência complementar reversa (5\'->3\').',
    execute: async (ctx) => {
      const input = ctx.args[0];
      if (!input) { ctx.printError('Uso: bio-rev-comp [sequência ou arquivo]'); return; }
      const fileContent = ctx.vfs.readFile(input);
      const sequence = (fileContent || input).toUpperCase();
      const complement: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C', 'N': 'N' };
      const revComp = sequence.split('').reverse().map(b => complement[b] || b).join('');
      ctx.print(revComp);
    }
  },
  {
    name: 'fasta-view',
    description: 'Visualiza arquivos FASTA com destaque de cor',
    help: 'fasta-view ARQUIVO\n\nExibe o conteúdo de um arquivo FASTA com cores para os nucleotídeos.',
    execute: async (ctx) => {
      const path = ctx.args[0];
      if (!path) { ctx.printError('Uso: fasta-view [arquivo]'); return; }
      const content = ctx.vfs.readFile(path);
      if (content === null) { ctx.printError(`fasta-view: ${path}: Arquivo não encontrado`); return; }
      content.split('\n').forEach(line => {
        if (line.startsWith('>')) ctx.print(`\x1b[1;34m${line}\x1b[0m`);
        else ctx.print(line.replace(/A/g, '\x1b[1;32mA\x1b[0m').replace(/T/g, '\x1b[1;31mT\x1b[0m').replace(/C/g, '\x1b[1;33mC\x1b[0m').replace(/G/g, '\x1b[1;36mG\x1b[0m'));
      });
    }
  },

  // Controle de Qualidade (QC)
  {
    name: 'fastqc',
    description: 'Controle de qualidade de dados de sequenciamento de alto rendimento',
    help: 'fastqc [OPÇÕES] arquivo.fastq\n\nGera um relatório HTML com métricas de qualidade das leituras.',
    execute: async (ctx) => {
      if (!ctx.args[0]) { ctx.printError('Uso: fastqc seqfile1 seqfile2 .. seqfileN'); return; }
      ctx.print(`Started analysis of ${ctx.args[0]}`);
      await new Promise(r => setTimeout(r, 800));
      ctx.print(`Analysis complete for ${ctx.args[0]}\nHTML report saved to ${ctx.args[0].split('.')[0]}_fastqc.html\nZIP archive saved to ${ctx.args[0].split('.')[0]}_fastqc.zip`);
    }
  },
  {
    name: 'multiqc',
    description: 'Agrega relatórios de bioinformática em um único documento',
    help: 'multiqc [DIRETÓRIO]\n\nBusca por relatórios (ex: FastQC, STAR, Salmon) e os unifica.',
    execute: async (ctx) => {
      ctx.print(`[INFO   ]         multiqc : This is MultiQC v1.14`);
      ctx.print(`[INFO   ]         multiqc : Searching '${ctx.args[0] || '.'}'`);
      await new Promise(r => setTimeout(r, 600));
      ctx.print(`[INFO   ]         multiqc : MultiQC complete`);
    }
  },
  {
    name: 'trimmomatic',
    description: 'Aparador de leituras flexível para dados Illumina',
    help: 'trimmomatic PE/SE [arquivos] [etapas]\n\nFiltra e apara leituras de sequenciamento por qualidade e adaptadores.',
    execute: async (ctx) => {
      ctx.print(`TrimmomaticPE: Started with arguments: ${ctx.args.join(' ')}`);
      await new Promise(r => setTimeout(r, 700));
      ctx.print(`Input Read Pairs: 100000 Both Surviving: 95000 (95.00%) Dropped: 1500 (1.50%)`);
    }
  },
  {
    name: 'fastp',
    description: 'Aparador e filtrador ultra-rápido all-in-one para FASTQ',
    help: 'fastp -i in.fq -o out.fq\n\nFerramenta rápida baseada em C++ para QC e trimming.',
    execute: async (ctx) => {
      ctx.print(`total reads: 100000\ntotal bases: 15000000\nQ20 bases: 97.5%\nQ30 bases: 92.1%`);
    }
  },

  // Alinhamento / Mapeamento
  {
    name: 'bwa',
    description: 'Burrows-Wheeler Aligner para mapeamento de leituras contra genoma de referência',
    help: 'bwa mem ref.fa read1.fq [read2.fq]\n\nRealiza o alinhamento de leituras (reads) utilizando o algoritmo BWA-MEM.',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'index') ctx.print(`[bwa_index] Pack FASTA... 0.05 sec\n[bwa_index] Construct BWT... done`);
      else if (sub === 'mem') ctx.print(`[M::bwa_idx_load] loaded index\n[M::mem_process_seqs] Processed 100000 reads`);
      else ctx.print(`Usage: bwa <command> [options]`);
    }
  },
  {
    name: 'bowtie2',
    description: 'Alinhador rápido e sensível de leituras para genomas longos',
    help: 'bowtie2 -x <bt2-idx> {-1 <m1> -2 <m2> | -U <r>} -S <sam>\n\nConstrói índices e mapeia leituras de DNA.',
    execute: async (ctx) => {
      ctx.print(`95.00% overall alignment rate`);
    }
  },
  {
    name: 'minimap2',
    description: 'Alinhador versátil para sequências de DNA/RNA',
    help: 'minimap2 -a ref.fa query.fq > aln.sam\n\nEspecialmente bom para reads longos (PacBio/Nanopore) ou genomas completos.',
    execute: async (ctx) => {
      ctx.print(`[main] Version: 2.24-r1122\n[main] CMD: minimap2 ${ctx.args.join(' ')}\n[main] Real time: 1.304 sec`);
    }
  },
  {
    name: 'star',
    description: 'Spliced Transcripts Alignment to a Reference',
    help: 'STAR --genomeDir [dir] --readFilesIn [fastq]\n\nAlinhador ultra-rápido otimizado para dados de RNA-Seq.',
    execute: async (ctx) => {
      ctx.print(`Apr 23 14:00:46 ..... finished successfully`);
    }
  },

  // Manipulação de SAM/BAM
  {
    name: 'samtools',
    description: 'Ferramentas para manipular alinhamentos de sequências (SAM/BAM/CRAM)',
    help: 'samtools [COMANDO] [OPÇÕES]\n\nComandos:\n  view       Exibe ou converte arquivos SAM/BAM\n  sort       Ordena um arquivo BAM\n  index      Cria um índice (.bai)\n  flagstat   Resumo estatístico',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'view') ctx.print('r001\t163\tchr1\t7\t30\t8M2I4M\t*');
      else if (sub === 'flagstat') ctx.print('100000 + 0 in total\n95000 + 0 mapped (95.00%)');
      else ctx.print('Usage: samtools <command> [options]');
    }
  },
  {
    name: 'picard',
    description: 'Conjunto de ferramentas para manipular formatos de dados HTS',
    help: 'picard [Ferramenta] [Opções...]\n\nExemplo:\n  picard MarkDuplicates I=input.bam O=marked.bam M=metrics.txt',
    execute: async (ctx) => {
      ctx.print(`INFO    PicardCommandLine       Invoking ${ctx.args[0] || 'Help'}\nINFO    Successfully completed!`);
    }
  },

  // Chamada de Variantes
  {
    name: 'gatk',
    description: 'Genome Analysis Toolkit (Chamada de variantes e genotipagem)',
    help: 'gatk [Ferramenta] [Opções]\n\nDesenvolvido pelo Broad Institute, padrão-ouro para análise de variantes.',
    execute: async (ctx) => {
      ctx.print(`14:15:30.000 INFO  GATK - Shutting down engine\nElapsed time: 0.50 minutes.`);
    }
  },
  {
    name: 'bcftools',
    description: 'Utilitários para chamar e manipular arquivos VCF e BCF',
    help: 'bcftools [COMANDO] [OPÇÕES]\n\nComandos: mpileup, call, view, filter.',
    execute: async (ctx) => {
      ctx.print(`Program: bcftools (Tools for variant calling and manipulating VCFs)`);
    }
  },
  {
    name: 'freebayes',
    description: 'Chamador genético de variantes baseado em haplótipos (Bayesiano)',
    help: 'freebayes -f ref.fa aln.bam > var.vcf\n\nDescobre SNPs, Indels e variantes complexas.',
    execute: async (ctx) => {
      ctx.print(`##fileformat=VCFv4.2\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO`);
    }
  },
  {
    name: 'vcftools',
    description: 'Ferramentas de análise de arquivos VCF',
    help: 'vcftools --vcf input.vcf [opções] --recode\n\nAnalisa, filtra e manipula dados de genotipagem.',
    execute: async (ctx) => {
      ctx.print(`After filtering, kept 12500 out of a possible 15000 Sites`);
    }
  },
  {
    name: 'snpeff',
    description: 'Anotação genética e predição de efeitos de variantes',
    help: 'snpeff [Genoma] variantes.vcf > anotadas.vcf\n\nAnota o impacto das variantes no genoma.',
    execute: async (ctx) => {
      ctx.print(`Done. Predicted effects for 12500 variants.`);
    }
  },

  // Montagem
  {
    name: 'spades',
    description: 'SPAdes: St. Petersburg genome assembler',
    help: 'spades.py -1 R1.fastq -2 R2.fastq -o output_dir\n\nMontador de genomas de-novo.',
    execute: async (ctx) => {
      ctx.print(`===== Assembly finished =====\n * Assembled contigs are in output_dir/contigs.fasta`);
    }
  },
  {
    name: 'megahit',
    description: 'Montador de-novo ultra-rápido para metagenômica',
    help: 'megahit -1 R1.fq -2 R2.fq -o out_dir\n\nOtimizado para amostras metagenômicas complexas.',
    execute: async (ctx) => {
      ctx.print(`1500 contigs, N50 18000 bp\n--- ALL DONE ---`);
    }
  },
  {
    name: 'quast',
    description: 'Quality Assessment Tool for Genome Assemblies',
    help: 'quast contigs.fasta -r reference.fasta -o quast_results\n\nAvalia a qualidade de montagens.',
    execute: async (ctx) => {
      ctx.print(`Assembly: contigs\n# contigs: 1500\nN50: 18000\nGC (%): 45.20`);
    }
  },

  // Anotação / Filogenia / Outros
  {
    name: 'prokka',
    description: 'Anotação rápida de genomas procariotos',
    help: 'prokka contigs.fasta --outdir prokka_out\n\nIdentifica e anota genes em genomas de bactérias.',
    execute: async (ctx) => {
      ctx.print(`Found 2300 CDS\nAnnotation finished successfully.`);
    }
  },
  {
    name: 'busco',
    description: 'Avaliação da completude do genoma usando ortólogos',
    help: 'busco -i genome.fasta -o output -l bacteria_odb10 -m genome\n\nAvalia a qualidade do genoma.',
    execute: async (ctx) => {
      ctx.print(`C:98.4%[S:98.4%,D:0.0%],F:0.8%,M:0.8%,n:124`);
    }
  },
  {
    name: 'iqtree',
    description: 'Software de filogenia por máxima verossimilhança ultra-rápido',
    help: 'iqtree -s alignment.phy -m MFP -bb 1000\n\nReconstrói árvores filogenéticas a partir de alinhamentos.',
    execute: async (ctx) => {
      ctx.print(`IQ-TREE 2.2.0.3 built May 2026\nReading alignment file alignment.phy... 100 taxa with 1500 sites\nBest-fit model: GTR+F+I+G4 chosen via BIC`);
      await new Promise(r => setTimeout(r, 600));
      ctx.print(`Total log-likelihood: -12450.56\nOptimal tree written to alignment.phy.treefile`);
    }
  },
  {
    name: 'mafft',
    description: 'Programa de alinhamento múltiplo de sequências (MSA)',
    help: 'mafft input.fasta > alignment.fasta\n\nAlinha múltiplas sequências de DNA ou Proteínas.',
    execute: async (ctx) => {
      ctx.print(`nthread = 0\nstacksize: 8192 kb\n100 x 1500bp\nMaking a distance matrix...\nGap extension penalty = 0.123\nDONE.`);
    }
  },
  {
    name: 'raxml',
    description: 'Randomized Axelerated Maximum Likelihood (Filogenia)',
    help: 'raxmlHPC -s alg.fasta -n out -m GTRGAMMA -p 12345\n\nUma das ferramentas mais usadas para inferência filogenética.',
    execute: async (ctx) => {
      ctx.print(`This is RAxML version 8.2.12\nFinal GAMMA-based Likelihood: -15678.9\nTime for 100 bootstrap iterations: 12s`);
    }
  },

  // RNA-Seq / Expressão
  {
    name: 'salmon',
    description: 'Quantificação de expressão de transcritos',
    help: 'salmon quant -i index -l A -1 R1.fq -2 R2.fq -o transcripts_quant',
    execute: async (ctx) => {
      ctx.print(`Mapping rate = 85.234%\nFinished quantifying.`);
    }
  },
  {
    name: 'kallisto',
    description: 'Quantificação quase ótima de RNA-seq',
    help: 'kallisto quant -i index.idx -o output R1.fq R2.fq',
    execute: async (ctx) => {
      ctx.print(`1000000 reads processed\n850000 reads pseudoaligned`);
    }
  },
  {
    name: 'featurecounts',
    description: 'Atribui leituras a regiões genômicas',
    help: 'featureCounts -a annotation.gtf -o counts.txt input.bam',
    execute: async (ctx) => {
      ctx.print(`Successfully assigned alignments : 820000 (82.0%)`);
    }
  },

  // Metagenômica
  {
    name: 'kraken2',
    description: 'Classificação taxonômica rápida',
    help: 'kraken2 --db database --report report.txt --paired R1.fq R2.fq',
    execute: async (ctx) => {
      ctx.print(`850000 sequences classified (85.00%)\n150000 sequences unclassified (15.00%)`);
    }
  },
  {
    name: 'bracken',
    description: 'Reestimativa de abundância metagenômica',
    help: 'bracken -d database -i kraken_report.txt -o bracken_out.txt',
    execute: async (ctx) => {
      ctx.print(`Bracken complete. Results in bracken_out.txt`);
    }
  },
  {
    name: 'metabat2',
    description: 'Metagenome Binning baseado na composição e abundância',
    help: 'metabat2 -i contigs.fasta -o bins/bin\n\nAgrupa contigs de metagenomas em "bins" (genomas potenciais).',
    execute: async (ctx) => {
      ctx.print(`MetaBAT 2 (v2.12.1) using 4 threads\nReading 1500 contigs... done\nBinning contigs... done\n12 bins (4.5 MB total) were written to bins/`);
    }
  },
  {
    name: 'checkm',
    description: 'Avaliação de linhagem para genomas (metagenômicos)',
    help: 'checkm lineage_wf bins/ checkm_out/\n\nAvalia a qualidade (completude e contaminação) de bins metagenômicos.',
    execute: async (ctx) => {
      ctx.print(`[CheckM v1.1.3] CheckM lineage_wf\nBin Id     Marker lineage     Completeness  Contamination`);
      ctx.print(`bin.1      o__Enterobacteriales   98.5%         1.2%`);
      ctx.print(`bin.2      o__Bacteroidales       92.1%         0.5%`);
    }
  },

  // GWAS / Genética de Populações
  {
    name: 'plink',
    description: 'Ferramenta de análise de associação genômica (GWAS)',
    help: 'plink --bfile data --assoc --out results\n\nO canivete suíço da genética de populações e GWAS.',
    execute: async (ctx) => {
      ctx.print(`PLINK v1.90b6.21 64-bit (19 Oct 2020)\n120 samples (60 cases, 60 controls) loaded.\n500000 variants loaded.\nWriting association results to results.assoc ... done.`);
    }
  },
  {
    name: 'admixture',
    description: 'Estimativa de ancestralidade individual a partir de SNPs',
    help: 'admixture data.bed 3\n\nCalcula proporções de ancestralidade para K populações.',
    execute: async (ctx) => {
      ctx.print(`ADMIXTURE Version 1.3.0\nLog-likelihood: -145678.9\nFinished iteration 100\nQ file written to data.3.Q`);
    }
  },

  // Visualização e Utils
  {
    name: 'igv',
    description: 'Integrative Genomics Viewer (Simulado)',
    help: 'igv data.bam\n\nAbre visualizador genômico interativo.',
    execute: async (ctx) => {
      ctx.print(`Starting IGV visualizer interface...\n[INFO] Loading genome: hg38\n[INFO] Loading track: ${ctx.args[0] || 'none'}\n\x1b[1;30m(Interface gráfica simulada - visualize no seu cérebro por enquanto)\x1b[0m`);
    }
  },
  {
    name: 'seqkit',
    description: 'Canivete suíço para arquivos FASTA/Q',
    help: 'seqkit stats reads.fq',
    execute: async (ctx) => {
      ctx.print(`file       format  type  num_seqs  sum_len\nreads.fq   FASTQ   DNA   100,000   15.0M`);
    }
  },
  {
    name: 'bedtools',
    description: 'Suíte para manipulação de arquivos genômicos',
    help: 'bedtools intersect -a a.bed -b b.bed',
    execute: async (ctx) => {
      ctx.print('chr1\t100\t200\tgeneA\tchr1\t150\t250\texon1');
    }
  },
  {
    name: 'multiqc',
    description: 'Agrega relatórios de bioinformática',
    help: 'multiqc .',
    execute: async (ctx) => {
      ctx.print(`[INFO   ] multiqc : Search complete. Report: multiqc_report.html`);
    }
  }
];
