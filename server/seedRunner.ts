
import { seedDatabase } from './seedData';

async function runSeed() {
  try {
    console.log('🌱 Starting database seed...');
    const result = await seedDatabase();
    console.log('📊 Seed Summary:', result);
    process.exit(0);
  } catch (error) {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  }
}

runSeed();
