import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { TerminalEngine } from '../terminal/engine/TerminalEngine';
import { RANKS } from '../terminal/engine/QuestManager';
import type { Achievement } from '../terminal/engine/QuestManager';

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const engineRef = useRef<TerminalEngine | null>(null);
  
  const [currentQuest, setCurrentQuest] = useState<{title: string, progress: string, category: string, xp: number} | null>(null);
  const [userProfile, setUserProfile] = useState<{rank: string, xp: number, achievements: Achievement[], percent: number}>({ rank: RANKS[0].name, xp: 0, achievements: [], percent: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const toggleGroup = (index: number) => {
    setExpandedGroups(prev => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    const safeFit = () => {
      try {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      } catch (e) {
        console.warn('Terminal fit failed', e);
      }
    };

    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      requestAnimationFrame(safeFit);
    };

    window.addEventListener('resize', handleResize);
    
    if (!terminalRef.current) return;

    const xterm = new XTerm({
      cursorBlink: true,
      scrollback: 1000,
      theme: {
        background: '#151515',
        foreground: '#d4d4d4',
        cursor: '#ffffff',
        selectionBackground: '#333333',
      },
      fontFamily: '"Fira Code", Menlo, Monaco, "Courier New", monospace',
      fontSize: isMobile ? 12 : 14,
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    
    xterm.open(terminalRef.current);
    requestAnimationFrame(safeFit);

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    const updateUI = () => {
      if (engineRef.current) {
        const qm = engineRef.current.getQuestManager();
        const q = qm.getCurrentQuest();
        if (q) {
          setCurrentQuest({ title: q.title, progress: `${qm.getProgressPercentage()}%`, category: q.category, xp: q.xp });
        } else {
          setCurrentQuest(null);
        }
        setUserProfile({
          rank: qm.getRank().name,
          xp: qm.getXP(),
          achievements: qm.getAchievements(),
          percent: qm.getProgressPercentage()
        });
      }
    };

    const handleGame = (game: string) => {
      setActiveGame(game);
    };

    engineRef.current = new TerminalEngine(xterm, updateUI, handleGame);
    updateUI();

    const timer = setTimeout(safeFit, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      xterm.dispose();
    };
  }, []);

  useEffect(() => {
    const safeFit = () => {
      try {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      } catch (e) {
        // Silently fail during transitions
      }
    };

    const timers = [
      setTimeout(safeFit, 50),
      setTimeout(safeFit, 150),
      setTimeout(safeFit, 300),
      setTimeout(safeFit, 600)
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [sidebarOpen]);

  const commandGroups = [
    {
      title: '📁 Navegação e Arquivos',
      commands: [
        { name: 'ls', desc: 'Lista arquivos e diretórios', example: 'ls -la' },
        { name: 'cd', desc: 'Muda de diretório', example: 'cd data/' },
        { name: 'pwd', desc: 'Mostra o caminho atual', example: 'pwd' },
        { name: 'mkdir', desc: 'Cria uma pasta', example: 'mkdir analise' },
        { name: 'rm', desc: 'Remove arquivos/pastas', example: 'rm -rf tmp/' },
        { name: 'cp/mv', desc: 'Copia ou move arquivos', example: 'cp arq.txt backup/' },
        { name: 'touch', desc: 'Cria arquivo vazio', example: 'touch nota.txt' },
        { name: 'cat', desc: 'Mostra conteúdo de arquivo', example: 'cat seq.fa' },
      ]
    },
    {
      title: '🧬 Bioinformática',
      commands: [
        { name: 'fastqc', desc: 'Controle de qualidade', example: 'fastqc reads.fq' },
        { name: 'bwa/bowtie2', desc: 'Alinhamento de DNA', example: 'bwa mem ref.fa r1.fq' },
        { name: 'samtools', desc: 'Manipula arquivos BAM', example: 'samtools sort aln.bam' },
        { name: 'gatk', desc: 'Chamada de variantes', example: 'gatk HaplotypeCaller' },
        { name: 'blastn/p', desc: 'Busca de similaridade', example: 'blastn -query q.fa' },
        { name: 'spades', desc: 'Montagem de genomas', example: 'spades.py -1 r1.fq' },
        { name: 'kraken2', desc: 'Taxonomia metagenômica', example: 'kraken2 --db db r.fq' },
        { name: 'salmon', desc: 'Expressão gênica RNA-seq', example: 'salmon quant -i idx' },
        { name: 'bedtools', desc: 'Aritmética genômica', example: 'bedtools intersect' },
      ]
    },
    {
      title: '📦 Gerenciadores & Ambientes',
      commands: [
        { name: 'conda/mamba', desc: 'Cria ambientes e instala pacotes', example: 'conda create -n bio' },
        { name: 'pip', desc: 'Pacotes Python', example: 'pip install pandas' },
        { name: 'pyenv', desc: 'Versões do Python', example: 'pyenv global 3.10.4' },
        { name: 'apt', desc: 'Pacotes do sistema', example: 'apt install git' },
        { name: 'pixi', desc: 'Projetos reprodutíveis', example: 'pixi add numpy' },
      ]
    },
    {
      title: '🐳 Containers & HPC',
      commands: [
        { name: 'docker', desc: 'Containers Docker', example: 'docker run ubuntu' },
        { name: 'singularity', desc: 'Containers para HPC', example: 'singularity shell img.sif' },
        { name: 'sbatch/squeue', desc: 'Slurm Cluster', example: 'squeue -u $USER' },
        { name: 'snakemake', desc: 'Pipelines de bioinfo', example: 'snakemake -c 4' },
        { name: 'make', desc: 'Automação de build', example: 'make all' },
      ]
    },
    {
      title: '🌐 Redes & Sistema',
      commands: [
        { name: 'ip addr', desc: 'Endereços de rede', example: 'ip a' },
        { name: 'netstat', desc: 'Portas e conexões', example: 'netstat -tulpn' },
        { name: 'top/ps', desc: 'Processos e CPU', example: 'ps aux' },
        { name: 'free -h', desc: 'Memória RAM', example: 'free -h' },
        { name: 'df -h', desc: 'Espaço em disco', example: 'df -h' },
        { name: 'chmod/chown', desc: 'Permissões e donos', example: 'chmod 755 script' },
        { name: 'whoami/id', desc: 'Usuário atual', example: 'id' },
      ]
    },
    {
      title: '🛠️ Utilitários de Texto',
      commands: [
        { name: 'grep', desc: 'Busca texto', example: 'grep "motif" seq.fa' },
        { name: 'sed/awk', desc: 'Edição de fluxo/colunas', example: 'awk "{print $1}"' },
        { name: 'sort/uniq', desc: 'Ordenação e contagem', example: 'sort list.txt | uniq -c' },
        { name: 'head/tail', desc: 'Início ou fim do arquivo', example: 'head -n 20 data.txt' },
        { name: 'vim', desc: 'Editor de texto', example: 'vim config.yaml' },
      ]
    }
  ];

  const getGameUrl = () => {
    if (activeGame === 'doom') return 'https://js-dos.com/DOOM/';
    if (activeGame === 'duke') return 'https://js-dos.com/Duke%20Nukem%203d/';
    return '';
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100vw', 
      height: '100vh', 
      height: '100dvh', 
      backgroundColor: '#0a0a0a', 
      color: '#d4d4d4', 
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <header style={{ 
        height: isMobile ? '60px' : '50px', 
        backgroundColor: '#1a1a1b', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 15px',
        borderBottom: '1px solid #333',
        zIndex: 100,
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid #444',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              marginRight: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '6px'
            }}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <div style={{ fontWeight: 600, fontSize: isMobile ? '16px' : '14px', letterSpacing: '0.5px' }}>
            ARAMAS <span style={{ color: '#007acc', fontWeight: 400, display: isMobile ? 'none' : 'inline' }}>| LABIOMICS</span>
          </div>
        </div>
        
        {currentQuest && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#0dbc79', fontWeight: 700 }}>
              {isMobile ? '🎯' : 'MISSÃO:'} {currentQuest.progress}
            </div>
            {!isMobile && <div style={{ fontSize: '10px', color: '#888' }}>{currentQuest.title}</div>}
          </div>
        )}
      </header>

      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        {isMobile && sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 90,
              cursor: 'pointer',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              animation: 'fadeIn 0.3s ease'
            }}
          />
        )}

        <aside style={{ 
          width: isMobile ? '85%' : (sidebarOpen ? '300px' : '0px'), 
          maxWidth: '320px',
          flex: '0 0 auto',
          height: '100%', 
          backgroundColor: '#111112', 
          borderRight: (sidebarOpen || !isMobile) ? '1px solid #333' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: isMobile ? 'absolute' : 'relative',
          zIndex: 95,
          left: 0,
          top: 0,
          transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          boxShadow: isMobile && sidebarOpen ? '10px 0 25px rgba(0,0,0,0.8)' : 'none',
          pointerEvents: isMobile && !sidebarOpen ? 'none' : 'auto'
        }}>
          <div style={{ padding: '20px 15px', backgroundColor: '#1a1a1b', borderBottom: '1px solid #333' }}>
            <div style={{ fontSize: '10px', color: '#888', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>Perfil do Estudante</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                backgroundColor: '#007acc', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '12px',
                fontSize: '20px'
              }}>
                🎓
              </div>
              <div>
                <div style={{ fontSize: '15px', color: '#fff', fontWeight: 600 }}>{userProfile.rank}</div>
                <div style={{ fontSize: '12px', color: '#007acc' }}>{userProfile.xp} XP</div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#aaa', marginBottom: '6px' }}>
                <span>Progresso Geral</span>
                <span style={{ color: '#0dbc79' }}>{userProfile.percent}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${userProfile.percent}%`, height: '100%', backgroundColor: '#0dbc79', transition: 'width 0.8s ease' }}></div>
              </div>
            </div>
          </div>

          {currentQuest && (
            <div style={{ padding: '18px 15px', backgroundColor: '#161617', borderBottom: '1px solid #333' }}>
              <div style={{ fontSize: '10px', color: '#0dbc79', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Missão Atual</div>
              <div style={{ fontSize: '14px', color: '#eee', fontWeight: 600, marginBottom: '4px' }}>{currentQuest.title}</div>
              <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>{currentQuest.category}</div>
            </div>
          )}

          <div style={{ padding: '20px 15px 10px', fontSize: '11px', fontWeight: 700, color: '#007acc', textTransform: 'uppercase' }}>
            Guia de Comandos
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
            {commandGroups.map((group, i) => (
              <div key={i} style={{ borderBottom: '1px solid #222' }}>
                <button 
                  onClick={() => toggleGroup(i)}
                  style={{
                    width: '100%',
                    padding: '14px 15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: expandedGroups[i] ? 'rgba(13, 188, 121, 0.05)' : 'none',
                    border: 'none',
                    color: expandedGroups[i] ? '#0dbc79' : '#ccc',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{group.title}</span>
                  <span style={{ fontSize: '10px', transform: expandedGroups[i] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                </button>
                
                {expandedGroups[i] && (
                  <div style={{ padding: '12px 15px', backgroundColor: '#0f0f10' }}>
                    {group.commands.map((cmd, j) => (
                      <div key={j} style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '13px', color: '#eee', fontFamily: 'monospace', fontWeight: 'bold' }}>{cmd.name}</div>
                        <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>{cmd.desc}</div>
                        <div style={{ fontSize: '11px', color: '#555', marginTop: '4px', padding: '4px 8px', backgroundColor: '#050505', borderRadius: '4px', border: '1px solid #1a1a1b', fontFamily: 'monospace' }}>
                          {cmd.example}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ padding: '15px', backgroundColor: '#0a0a0b', borderTop: '1px solid #333' }}>
            <button 
              onClick={() => {
                if (engineRef.current && window.confirm('Você tem certeza que deseja resetar todo o seu progresso? Isso apagará todos os arquivos criados e seu XP.')) {
                  engineRef.current.resetSystem();
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(204, 0, 0, 0.05)',
                border: '1px solid rgba(204, 0, 0, 0.3)',
                color: '#ff4d4d',
                fontSize: '12px',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <span>🔄</span> REINICIAR JORNADA
            </button>
            <div style={{ fontSize: '10px', color: '#555', lineHeight: '1.5' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>ARAMAS v1.0.0</div>
              Coordenação: <span style={{ color: '#007acc' }}>Fabiano B. Menegidio</span>
              <br/>Desenvolvimento: <span style={{ color: '#007acc' }}>LaBiOmics - UMC</span>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#151515', position: 'relative', width: '100%' }}>
          <div style={{ 
            height: '35px', 
            backgroundColor: '#1a1a1b', 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0 15px', 
            fontSize: '11px', 
            color: '#777', 
            borderBottom: '1px solid #111',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ color: '#0dbc79', marginRight: '8px' }}>➜</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isMobile ? 'dayhoff@ARAMAS' : 'ARAMAS — bash — dayhoff@UMC'}
            </span>
          </div>
          <div 
            ref={terminalRef} 
            style={{ 
              flex: 1, 
              width: '100%',
              padding: '0',
              margin: '0',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }} 
          />

          {activeGame && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                height: '40px',
                backgroundColor: '#1a1a1b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 15px',
                borderBottom: '1px solid #333'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0dbc79' }}>
                  SIMULADOR - {activeGame.toUpperCase()}
                </span>
                <button 
                  onClick={() => setActiveGame(null)}
                  style={{
                    background: '#cc0000',
                    border: 'none',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                >
                  FECHAR (ESC)
                </button>
              </div>
              <iframe 
                src={getGameUrl()} 
                style={{ flex: 1, border: 'none' }}
                title="Retro Game"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Terminal;
