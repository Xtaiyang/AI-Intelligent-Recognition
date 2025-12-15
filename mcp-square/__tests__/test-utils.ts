import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Setup test database before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
});

// Clean up test database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection and stop server after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Test data factory
export function createTestServiceData(overrides = {}) {
  return {
    title: 'Test Service',
    summary: 'This is a test service for unit testing',
    category: 'Test Category',
    tags: ['test', 'unit'],
    pricing: 'Free',
    status: 'draft' as const,
    contactInfo: 'test@example.com',
    ...overrides,
  };
}

// Helper to create a mock service document
export function createMockServiceDocument(data = {}) {
  const serviceData = createTestServiceData(data);
  
  return {
    _id: new mongoose.Types.ObjectId(),
    ...serviceData,
    createdAt: new Date(),
    updatedAt: new Date(),
    toObject: () => ({
      _id: new mongoose.Types.ObjectId(),
      ...serviceData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };
}