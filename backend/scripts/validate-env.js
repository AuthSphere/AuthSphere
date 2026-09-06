import { validateEnv } from '../src/configs/env.js';

try {
  validateEnv();
  console.log('✅ All required environment variables are set.');
} catch (err) {
  console.error('❌ Environment validation failed:', err);
  process.exit(1);
}
