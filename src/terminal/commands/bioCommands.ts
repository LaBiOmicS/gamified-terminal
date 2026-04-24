import type { Command } from './types';

export const bioCommands: Command[] = [
  // Ferramentas Básicas (existentes)
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
      ctx.print(`[INFO   ]         multiqc : Template    : default`);
      ctx.print(`[INFO   ]         multiqc : Searching '${ctx.args[0] || '.'}'`);
      await new Promise(r => setTimeout(r, 600));
      ctx.print(`[INFO   ]          fastqc : Found 4 reports`);
      ctx.print(`[INFO   ]             bwa : Found 2 reports`);
      ctx.print(`[INFO   ]         multiqc : Report      : multiqc_report.html`);
      ctx.print(`[INFO   ]         multiqc : Data        : multiqc_data`);
      ctx.print(`[INFO   ]         multiqc : MultiQC complete`);
    }
  },
  {
    name: 'trimmomatic',
    description: 'Aparador de leituras flexível para dados Illumina',
    help: 'trimmomatic PE/SE [arquivos] [etapas]\n\nFiltra e apara leituras de sequenciamento por qualidade e adaptadores.',
    execute: async (ctx) => {
      ctx.print(`TrimmomaticPE: Started with arguments: ${ctx.args.join(' ')}`);
      ctx.print(`Multiple cores found: Using 4 threads`);
      await new Promise(r => setTimeout(r, 700));
      ctx.print(`Input Read Pairs: 100000 Both Surviving: 95000 (95.00%) Forward Only Surviving: 2000 (2.00%) Reverse Only Surviving: 1500 (1.50%) Dropped: 1500 (1.50%)`);
      ctx.print(`TrimmomaticPE: Completed successfully`);
    }
  },
  {
    name: 'fastp',
    description: 'Aparador e filtrador ultra-rápido all-in-one para FASTQ',
    help: 'fastp -i in.fq -o out.fq\n\nFerramenta rápida baseada em C++ para QC e trimming.',
    execute: async (ctx) => {
      ctx.print(`Read1 before filtering:`);
      ctx.print(`total reads: 100000\ntotal bases: 15000000\nQ20 bases: 97.5%\nQ30 bases: 92.1%`);
      await new Promise(r => setTimeout(r, 500));
      ctx.print(`\nFiltering result:\nreads passed filter: 98000\nreads failed due to low quality: 1500\nreads failed due to too many N: 500`);
      ctx.print(`\nJSON report: fastp.json\nHTML report: fastp.html`);
    }
  },

  // Alinhamento / Mapeamento
  {
    name: 'bwa',
    description: 'Burrows-Wheeler Aligner para mapeamento de leituras contra genoma de referência',
    help: 'bwa mem ref.fa read1.fq [read2.fq]\n\nRealiza o alinhamento de leituras (reads) utilizando o algoritmo BWA-MEM.',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'index') {
        ctx.print(`[bwa_index] Pack FASTA... 0.05 sec\n[bwa_index] Construct BWT for the packed sequence...\n[bwa_index] 1.50 sec\n[bwa_index] Update BWT... 0.02 sec`);
      } else if (sub === 'mem') {
        ctx.print(`[M::bwa_idx_load] loaded the bwa index from genome.fa`);
        ctx.print(`[M::process] read 100000 sequences (15000000 bp)...`);
        await new Promise(r => setTimeout(r, 800));
        ctx.print(`[M::mem_process_seqs] Processed 100000 reads in 2.345 CPU sec, 0.654 real sec`);
        ctx.print(`[main] Version: 0.7.17-r1188\n[main] CMD: bwa ${ctx.args.join(' ')}\n[main] Real time: 0.812 sec; CPU: 2.501 sec`);
      } else {
        ctx.print(`Usage: bwa <command> [options]\nCommands:\n  index         index sequences in the FASTA format\n  mem           BWA-MEM algorithm`);
      }
    }
  },
  {
    name: 'bowtie2',
    description: 'Alinhador rápido e sensível de leituras para genomas longos',
    help: 'bowtie2 -x <bt2-idx> {-1 <m1> -2 <m2> | -U <r>} -S <sam>\n\nConstrói índices e mapeia leituras de DNA.',
    execute: async (ctx) => {
      if (ctx.args.length === 0) { ctx.print('Bowtie 2 version 2.4.4\nUsage: bowtie2 [options]* -x <bt2-idx> {-1 <m1> -2 <m2> | -U <r>} [-S <sam>]'); return; }
      ctx.print(`100000 reads; of these:`);
      ctx.print(`  100000 (100.00%) were paired; of these:`);
      ctx.print(`    5000 (5.00%) aligned concordantly 0 times`);
      ctx.print(`    90000 (90.00%) aligned concordantly exactly 1 time`);
      ctx.print(`    5000 (5.00%) aligned concordantly >1 times`);
      ctx.print(`95.00% overall alignment rate`);
    }
  },
  {
    name: 'minimap2',
    description: 'Alinhador versátil para sequências de DNA/RNA',
    help: 'minimap2 -a ref.fa query.fq > aln.sam\n\nEspecialmente bom para reads longos (PacBio/Nanopore) ou genomas completos.',
    execute: async (ctx) => {
      if (ctx.args.length === 0) { ctx.print('Usage: minimap2 [options] <target.fa>|<target.mmi> [query.fa] [...]'); return; }
      ctx.print(`[M::mm_idx_gen::0.151*0.98] collected minimizers`);
      ctx.print(`[M::mm_idx_set::0.211*1.05] applied heuristic cutoff`);
      await new Promise(r => setTimeout(r, 600));
      ctx.print(`[M::map_opt] read 50000 sequences`);
      ctx.print(`[M::worker_pipeline::1.250*2.88] mapped 50000 sequences`);
      ctx.print(`[main] Version: 2.24-r1122\n[main] CMD: minimap2 ${ctx.args.join(' ')}\n[main] Real time: 1.304 sec; CPU: 3.652 sec`);
    }
  },
  {
    name: 'star',
    description: 'Spliced Transcripts Alignment to a Reference',
    help: 'STAR --genomeDir [dir] --readFilesIn [fastq]\n\nAlinhador ultra-rápido otimizado para dados de RNA-Seq.',
    execute: async (ctx) => {
      ctx.print(`STAR --runThreadN 4 --genomeDir ref/ --readFilesIn reads.fastq`);
      ctx.print(`Apr 23 14:00:01 ..... started STAR run`);
      ctx.print(`Apr 23 14:00:05 ..... loading genome`);
      await new Promise(r => setTimeout(r, 800));
      ctx.print(`Apr 23 14:00:20 ..... started mapping`);
      ctx.print(`Apr 23 14:00:45 ..... finished mapping`);
      ctx.print(`Apr 23 14:00:46 ..... finished successfully`);
    }
  },

  // Manipulação de SAM/BAM
  {
    name: 'samtools',
    description: 'Ferramentas para manipular alinhamentos de sequências (SAM/BAM/CRAM)',
    help: 'samtools [COMANDO] [OPÇÕES]\n\nSuite para conversão, ordenação, indexação e visualização de alinhamentos.\n\nComandos:\n  view       Exibe ou converte arquivos SAM/BAM\n  sort       Ordena um arquivo BAM\n  index      Cria um índice (.bai) para um BAM ordenado\n  flagstat   Resumo estatístico do mapeamento',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'view') {
        ctx.print('r001\t163\tchr1\t7\t30\t8M2I4M\t=\t37\t39\tTTAGATAAAGAGG\t*');
        ctx.print('r002\t0\tchr1\t9\t30\t3S6M1P1I4M\t*\t0\t0\tAAAAGATAAGGATA\t*');
      } else if (sub === 'sort') {
        ctx.print(`[bam_sort_core] merging from 0 files and 4 in-memory blocks...`);
      } else if (sub === 'index') {
        ctx.print(`[samtools index] successfully generated index.`);
      } else if (sub === 'flagstat') {
        ctx.print('100000 + 0 in total (QC-passed reads + QC-failed reads)\n0 + 0 secondary\n0 + 0 supplementary\n0 + 0 duplicates\n95000 + 0 mapped (95.00% : N/A)');
      } else {
        ctx.print('Program: samtools (Tools for alignments in the SAM format)\nUsage: samtools <command> [options]');
      }
    }
  },
  {
    name: 'picard',
    description: 'Conjunto de ferramentas para manipular formatos de dados HTS',
    help: 'picard [Ferramenta] [Opções...]\n\nFerramentas em Java para manipular arquivos SAM/BAM/CRAM e VCF.\n\nExemplo:\n  picard MarkDuplicates I=input.bam O=marked.bam M=metrics.txt',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (!sub) { ctx.print('USAGE: PicardCommandLine <program name> [-h]'); return; }
      ctx.print(`INFO    2026-04-23 14:10:00     PicardCommandLine       Invoking ${sub}`);
      ctx.print(`INFO    2026-04-23 14:10:01     ${sub}       Start of processing`);
      await new Promise(r => setTimeout(r, 600));
      if (sub === 'MarkDuplicates') {
        ctx.print(`INFO    2026-04-23 14:10:05     MarkDuplicates  Read 100000 records. 2000 duplicates found.`);
      }
      ctx.print(`INFO    2026-04-23 14:10:06     ${sub}       Successfully completed!`);
    }
  },

  // Chamada de Variantes (Variant Calling)
  {
    name: 'gatk',
    description: 'Genome Analysis Toolkit (Chamada de variantes e genotipagem)',
    help: 'gatk [Ferramenta] [Opções]\n\nDesenvolvido pelo Broad Institute, padrão-ouro para análise de variantes em DNA e RNA.',
    execute: async (ctx) => {
      const tool = ctx.args[0] || 'HaplotypeCaller';
      ctx.print(`Using GATK jar /usr/local/gatk/gatk-package-4.3.0.0-local.jar`);
      ctx.print(`Running: java -Djava.io.tmpdir=/tmp -jar gatk.jar ${tool} ${ctx.args.slice(1).join(' ')}`);
      ctx.print(`14:15:00.123 INFO  ${tool} - ------------------------------------------------------------`);
      ctx.print(`14:15:00.125 INFO  ${tool} - The Genome Analysis Toolkit (GATK) v4.3.0.0`);
      await new Promise(r => setTimeout(r, 1000));
      if (tool === 'HaplotypeCaller') {
        ctx.print(`14:15:20.500 INFO  HaplotypeCaller - 100000 read(s) filtered by: MappingQualityReadFilter`);
        ctx.print(`14:15:25.000 INFO  HaplotypeCaller - 5000 active regions processed`);
      }
      ctx.print(`14:15:30.000 INFO  ${tool} - Shutting down engine`);
      ctx.print(`[23 April 2026 14:15:30] org.broadinstitute.hellbender.tools.${tool} done. Elapsed time: 0.50 minutes.`);
    }
  },
  {
    name: 'bcftools',
    description: 'Utilitários para chamar e manipular arquivos VCF e BCF',
    help: 'bcftools [COMANDO] [OPÇÕES]\n\nComandos:\n  mpileup   Gera genótipos probabilísticos\n  call      Faz a chamada de variantes (SNPs/Indels)\n  view      Exibe, filtra e converte arquivos VCF/BCF',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'mpileup') ctx.print(`[mpileup] 1 samples in 1 input files\n[mpileup] maximum number of reads per input file set to -d 250`);
      else if (sub === 'call') ctx.print(`Note: none of --samples-file, --ploidy or --ploidy-file given, assuming all sites are diploid`);
      else if (sub === 'view') ctx.print(`##fileformat=VCFv4.2\n##FILTER=<ID=PASS,Description="All filters passed">\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\nchr1\t10000\t.\tA\tG\t50.5\tPASS\tDP=20`);
      else ctx.print(`Program: bcftools (Tools for variant calling and manipulating VCFs and BCFs)\nUsage: bcftools [--version|--version-only] [--help] <command> <argument>`);
    }
  },
  {
    name: 'freebayes',
    description: 'Chamador genético de variantes baseado em haplótipos (Bayesiano)',
    help: 'freebayes -f ref.fa aln.bam > var.vcf\n\nDescobre SNPs, Indels, MNPs e variantes complexas em genomas e populações.',
    execute: async (ctx) => {
      ctx.print(`##fileformat=VCFv4.2\n##source=freeBayes v1.3.6\n##reference=ref.fa`);
      ctx.print(`#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tsample1`);
      ctx.print(`chr1\t15000\t.\tT\tC\t1050.2\t.\tAB=1;DP=40\tGT:DP\t1/1:40`);
      ctx.print(`chr1\t15500\t.\tG\tGA\t85.5\t.\tAB=0.5;DP=30\tGT:DP\t0/1:30`);
    }
  },
  {
    name: 'vcftools',
    description: 'Ferramentas de análise de arquivos VCF',
    help: 'vcftools --vcf input.vcf [opções de filtro] --recode\n\nAnalisa, filtra e manipula dados de genotipagem em formato VCF.',
    execute: async (ctx) => {
      ctx.print(`VCFtools - 0.1.16`);
      ctx.print(`(C) Adam Auton and Anthony Marcketta 2009`);
      ctx.print(`Parameters as interpreted:`);
      ctx.print(`\t--vcf input.vcf\n\t--recode`);
      await new Promise(r => setTimeout(r, 400));
      ctx.print(`After filtering, kept 1 out of 1 Individuals`);
      ctx.print(`After filtering, kept 12500 out of a possible 15000 Sites`);
      ctx.print(`Run Time = 1.00 seconds`);
    }
  },
  {
    name: 'snpeff',
    description: 'Anotação genética e predição de efeitos de variantes',
    help: 'snpeff [Genoma] variantes.vcf > anotadas.vcf\n\nAnota o impacto das variantes no genoma (ex: missense, nonsense, frameshift).',
    execute: async (ctx) => {
      ctx.print(`SnpEff version SnpEff 5.1d (build 2022-04-19 15:50)`);
      ctx.print(`Reading database for genome version 'GRCh38.105' (this might take a while)...`);
      await new Promise(r => setTimeout(r, 900));
      ctx.print(`Building interval forest... Done.`);
      ctx.print(`Predicting variants effects...`);
      ctx.print(`Done.\nLogging...`);
    }
  },

  // Montagem de Genomas (Assembly)
  {
    name: 'spades',
    description: 'SPAdes: St. Petersburg genome assembler',
    help: 'spades.py -1 R1.fastq -2 R2.fastq -o output_dir\n\nMontador de genomas de-novo para dados Illumina e IonTorrent/PacBio.',
    execute: async (ctx) => {
      ctx.print(`SPAdes genome assembler v3.15.5`);
      ctx.print(`Command line: spades.py ${ctx.args.join(' ')}`);
      ctx.print(`System information:\n  SPAdes is running on 8 cores`);
      await new Promise(r => setTimeout(r, 800));
      ctx.print(`===== Assembling started =====`);
      ctx.print(`===== K-mer size: 21, 33, 55, 77 =====`);
      ctx.print(`===== Assembly finished =====`);
      ctx.print(` * Corrected reads are in output_dir/corrected/`);
      ctx.print(` * Assembled contigs are in output_dir/contigs.fasta`);
      ctx.print(` * Assembled scaffolds are in output_dir/scaffolds.fasta`);
      ctx.print(`SPAdes log can be found here: output_dir/spades.log`);
    }
  },
  {
    name: 'megahit',
    description: 'Montador de-novo ultra-rápido para metagenômica',
    help: 'megahit -1 R1.fq -2 R2.fq -o out_dir\n\nOtimizado para amostras metagenômicas complexas.',
    execute: async (ctx) => {
      ctx.print(`MEGAHIT v1.2.9`);
      ctx.print(`--- [Mon Apr 23 15:00:00 2026] Start assembly ---`);
      ctx.print(`--- [Mon Apr 23 15:00:02 2026] Extracting solid (k+1)-mers ---`);
      await new Promise(r => setTimeout(r, 600));
      ctx.print(`--- [Mon Apr 23 15:00:15 2026] Assembling contigs ---`);
      ctx.print(`--- [Mon Apr 23 15:00:30 2026] Merging to output ---`);
      ctx.print(`1500 contigs, total 2500000 bp, min 200 bp, max 55000 bp, avg 1666 bp, N50 18000 bp`);
      ctx.print(`--- [Mon Apr 23 15:00:31 2026] ALL DONE. Time elapsed: 31.023 seconds ---`);
    }
  },
  {
    name: 'quast',
    description: 'Quality Assessment Tool for Genome Assemblies',
    help: 'quast contigs.fasta -r reference.fasta -o quast_results\n\nAvalia a qualidade de montagens gerando relatórios abrangentes.',
    execute: async (ctx) => {
      ctx.print(`QUAST started: /usr/local/bin/quast ${ctx.args.join(' ')}`);
      ctx.print(`Version: 5.2.0`);
      ctx.print(`System information: OS Linux, 8 CPU(s)`);
      ctx.print(`\nRunning Basic statistics processor...`);
      await new Promise(r => setTimeout(r, 500));
      ctx.print(`  Contig files: 1\n  Reference: 1`);
      ctx.print(`\nGenerating reports...`);
      ctx.print(`  HTML report saved to quast_results/report.html`);
      ctx.print(`  TXT report saved to quast_results/report.txt`);
      ctx.print(`\nAssembly: contigs\n# contigs: 1500\nTotal length: 2500000\nLargest contig: 55000\nGC (%): 45.20\nN50: 18000\nL50: 45`);
    }
  },

  // Anotação
  {
    name: 'prokka',
    description: 'Anotação rápida de genomas procariotos',
    help: 'prokka contigs.fasta --outdir prokka_out\n\nIdentifica e anota genes em genomas de bactérias e vírus.',
    execute: async (ctx) => {
      ctx.print(`[15:10:00] This is prokka 1.14.6`);
      ctx.print(`[15:10:00] Looking for 'aragorn' - found /usr/bin/aragorn`);
      ctx.print(`[15:10:00] Looking for 'blastp' - found /usr/bin/blastp`);
      ctx.print(`[15:10:01] Predicting tRNAs and tmRNAs`);
      await new Promise(r => setTimeout(r, 700));
      ctx.print(`[15:10:10] Predicting coding sequences`);
      ctx.print(`[15:10:15] Annotating CDS, please be patient.`);
      ctx.print(`[15:10:20] Found 2300 CDS`);
      ctx.print(`[15:10:21] Writing annotation files to prokka_out/`);
      ctx.print(`[15:10:22] Annotation finished successfully.`);
    }
  },
  {
    name: 'busco',
    description: 'Avaliação quantitativa da completude do genoma usando ortólogos de cópia única',
    help: 'busco -i genome.fasta -o output_name -l bacteria_odb10 -m genome\n\nAvalia a qualidade do genoma ou transcriptoma.',
    execute: async (ctx) => {
      ctx.print(`INFO:   BUSCO version is: 5.4.4`);
      ctx.print(`INFO:   Downloading information on the target lineage bacteria_odb10...`);
      ctx.print(`INFO:   Running tblastn on 124 ortholog groups...`);
      await new Promise(r => setTimeout(r, 900));
      ctx.print(`INFO:   Running HMMER on candidates...`);
      ctx.print(`\nC:98.4%[S:98.4%,D:0.0%],F:0.8%,M:0.8%,n:124`);
      ctx.print(`    122 Complete BUSCOs (C)`);
      ctx.print(`    122 Complete and single-copy BUSCOs (S)`);
      ctx.print(`    0   Complete and duplicated BUSCOs (D)`);
      ctx.print(`    1   Fragmented BUSCOs (F)`);
      ctx.print(`    1   Missing BUSCOs (M)`);
      ctx.print(`    124 Total BUSCO groups searched`);
    }
  },

  // Expressão Gênica (RNA-Seq)
  {
    name: 'salmon',
    description: 'Quantificação rápida e sensível de expressão de transcritos',
    help: 'salmon quant -i index -l A -1 R1.fq -2 R2.fq -o transcripts_quant\n\nQuantifica abundância de RNA-seq (mapeamento quase-ótimo).',
    execute: async (ctx) => {
      ctx.print(`Version Info: This is the most recent version of salmon.`);
      ctx.print(`[2026-04-23 15:20:00.123] [jointLog] [info] Fragment incompatibility prior below threshold.`);
      await new Promise(r => setTimeout(r, 600));
      ctx.print(`[2026-04-23 15:20:05.456] [jointLog] [info] Mapping rate = 85.234%`);
      ctx.print(`[2026-04-23 15:20:06.000] [jointLog] [info] Finished quantifying. Output written to directory transcripts_quant/`);
    }
  },
  {
    name: 'kallisto',
    description: 'Quantificação quase ótima de RNA-seq',
    help: 'kallisto quant -i index.idx -o output R1.fq R2.fq\n\nAlternativa ao salmon para quantificação ultra-rápida.',
    execute: async (ctx) => {
      ctx.print(`[quant] fragment length distribution will be estimated from the data`);
      ctx.print(`[index] k-mer length: 31`);
      ctx.print(`[index] number of targets: 180000`);
      ctx.print(`[index] number of k-mers: 105000000`);
      await new Promise(r => setTimeout(r, 500));
      ctx.print(`[quant] running in paired-end mode`);
      ctx.print(`[quant] 1000000 reads processed`);
      ctx.print(`[quant] 850000 reads pseudoaligned`);
    }
  },
  {
    name: 'featurecounts',
    description: 'Programa para atribuir leituras de sequenciamento a regiões genômicas',
    help: 'featureCounts -a annotation.gtf -o counts.txt input.bam\n\nConta quantas reads caem dentro de genes/exons.',
    execute: async (ctx) => {
      ctx.print(`==========     _____ _    _ ____  _____  ______       ==========`);
      ctx.print(`==========    / ____| |  | |  _ \\|  __ \\|  ____|      ==========`);
      ctx.print(`==========   | (___ | |  | | |_) | |__) | |__         ==========`);
      ctx.print(`==========    \\___ \\| |  | |  _ <|  _  /|  __|        ==========`);
      ctx.print(`==========    ____) | |__| | |_) | | \\ \\| |____       ==========`);
      ctx.print(`==========   |_____/ \\____/|____/|_|  \\_\\______| v2.0.3 ==========`);
      ctx.print(`\n//========================== featureCounts setting ===========================\\\\`);
      ctx.print(`||             Input files : 1 BAM file                                       ||`);
      ctx.print(`||             Annotation : annotation.gtf (GTF)                              ||`);
      ctx.print(`\\\\============================================================================//`);
      await new Promise(r => setTimeout(r, 600));
      ctx.print(`\n//================================= Summary ==================================\\\\`);
      ctx.print(`|| Total alignments : 1000000                                                 ||`);
      ctx.print(`|| Successfully assigned alignments : 820000 (82.0%)                          ||`);
      ctx.print(`|| Running time : 0.25 minutes                                                ||`);
      ctx.print(`\\\\============================================================================//`);
    }
  },

  // Metagenômica
  {
    name: 'kraken2',
    description: 'Classificação taxonômica rápida usando k-mers exatos',
    help: 'kraken2 --db database --report report.txt --paired R1.fq R2.fq\n\nAtribui reads a táxons usando um banco de dados de referência.',
    execute: async (ctx) => {
      ctx.print(`Loading database information... done.`);
      ctx.print(`1000000 sequences (150.00 Mbp) processed in 5.250s (11.4 Kseq/m, 1.72 Mbp/m).`);
      ctx.print(`  850000 sequences classified (85.00%)`);
      ctx.print(`  150000 sequences unclassified (15.00%)`);
    }
  },
  {
    name: 'bracken',
    description: 'Bayesian Reestimation of Abundance with KrakEN',
    help: 'bracken -d database -i kraken_report.txt -o bracken_out.txt\n\nEstima a abundância relativa em amostras metagenômicas a partir de resultados do Kraken.',
    execute: async (ctx) => {
      ctx.print(`>> Checking provided report file...`);
      ctx.print(`>> Filtering taxonomic classifications...`);
      ctx.print(`>> Estimating species-level abundances...`);
      await new Promise(r => setTimeout(r, 400));
      ctx.print(`>> Writing Bracken output to bracken_out.txt...`);
      ctx.print(`Bracken complete.`);
    }
  },

  // Utilitários de Sequência
  {
    name: 'seqtk',
    description: 'Ferramenta rápida e leve para processamento de sequências (FASTA/Q)',
    help: 'seqtk [COMANDO] [OPÇÕES]\n\nComandos úteis:\n  seq      formata e transforma sequências\n  sample   amostra aleatoriamente sequências\n  subseq   extrai sequências baseado em nomes',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'sample') ctx.print(`@read_1_sampled\nACGTACGTACGT\n+\nIIIIIIIIIIII`);
      else if (sub === 'seq') ctx.print(`>seq1\nACGTACGTACGT`);
      else ctx.print(`Usage: seqtk <command> <arguments>\nCommand:\n  seq       common transformation of FASTA/Q\n  comp      get the nucleotide composition of FASTA/Q\n  sample    subsample sequences\n  subseq    extract subsequences from FASTA/Q`);
    }
  },
  {
    name: 'seqkit',
    description: 'Canivete suíço multiplataforma e ultra-rápido para FASTA/Q',
    help: 'seqkit [COMANDO] [OPÇÕES]\n\nFerramenta em Go, muito mais rica em opções que seqtk.\n\nComandos úteis:\n  stats    Estatísticas simples\n  grep     Busca sequências por ID ou motivo',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'stats') {
        ctx.print(`file       format  type  num_seqs  sum_len  min_len  avg_len  max_len`);
        ctx.print(`reads.fq   FASTQ   DNA   100,000   15.0M    150      150      150`);
      } else if (sub === 'grep') {
        ctx.print(`>matched_seq\nATGCGTACGTG`);
      } else {
        ctx.print(`seqkit - a cross-platform and ultrafast toolkit for FASTA/Q file manipulation\nUsage:\n  seqkit [command]`);
      }
    }
  },

  // BLAST e Busca de Homologia
  {
    name: 'makeblastdb',
    description: 'Cria bancos de dados locais para o BLAST',
    help: 'makeblastdb -in ref.fa -dbtype nucl -out mydb\n\nIndexa um arquivo FASTA para buscas rápidas pelo BLAST.',
    execute: async (ctx) => {
      ctx.print(`Building a new DB, current time: 04/23/2026 15:30:00`);
      ctx.print(`New DB name:   /home/dayhoff/mydb`);
      ctx.print(`New DB title:  ref.fa`);
      ctx.print(`Sequence type: Nucleotide`);
      await new Promise(r => setTimeout(r, 400));
      ctx.print(`Adding sequences from FASTA; added 5000 sequences in 0.25 seconds.`);
    }
  },
  {
    name: 'blastn',
    description: 'Busca de similaridade em sequências de nucleotídeos',
    help: 'blastn -query ARQUIVO -db DATABASE\n\nRealiza busca local de alinhamento de nucleotídeos.',
    execute: async (ctx) => {
      const query = ctx.args[ctx.args.indexOf('-query') + 1] || 'query.fa';
      ctx.print(`BLASTN 2.13.0+\nQuery= ${query}\nLength=150`);
      ctx.print('\nSequences producing significant alignments:                          E-Value  Bit-score');
      ctx.print('chr1_segment_A                                                     2e-45    120');
      ctx.print('chrX_homolog_1                                                     1e-12    56.5');
    }
  },
  {
    name: 'blastp',
    description: 'Busca de similaridade em sequências de proteínas',
    help: 'blastp -query ARQUIVO -db DATABASE\n\nCompara uma proteína query com um banco de proteínas.',
    execute: async (ctx) => {
      const query = ctx.args[ctx.args.indexOf('-query') + 1] || 'protein.faa';
      ctx.print(`BLASTP 2.13.0+\nQuery= ${query}\nLength=300 amino acids`);
      ctx.print('\nSequences producing significant alignments:                          E-Value  Bit-score');
      ctx.print('sp|P12345|KIN1_HUMAN Kinase 1                                      0.0      600');
      ctx.print('sp|Q67890|KIN2_MOUSE Kinase 2                                      1e-50    150');
    }
  },
  {
    name: 'blastx',
    description: 'Busca de similaridade de nucleotídeo (traduzido) contra proteína',
    help: 'blastx -query ARQUIVO -db DATABASE\n\nTraduz o nucleotídeo nas 6 janelas de leitura contra um banco de proteínas.',
    execute: async (ctx) => {
      const query = ctx.args[ctx.args.indexOf('-query') + 1] || 'transcript.fa';
      ctx.print(`BLASTX 2.13.0+\nQuery= ${query}\nLength=450`);
      ctx.print('\nSequences producing significant alignments:                          E-Value  Bit-score');
      ctx.print('sp|P12345|KIN1_HUMAN Kinase 1                                      1e-80    280');
    }
  },
  {
    name: 'bedtools',
    description: 'Suíte de ferramentas para manipulação de arquivos genômicos (BED/GFF/VCF)',
    help: 'bedtools [SUBCOMANDO] [OPÇÕES]\n\nOperações aritméticas genômicas.\n\nSubcomandos comuns:\n  intersect   Encontra sobreposições entre arquivos',
    execute: async (ctx) => {
      const sub = ctx.args[0];
      if (sub === 'intersect') {
        ctx.print('chr1\t100\t200\tgeneA\tchr1\t150\t250\texon1');
      } else {
        ctx.print('bedtools: a powerful toolset for genome arithmetic.\nUsage: bedtools <subcommand> [options]');
      }
    }
  }
];
