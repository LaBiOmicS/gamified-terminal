import type { Command } from './types';

export const networkCommands: Command[] = [
  {
    name: 'ping',
    description: 'Envia pacotes ICMP ECHO_REQUEST para hosts da rede',
    help: 'ping [OPÇÃO] HOST\n\nExemplo:\n  ping google.com',
    execute: async (ctx) => {
      const host = ctx.args.find(a => !a.startsWith('-')) || 'google.com';
      ctx.print(`PING ${host} (142.250.191.46) 56(84) bytes of data.`);
      for (let i = 1; i <= 3; i++) {
        ctx.print(`64 bytes from ${host}: icmp_seq=${i} ttl=117 time=15.${Math.floor(Math.random()*9)} ms`);
        await new Promise(r => setTimeout(r, 200));
      }
      ctx.print(`\n--- ${host} ping statistics ---`);
      ctx.print('3 packets transmitted, 3 received, 0% packet loss, time 2003ms');
    }
  },
  {
    name: 'ssh-keygen',
    description: 'Gerador, gerenciador e conversor de chaves de autenticação',
    help: 'ssh-keygen [-t tipo] [-b bits]\n\nExemplo:\n  ssh-keygen -t rsa -b 4096',
    execute: async (ctx) => {
      ctx.print('Generating public/private rsa key pair.');
      ctx.print('Enter file in which to save the key (/home/dayhoff/.ssh/id_rsa): ');
      ctx.print('Enter passphrase (empty for no passphrase): ');
      ctx.print('Enter same passphrase again: ');
      ctx.print('Your identification has been saved in /home/dayhoff/.ssh/id_rsa');
      ctx.print('Your public key has been saved in /home/dayhoff/.ssh/id_rsa.pub');
      ctx.print('The key fingerprint is:\nSHA256:abc123def456ghi789jkl012mnop345qrst678uvwxyz dayhoff@LaBiOmics');
    }
  },
  {
    name: 'ssh',
    description: 'OpenSSH cliente (programa de login remoto)',
    help: 'ssh [usuario@]hostname\n\nExemplo:\n  ssh user@hpc-cluster',
    execute: async (ctx) => {
      const target = ctx.args[0] || 'localhost';
      ctx.print(`Connecting to ${target}...`);
      await new Promise(r => setTimeout(r, 800));
      ctx.print(`\x1b[1;32mWelcome to ${target} (Simulated)!\x1b[0m`);
      ctx.print('Last login: Fri May  1 09:00:00 2026 from 192.168.1.10');
      ctx.print(`\x1b[1;34m[${target}]$\x1b[0m `);
    }
  },
  {
    name: 'scp',
    description: 'Cópia segura (programa de cópia de arquivos remotos)',
    help: 'scp [[usuario@]host1:]file1 ... [[usuario@]host2:]file2',
    execute: async (ctx) => {
      if (ctx.args.length < 2) {
        ctx.printError('scp: operando ausente');
        return;
      }
      const source = ctx.args[0];
      const dest = ctx.args[1];
      ctx.print(`${source.split('/').pop()}                                100% 1024KB   2.5MB/s   00:00`);
      ctx.print(`Transferred ${source} to ${dest}`);
    }
  }
];
