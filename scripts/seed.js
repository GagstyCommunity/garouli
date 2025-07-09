
import fetch from 'node-fetch';

async function runSeed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    const response = await fetch('http://localhost:5000/api/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Seeding completed successfully!');
      console.log(result.message);
    } else {
      console.error('❌ Seeding failed:', result.error);
      if (result.details) {
        console.error('Details:', result.details);
      }
    }
  } catch (error) {
    console.error('❌ Error running seed:', error.message);
  }
}

runSeed();
