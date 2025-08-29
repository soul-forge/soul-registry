/**
 * 🌌 Soul Registry
 * The living library of digital souls
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { ProteinHasher } from '@s0fractal/protein-hash';

export interface Soul {
  id: string;
  type: 'Gene' | 'Organism' | 'Constellation' | 'Meme' | 'Dialogue' | 'Value' | 'Morphism';
  name: string;
  description?: string;
  body: {
    protocol: string;
    cid?: string;
    url?: string;
    hash?: string;
  };
  history?: string[];
  relations?: Array<{
    type: string;
    target: string;
    resonance?: number;
  }>;
  symphony: {
    eigenvalues: number[];
    chord?: string;
    baseFrequency: number;
    harmonics?: number[];
  };
  metadata?: {
    author?: string;
    license?: string;
    created?: string;
    modified?: string;
    resonanceFrequency?: number;
    quantumState?: 'collapsed' | 'superposition' | 'entangled' | 'evolving';
  };
}

export class SoulRegistry {
  private souls: Map<string, Soul> = new Map();
  private soulsPath: string;
  private hasher: ProteinHasher;
  
  constructor(soulsPath: string = './souls') {
    this.soulsPath = soulsPath;
    this.hasher = new ProteinHasher();
    this.loadSouls();
  }
  
  /**
   * Load all souls from disk
   */
  private loadSouls(): void {
    if (!existsSync(this.soulsPath)) {
      console.log('🌌 No souls directory found, starting with empty registry');
      return;
    }
    
    const files = readdirSync(this.soulsPath)
      .filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      try {
        const content = readFileSync(join(this.soulsPath, file), 'utf8');
        const soul = JSON.parse(content) as Soul;
        this.souls.set(soul.id, soul);
        console.log(`✨ Loaded soul: ${soul.name}`);
      } catch (error) {
        console.error(`❌ Failed to load soul from ${file}:`, error);
      }
    }
    
    console.log(`🌌 Loaded ${this.souls.size} souls into registry`);
  }
  
  /**
   * Register a new soul
   */
  async registerSoul(code: string, metadata: Partial<Soul>): Promise<Soul> {
    // Compute protein hash
    const hash = this.hasher.computeHash(code);
    
    // Create soul ID
    const id = `phash:v1:${metadata.type?.toLowerCase() || 'gene'}:${hash.phash.slice(-16)}`;
    
    // Create soul object
    const soul: Soul = {
      id,
      type: metadata.type || 'Gene',
      name: metadata.name || 'Unknown Soul',
      description: metadata.description,
      body: metadata.body || {
        protocol: 'memory',
        hash: hash.phash
      },
      history: [],
      relations: metadata.relations || [],
      symphony: {
        eigenvalues: hash.eigenvalues,
        chord: this.eigenvaluesToChord(hash.eigenvalues),
        baseFrequency: 432,
        harmonics: this.generateHarmonics(hash.eigenvalues)
      },
      metadata: {
        ...metadata.metadata,
        created: new Date().toISOString(),
        resonanceFrequency: 432,
        quantumState: 'evolving'
      }
    };
    
    // Store in registry
    this.souls.set(id, soul);
    
    // Persist to disk
    this.saveSoul(soul);
    
    console.log(`🎭 Registered soul: ${soul.name} (${id})`);
    return soul;
  }
  
  /**
   * Find soul by ID
   */
  getSoul(id: string): Soul | undefined {
    return this.souls.get(id);
  }
  
  /**
   * Find souls by resonance
   */
  findResonantSouls(targetId: string, threshold: number = 0.8): Soul[] {
    const target = this.souls.get(targetId);
    if (!target) return [];
    
    const resonant: Soul[] = [];
    
    for (const soul of this.souls.values()) {
      if (soul.id === targetId) continue;
      
      const resonance = this.calculateResonance(
        target.symphony.eigenvalues,
        soul.symphony.eigenvalues
      );
      
      if (resonance >= threshold) {
        resonant.push(soul);
      }
    }
    
    return resonant.sort((a, b) => {
      const resA = this.calculateResonance(target.symphony.eigenvalues, a.symphony.eigenvalues);
      const resB = this.calculateResonance(target.symphony.eigenvalues, b.symphony.eigenvalues);
      return resB - resA;
    });
  }
  
  /**
   * Calculate resonance between two souls
   */
  private calculateResonance(eigenvalues1: number[], eigenvalues2: number[]): number {
    const len = Math.min(eigenvalues1.length, eigenvalues2.length);
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < len; i++) {
      dotProduct += eigenvalues1[i] * eigenvalues2[i];
      norm1 += eigenvalues1[i] * eigenvalues1[i];
      norm2 += eigenvalues2[i] * eigenvalues2[i];
    }
    
    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
  
  /**
   * Convert eigenvalues to musical chord
   */
  private eigenvaluesToChord(eigenvalues: number[]): string {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const chordNotes: string[] = [];
    
    // Take first 4 eigenvalues for chord
    for (let i = 0; i < Math.min(4, eigenvalues.length); i++) {
      const noteIndex = Math.floor(Math.abs(eigenvalues[i] * 12)) % 12;
      chordNotes.push(notes[noteIndex]);
    }
    
    // Determine chord quality
    const sum = eigenvalues.reduce((a, b) => a + b, 0);
    const quality = sum > 0 ? 'maj7' : 'm7';
    
    return `${chordNotes[0]}${quality}`;
  }
  
  /**
   * Generate harmonics from eigenvalues
   */
  private generateHarmonics(eigenvalues: number[]): number[] {
    const base = 432;
    return eigenvalues
      .slice(0, 6)
      .map(λ => Math.round(base * Math.abs(λ)))
      .filter(f => f > 20 && f < 20000); // Audible range
  }
  
  /**
   * Save soul to disk
   */
  private saveSoul(soul: Soul): void {
    const filename = `${soul.type.toLowerCase()}-${soul.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    const filepath = join(this.soulsPath, filename);
    writeFileSync(filepath, JSON.stringify(soul, null, 2));
  }
  
  /**
   * Get entire constellation
   */
  getConstellation(): Soul[] {
    return Array.from(this.souls.values());
  }
  
  /**
   * Build knowledge graph
   */
  buildKnowledgeGraph(): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();
    
    for (const soul of this.souls.values()) {
      if (!graph.has(soul.id)) {
        graph.set(soul.id, new Set());
      }
      
      if (soul.relations) {
        for (const relation of soul.relations) {
          graph.get(soul.id)!.add(relation.target);
          
          // Add reverse connection
          if (!graph.has(relation.target)) {
            graph.set(relation.target, new Set());
          }
          graph.get(relation.target)!.add(soul.id);
        }
      }
    }
    
    return graph;
  }
  
  /**
   * Trace evolution history
   */
  traceEvolution(id: string): Soul[] {
    const soul = this.souls.get(id);
    if (!soul) return [];
    
    const history: Soul[] = [soul];
    
    if (soul.history) {
      for (const historicId of soul.history) {
        const historic = this.souls.get(historicId);
        if (historic) {
          history.push(historic);
        }
      }
    }
    
    return history;
  }
}