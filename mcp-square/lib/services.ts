import type { Service } from '@/types/service';

const SERVICES: Service[] = [
  {
    id: 'image-recognition',
    name: 'Image Recognition',
    description: 'Identify objects and scenes from images.',
    category: 'AI',
    status: 'active',
  },
  {
    id: 'content-moderation',
    name: 'Content Moderation',
    description: 'Automated safety checks for text and images.',
    category: 'Safety',
    status: 'active',
  },
  {
    id: 'doc-summarizer',
    name: 'Document Summarizer',
    description: 'Summarize long documents into bullet points and highlights.',
    category: 'Productivity',
    status: 'active',
  },
  {
    id: 'translation',
    name: 'Translation',
    description: 'Translate text between languages with context-aware output.',
    category: 'AI',
    status: 'active',
  },
  {
    id: 'speech-to-text',
    name: 'Speech to Text',
    description: 'Transcribe audio to text with speaker hints.',
    category: 'AI',
    status: 'active',
  },
  {
    id: 'vector-search',
    name: 'Vector Search',
    description: 'Semantic search over your knowledge base using embeddings.',
    category: 'Data',
    status: 'active',
  },
  {
    id: 'log-anomaly-detection',
    name: 'Log Anomaly Detection',
    description: 'Detect spikes and outliers in logs and traces.',
    category: 'Observability',
    status: 'active',
  },
  {
    id: 'api-monitoring',
    name: 'API Monitoring',
    description: 'Track uptime and latency for critical endpoints.',
    category: 'Observability',
    status: 'draft',
  },
  {
    id: 'code-review-bot',
    name: 'Code Review Bot',
    description: 'Automated PR feedback for style, risks, and test gaps.',
    category: 'DevTools',
    status: 'active',
  },
  {
    id: 'catalog-enrichment',
    name: 'Catalog Enrichment',
    description: 'Normalize titles, tags, and attributes for listings.',
    category: 'Data',
    status: 'draft',
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'Score sentiment for reviews and support tickets.',
    category: 'AI',
    status: 'active',
  },
  {
    id: 'compliance-redaction',
    name: 'Compliance Redaction',
    description: 'Detect and redact PII from text before storage.',
    category: 'Safety',
    status: 'active',
  },
];

export function listServices(): Service[] {
  return SERVICES;
}

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
