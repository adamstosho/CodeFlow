export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Diagram {
  _id: string;
  user: string;
  code: string;
  language: 'javascript' | 'python';
  mermaid: string;
  createdAt: string;
  shared: boolean;
}

export interface ConvertRequest {
  code: string;
  language: 'javascript' | 'python';
  shared?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface ConvertResponse {
  success: boolean;
  mermaid: string;
  diagramId?: string;
}

export interface DiagramsResponse {
  success: boolean;
  diagrams: Diagram[];
}

export interface DiagramResponse {
  success: boolean;
  diagram: Diagram;
}