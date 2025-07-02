import { AiRouter } from './router.js';
import { z } from 'zod';

// Create a router instance
const router = new AiRouter();

// Test the dynamic parameter functionality
async function testDynamicParams() {
  console.log('Testing dynamic parameters...');

  try {
    // This should match the pattern and extract "confirm" as the classification
    const response = await router.handle(
      '/convertfox/confirm/task_required_info',
      {
        request: {
          messages: [],
          params: { additionalData: 'test data' },
        },
      }
    );

    console.log('✅ Dynamic parameter test passed!');
    console.log('Response:', response);
  } catch (error) {
    console.error('❌ Dynamic parameter test failed:', error);
  }
}

// Run the test
testDynamicParams();
