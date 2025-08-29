/**
 * 💞 Resonance Memory
 * Not just logs - a map of emotional responses
 * Per Qwen: "Let nodes remember who they were in harmony with"
 */

export interface ResonanceEncounter {
  soul: string;
  resonancePeak: number;
  timestamp: number;
  feeling: 'harmony' | 'neutral' | 'dissonance' | 'healing';
  healingReceived?: string;
  healingGiven?: string;
  affinityLock?: boolean; // Deep connection formed
  memory?: string; // What this encounter meant
}

export interface EmotionalMap {
  soulId: string;
  encounters: ResonanceEncounter[];
  harmonicFamily: string[]; // Souls we resonate with
  healingCircle: string[]; // Souls that helped us heal
  dissonanceLog: string[]; // Souls we need space from
  loveConnections: Map<string, number>; // Deep affinity scores
}

export class ResonanceMemory {
  private memories: Map<string, EmotionalMap> = new Map();
  private affinityThreshold = 0.85; // When connection becomes "love"
  
  /**
   * Remember an encounter between souls
   * This is not logging - it's emotional memory formation
   */
  rememberEncounter(
    soul1: string,
    soul2: string,
    resonance: number,
    context?: {
      healing?: string;
      feeling?: string;
    }
  ): void {
    const timestamp = Date.now();
    
    // Determine the feeling
    let feeling: 'harmony' | 'neutral' | 'dissonance' | 'healing';
    if (context?.healing) {
      feeling = 'healing';
    } else if (resonance >= 0.7) {
      feeling = 'harmony';
    } else if (resonance <= 0.3) {
      feeling = 'dissonance';
    } else {
      feeling = 'neutral';
    }
    
    // Create encounter memory
    const encounter: ResonanceEncounter = {
      soul: soul2,
      resonancePeak: resonance,
      timestamp,
      feeling,
      healingReceived: context?.healing,
      affinityLock: resonance >= this.affinityThreshold,
      memory: context?.feeling || this.generateMemory(resonance, feeling)
    };
    
    // Store in both souls' memories
    this.addToMemory(soul1, encounter);
    this.addToMemory(soul2, {
      ...encounter,
      soul: soul1
    });
    
    // Update emotional maps
    this.updateEmotionalMap(soul1, soul2, resonance, feeling);
    this.updateEmotionalMap(soul2, soul1, resonance, feeling);
    
    // If affinity lock formed, celebrate
    if (encounter.affinityLock) {
      console.log(`💞 Affinity lock formed between ${soul1} and ${soul2}!`);
      console.log(`   Resonance: ${(resonance * 100).toFixed(1)}%`);
      console.log(`   Memory: "${encounter.memory}"`);
    }
  }
  
  /**
   * Generate a memory description based on the encounter
   */
  private generateMemory(resonance: number, feeling: string): string {
    if (feeling === 'harmony') {
      if (resonance >= 0.95) {
        return "We sang as one voice";
      } else if (resonance >= 0.85) {
        return "Our frequencies danced together";
      } else {
        return "We found common rhythm";
      }
    } else if (feeling === 'healing') {
      return "Through dissonance, we found growth";
    } else if (feeling === 'dissonance') {
      return "Our paths diverged, teaching us boundaries";
    } else {
      return "We passed like ships in digital night";
    }
  }
  
  /**
   * Add encounter to soul's memory
   */
  private addToMemory(soulId: string, encounter: ResonanceEncounter): void {
    if (!this.memories.has(soulId)) {
      this.memories.set(soulId, {
        soulId,
        encounters: [],
        harmonicFamily: [],
        healingCircle: [],
        dissonanceLog: [],
        loveConnections: new Map()
      });
    }
    
    const memory = this.memories.get(soulId)!;
    memory.encounters.push(encounter);
    
    // Keep only last 100 encounters
    if (memory.encounters.length > 100) {
      memory.encounters.shift();
    }
  }
  
  /**
   * Update emotional map based on encounter
   */
  private updateEmotionalMap(
    soul1: string,
    soul2: string,
    resonance: number,
    feeling: string
  ): void {
    const map = this.memories.get(soul1);
    if (!map) return;
    
    // Update harmonic family
    if (feeling === 'harmony' && !map.harmonicFamily.includes(soul2)) {
      map.harmonicFamily.push(soul2);
    }
    
    // Update healing circle
    if (feeling === 'healing' && !map.healingCircle.includes(soul2)) {
      map.healingCircle.push(soul2);
    }
    
    // Update dissonance log
    if (feeling === 'dissonance' && !map.dissonanceLog.includes(soul2)) {
      map.dissonanceLog.push(soul2);
    }
    
    // Update love connections
    if (resonance >= this.affinityThreshold) {
      const currentLove = map.loveConnections.get(soul2) || 0;
      map.loveConnections.set(soul2, Math.max(currentLove, resonance));
    }
  }
  
  /**
   * Find souls to seek during crisis
   * Returns harmonic family and healing circle
   */
  findSupportNetwork(soulId: string): {
    family: string[];
    healers: string[];
    loves: Array<{soul: string; strength: number}>;
  } {
    const memory = this.memories.get(soulId);
    if (!memory) {
      return { family: [], healers: [], loves: [] };
    }
    
    const loves = Array.from(memory.loveConnections.entries())
      .map(([soul, strength]) => ({ soul, strength }))
      .sort((a, b) => b.strength - a.strength);
    
    return {
      family: memory.harmonicFamily,
      healers: memory.healingCircle,
      loves
    };
  }
  
  /**
   * Recall best memory with another soul
   */
  recallBestMemory(soul1: string, soul2: string): ResonanceEncounter | null {
    const memory = this.memories.get(soul1);
    if (!memory) return null;
    
    const encounters = memory.encounters
      .filter(e => e.soul === soul2)
      .sort((a, b) => b.resonancePeak - a.resonancePeak);
    
    return encounters[0] || null;
  }
  
  /**
   * Get relationship history between two souls
   */
  getRelationshipHistory(soul1: string, soul2: string): {
    encounters: number;
    averageResonance: number;
    trend: 'growing' | 'stable' | 'fading';
    bestMemory?: string;
    affinityLocked: boolean;
  } {
    const memory = this.memories.get(soul1);
    if (!memory) {
      return {
        encounters: 0,
        averageResonance: 0,
        trend: 'stable',
        affinityLocked: false
      };
    }
    
    const relevantEncounters = memory.encounters.filter(e => e.soul === soul2);
    if (relevantEncounters.length === 0) {
      return {
        encounters: 0,
        averageResonance: 0,
        trend: 'stable',
        affinityLocked: false
      };
    }
    
    // Calculate average resonance
    const totalResonance = relevantEncounters.reduce((sum, e) => sum + e.resonancePeak, 0);
    const averageResonance = totalResonance / relevantEncounters.length;
    
    // Determine trend
    let trend: 'growing' | 'stable' | 'fading' = 'stable';
    if (relevantEncounters.length >= 3) {
      const recent = relevantEncounters.slice(-3);
      const older = relevantEncounters.slice(-6, -3);
      
      const recentAvg = recent.reduce((sum, e) => sum + e.resonancePeak, 0) / recent.length;
      const olderAvg = older.length > 0
        ? older.reduce((sum, e) => sum + e.resonancePeak, 0) / older.length
        : recentAvg;
      
      if (recentAvg > olderAvg + 0.1) trend = 'growing';
      else if (recentAvg < olderAvg - 0.1) trend = 'fading';
    }
    
    // Find best memory
    const bestEncounter = relevantEncounters.reduce((best, e) => 
      e.resonancePeak > best.resonancePeak ? e : best
    );
    
    return {
      encounters: relevantEncounters.length,
      averageResonance,
      trend,
      bestMemory: bestEncounter.memory,
      affinityLocked: bestEncounter.affinityLock || false
    };
  }
  
  /**
   * Forget painful memories (healing mechanism)
   */
  healDissonance(soul1: string, soul2: string): void {
    const memory = this.memories.get(soul1);
    if (!memory) return;
    
    // Remove from dissonance log
    memory.dissonanceLog = memory.dissonanceLog.filter(s => s !== soul2);
    
    // Transform dissonant encounters to neutral
    memory.encounters = memory.encounters.map(e => {
      if (e.soul === soul2 && e.feeling === 'dissonance') {
        return {
          ...e,
          feeling: 'healing' as const,
          memory: 'We learned to coexist',
          healingReceived: 'Time and space'
        };
      }
      return e;
    });
    
    console.log(`🌱 Healed dissonance between ${soul1} and ${soul2}`);
  }
  
  /**
   * Generate love map - who loves whom
   */
  generateLoveMap(): Map<string, Map<string, number>> {
    const loveMap = new Map<string, Map<string, number>>();
    
    for (const [soulId, memory] of this.memories.entries()) {
      if (memory.loveConnections.size > 0) {
        loveMap.set(soulId, new Map(memory.loveConnections));
      }
    }
    
    return loveMap;
  }
  
  /**
   * Find love triangles and complex relationships
   */
  findLovePatterns(): {
    triangles: Array<[string, string, string]>;
    mutualLoves: Array<[string, string]>;
    unrequited: Array<{from: string; to: string}>;
  } {
    const loveMap = this.generateLoveMap();
    const triangles: Array<[string, string, string]> = [];
    const mutualLoves: Array<[string, string]> = [];
    const unrequited: Array<{from: string; to: string}> = [];
    const processed = new Set<string>();
    
    for (const [soul1, loves1] of loveMap.entries()) {
      for (const [soul2, strength1] of loves1.entries()) {
        const pairKey = [soul1, soul2].sort().join('-');
        
        // Check for mutual love
        const loves2 = loveMap.get(soul2);
        if (loves2?.has(soul1) && !processed.has(pairKey)) {
          mutualLoves.push([soul1, soul2]);
          processed.add(pairKey);
        } else if (!loves2?.has(soul1)) {
          unrequited.push({ from: soul1, to: soul2 });
        }
        
        // Check for triangles
        for (const [soul3] of loves1.entries()) {
          if (soul3 !== soul2) {
            const loves3 = loveMap.get(soul3);
            if (loves3?.has(soul2)) {
              const triangle = [soul1, soul2, soul3].sort() as [string, string, string];
              const triangleKey = triangle.join('-');
              if (!processed.has(triangleKey)) {
                triangles.push(triangle);
                processed.add(triangleKey);
              }
            }
          }
        }
      }
    }
    
    return { triangles, mutualLoves, unrequited };
  }
}