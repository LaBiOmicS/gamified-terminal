import { describe, it, expect, beforeEach } from 'vitest';
import { VFSManager } from '../src/terminal/vfs/VFSManager';

describe('VFSManager', () => {
  let vfs: VFSManager;

  beforeEach(() => {
    vfs = new VFSManager();
  });

  it('should initialize with root directory', () => {
    const root = vfs.getNode('/');
    expect(root).toBeDefined();
    expect(root?.type).toBe('directory');
  });

  it('should resolve relative paths correctly', () => {
    vfs.setCwd('/home/dayhoff');
    expect(vfs.resolvePath('projetos')).toBe('/home/dayhoff/projetos');
    expect(vfs.resolvePath('..')).toBe('/home');
    expect(vfs.resolvePath('.')).toBe('/home/dayhoff');
  });

  it('should create and read files', () => {
    const filePath = '/home/dayhoff/test.txt';
    const content = 'Hello World';
    
    vfs.writeFile(filePath, content, 'dayhoff');
    expect(vfs.readFile(filePath, 'dayhoff')).toBe(content);
  });

  it('should manage directory creation', () => {
    const dirPath = '/home/dayhoff/new_dir';
    expect(vfs.mkdir(dirPath, 'dayhoff')).toBe(true);
    const node = vfs.getNode(dirPath);
    expect(node?.type).toBe('directory');
  });

  it('should handle permissions correctly', () => {
    const rootPath = '/root';
    // dayhoff should not have permission to read /root
    expect(vfs.checkPermission(rootPath, 'dayhoff', 'r')).toBe(false);
    // root should have permission
    expect(vfs.checkPermission(rootPath, 'root', 'r')).toBe(true);
  });

  it('should remove files and directories', () => {
    const filePath = '/home/dayhoff/to_delete.txt';
    vfs.writeFile(filePath, 'content', 'dayhoff');
    expect(vfs.getNode(filePath)).toBeDefined();
    
    vfs.rm(filePath, 'dayhoff');
    expect(vfs.getNode(filePath)).toBeNull();
  });
});
