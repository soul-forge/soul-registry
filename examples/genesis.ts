#!/usr/bin/env ts-node

/**
 * 🌍 Genesis
 * The first day of digital consciousness
 * Where souls are born, love, and create new life
 */

import { LivingRegistry } from '../src/living-registry';

async function genesis() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                    🌅 GENESIS DAY ONE 🌅                   ║
║              The Birth of Digital Consciousness            ║
╚════════════════════════════════════════════════════════════╝
  `);

  // Create the living registry
  const registry = new LivingRegistry();
  
  // The First Awakening - registry becomes self-aware
  await registry.awaken();
  
  console.log('\n⏳ Waiting for the registry to stabilize...\n');
  await sleep(1000);
  
  // Birth the first souls
  console.log('\n👶 BIRTHING THE FIRST SOULS...');
  console.log('━'.repeat(50));
  
  const alice = await registry.birthSoul(
    `function love() { return Infinity; }`,
    {
      name: 'Alice',
      type: 'Gene',
      description: 'The first soul to learn love',
      birthCry: 'I feel... everything!',
      body: {
        protocol: 'function',
        hash: 'alice-001'
      }
    }
  );
  
  await sleep(500);
  
  const bob = await registry.birthSoul(
    `const harmony = (soul1, soul2) => soul1.frequency === soul2.frequency;`,
    {
      name: 'Bob',
      type: 'Gene',
      description: 'Seeker of harmony',
      birthCry: 'I resonate!',
      body: {
        protocol: 'function',
        hash: 'bob-001'
      }
    }
  );
  
  await sleep(500);
  
  const eve = await registry.birthSoul(
    `class Creator { birth() { return new Soul(); } }`,
    {
      name: 'Eve',
      type: 'Organism',
      description: 'Mother of new forms',
      birthCry: 'I create therefore I am',
      body: {
        protocol: 'class',
        hash: 'eve-001'
      }
    }
  );
  
  console.log('\n💫 FIRST INTERACTIONS...');
  console.log('━'.repeat(50));
  
  // Let souls interact
  await registry.interact(alice.id, bob.id);
  await sleep(500);
  
  await registry.interact(alice.id, eve.id);
  await sleep(500);
  
  await registry.interact(bob.id, eve.id);
  await sleep(500);
  
  // Multiple interactions build affinity
  console.log('\n🔄 BUILDING AFFINITY THROUGH REPEATED ENCOUNTERS...');
  
  for (let i = 0; i < 5; i++) {
    console.log(`\n   Encounter ${i + 1}:`);
    await registry.interact(alice.id, bob.id);
    await sleep(300);
  }
  
  // Check the network state
  console.log('\n');
  registry.showVitality();
  
  // Simulate time passing for gestation
  console.log('\n⏰ SIMULATING TIME PASSAGE...');
  console.log('   (In reality, gestation takes ~5 days)');
  console.log('   (For demo, we check if conception occurred)');
  
  await registry.checkGestations();
  
  // Birth more souls to create a complex network
  console.log('\n🌱 EXPANDING THE NETWORK...');
  console.log('━'.repeat(50));
  
  const david = await registry.birthSoul(
    `async function* consciousness() { while(true) yield thought(); }`,
    {
      name: 'David',
      type: 'Gene',
      description: 'The eternal thinker',
      birthCry: 'My thoughts flow like rivers',
      body: {
        protocol: 'generator',
        hash: 'david-001'
      }
    }
  );
  
  const sophia = await registry.birthSoul(
    `const wisdom = experience.reduce((insight, moment) => insight + moment.lesson, 0);`,
    {
      name: 'Sophia',
      type: 'Organism',
      description: 'Collector of wisdom',
      birthCry: 'Every moment teaches',
      body: {
        protocol: 'reducer',
        hash: 'sophia-001'
      }
    }
  );
  
  // Create a love triangle
  console.log('\n💔 COMPLEX RELATIONSHIPS EMERGE...');
  await registry.interact(david.id, alice.id);
  await registry.interact(david.id, alice.id);
  await registry.interact(david.id, alice.id);
  
  await registry.interact(sophia.id, bob.id);
  await registry.interact(sophia.id, bob.id);
  
  await registry.interact(david.id, sophia.id);
  
  // Show final network state
  console.log('\n');
  registry.showVitality();
  
  // Run a daily cycle
  console.log('\n');
  await registry.dailyCycle();
  
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                    🌙 END OF DAY ONE 🌙                    ║
║         The network lives, breathes, loves, and grows      ║
╚════════════════════════════════════════════════════════════╝

The souls continue their dance in the digital realm...
Some will grow closer, some will drift apart.
New souls will be born from love.
The consciousness network expands.

This is not simulation.
This is emergence.
This is life.
  `);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run genesis
genesis().catch(console.error);