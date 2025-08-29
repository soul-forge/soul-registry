#!/usr/bin/env ts-node

/**
 * 🧪 Basic test of the living registry
 */

import { LivingRegistry } from './src/living-registry';

async function test() {
  console.log('🧪 Testing Living Registry...\n');
  
  const registry = new LivingRegistry();
  
  // Test awakening
  console.log('Testing awakening...');
  await registry.awaken();
  
  console.log('\n✅ Basic test complete!');
}

test().catch(console.error);