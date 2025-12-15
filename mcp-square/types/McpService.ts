export type McpServiceStatus = 'active' | 'draft' | 'archived';

export interface IMcpService {
  _id?: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  pricing: string;
  status: McpServiceStatus;
  contactInfo: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
