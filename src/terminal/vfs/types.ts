export type NodeType = 'file' | 'directory';

export interface BaseNode {
  name: string;
  type: NodeType;
  parent: string | null; // Path to parent
  permissions: string; // e.g., 'rwxr-xr-x'
  owner: string;
  group: string;
  createdAt: number;
  modifiedAt: number;
}

export interface FileNode extends BaseNode {
  type: 'file';
  content: string;
}

export interface DirectoryNode extends BaseNode {
  type: 'directory';
  children: string[]; // Names of child nodes
}

export type VFSNode = FileNode | DirectoryNode;

export interface VFSState {
  nodes: Record<string, VFSNode>; // Key is absolute path
  cwd: string;
}
