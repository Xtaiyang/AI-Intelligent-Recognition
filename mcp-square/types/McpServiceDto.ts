import type { IMcpService } from '@/types/McpService';

export type McpServiceDto = Omit<IMcpService, '_id'> & {
  id: string;
};
