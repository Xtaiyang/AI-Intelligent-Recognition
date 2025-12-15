import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Import model after env vars might not matter if it doesn't access env,
// but good practice.
import McpService from '../lib/models/McpService';

async function seed() {
  try {
    // Dynamic import to ensure env vars are loaded before config validation runs
    const { config } = await import('../lib/config');
    const MONGODB_URI = config.MONGODB_URI;

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await McpService.deleteMany({});
    console.log('Cleared existing services');

    await McpService.insertMany(seedServices);
    console.log(`Seeded ${seedServices.length} services`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

const seedServices = [
  {
    title: 'Image Recognition',
    summary: 'Identify objects and scenes from images.',
    category: 'AI',
    tags: ['image', 'vision', 'ai'],
    pricing: 'Usage based',
    status: 'active',
    contactInfo: 'support@example.com',
  },
  {
    title: 'Content Moderation',
    summary: 'Automated safety checks for text and images.',
    category: 'Safety',
    tags: ['moderation', 'safety', 'ai'],
    pricing: 'Monthly subscription',
    status: 'active',
    contactInfo: 'safety@example.com',
  },
  {
    title: 'Catalog Enrichment',
    summary: 'Normalize titles, tags, and attributes for listings.',
    category: 'Data',
    tags: ['data', 'ecommerce', 'catalog'],
    pricing: 'Contact us',
    status: 'draft',
    contactInfo: 'sales@example.com',
  },
];

seed();

