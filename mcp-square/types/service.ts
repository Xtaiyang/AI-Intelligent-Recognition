export type ServiceStatus = 'active' | 'draft';

export type Service = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ServiceStatus;
};
