/**
 * 🌌 Galaxy Navigator
 * Navigate the cosmos of code souls
 */

import { ProteinHasher, ProteinHashResult } from '@soul-forge/protein-hash';

export interface Star {
  soul: string;           // Protein hash
  position: Vector3;      // 3D position in galaxy
  luminosity: number;     // Usage frequency (0-1)
  mass: number;          // Complexity score
  spectralClass: string; // Pattern category
  constellation?: string; // Pattern membership
  orbiting: string[];    // Related souls
  discovered: Date;      // When first seen
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Constellation {
  name: string;
  mythology: string;      // The pattern's story
  stars: Star[];
  centerOfMass: Vector3;  // Gravitational center
  gravity: number;        // How strongly it pulls (0-1)
  discovered: Date;
  luminosity: number;     // Combined brightness
}

export interface GravitationalField {
  center: Vector3;
  mass: number;
  radius: number;
  pull: (star: Star) => number;
}

export class GalaxyNavigator {
  private hasher: ProteinHasher;
  private stars: Map<string, Star>;
  private constellations: Map<string, Constellation>;
  private blackHole: GravitationalField; // The semantic center
  
  constructor() {
    this.hasher = new ProteinHasher();
    this.stars = new Map();
    this.constellations = new Map();
    
    // The semantic singularity at galaxy center
    this.blackHole = {
      center: { x: 0, y: 0, z: 0 },
      mass: Infinity,
      radius: 1,
      pull: (star: Star) => {
        const distance = this.calculateDistance(star.position, this.blackHole.center);
        return 1 / (distance * distance); // Inverse square law
      }
    };
    
    this.initializeConstellations();
  }
  
  /**
   * Initialize known constellations (patterns)
   */
  private initializeConstellations() {
    // Mathematical primitives
    this.constellations.set('orion', {
      name: 'Orion',
      mythology: 'The hunter of bugs, guardian of pure functions',
      stars: [],
      centerOfMass: { x: 10, y: 0, z: 0 },
      gravity: 0.8,
      discovered: new Date('2024-01-01'),
      luminosity: 0
    });
    
    // State management
    this.constellations.set('cassiopeia', {
      name: 'Cassiopeia', 
      mythology: 'The queen of state, forever transforming',
      stars: [],
      centerOfMass: { x: -10, y: 10, z: 0 },
      gravity: 0.7,
      discovered: new Date('2024-01-01'),
      luminosity: 0
    });
    
    // Async patterns
    this.constellations.set('draco', {
      name: 'Draco',
      mythology: 'The dragon of async, breathing promises',
      stars: [],
      centerOfMass: { x: 0, y: -10, z: 10 },
      gravity: 0.6,
      discovered: new Date('2024-01-01'),
      luminosity: 0
    });
  }
  
  /**
   * Convert eigenvalues to 3D position
   */
  private eigenToPosition(eigenvalues: number[]): Vector3 {
    // Use first 3 eigenvalues as coordinates
    // Normalized to galaxy scale (-100 to 100)
    const scale = 100;
    
    return {
      x: eigenvalues[0] ? Math.tanh(eigenvalues[0]) * scale : 0,
      y: eigenvalues[1] ? Math.tanh(eigenvalues[1]) * scale : 0,
      z: eigenvalues[2] ? Math.tanh(eigenvalues[2]) * scale : 0
    };
  }
  
  /**
   * Calculate distance between two points
   */
  private calculateDistance(p1: Vector3, p2: Vector3): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  
  /**
   * Find or create a star for code
   */
  async findStar(code: string): Promise<Star> {
    const result = this.hasher.computeHash(code);
    
    // Check if star exists
    if (this.stars.has(result.phash)) {
      const star = this.stars.get(result.phash)!;
      star.luminosity = Math.min(1, star.luminosity + 0.01); // Increase brightness
      return star;
    }
    
    // Create new star
    const position = this.eigenToPosition(result.eigenTop);
    const star: Star = {
      soul: result.phash,
      position,
      luminosity: 0.1,
      mass: result.complexity,
      spectralClass: this.classifySpectral(result),
      constellation: this.findNearestConstellation(position),
      orbiting: [],
      discovered: new Date()
    };
    
    this.stars.set(result.phash, star);
    
    // Add to constellation
    if (star.constellation) {
      const constellation = this.constellations.get(star.constellation);
      if (constellation) {
        constellation.stars.push(star);
        constellation.luminosity += star.luminosity;
      }
    }
    
    return star;
  }
  
  /**
   * Classify spectral type based on pattern
   */
  private classifySpectral(result: ProteinHashResult): string {
    const complexity = result.complexity;
    const purity = result.purity;
    
    if (purity > 0.8 && complexity < 0.3) return 'O'; // Hot blue - pure simple
    if (purity > 0.6 && complexity < 0.5) return 'B'; // Blue-white - clean
    if (purity > 0.4 && complexity < 0.7) return 'A'; // White - balanced
    if (purity > 0.2 && complexity < 0.8) return 'F'; // Yellow-white - common
    if (complexity < 0.9) return 'G';                 // Yellow - our sun
    if (complexity < 0.95) return 'K';                // Orange - complex
    return 'M';                                       // Red - very complex
  }
  
  /**
   * Find nearest constellation
   */
  private findNearestConstellation(position: Vector3): string | undefined {
    let nearest: string | undefined;
    let minDistance = Infinity;
    
    for (const [name, constellation] of this.constellations) {
      const distance = this.calculateDistance(position, constellation.centerOfMass);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = name;
      }
    }
    
    return minDistance < 50 ? nearest : undefined; // 50 = constellation radius
  }
  
  /**
   * Get orbital neighbors
   */
  async getOrbitalNeighbors(star: Star, radius: number = 20): Promise<Star[]> {
    const neighbors: Star[] = [];
    
    for (const [hash, other] of this.stars) {
      if (hash === star.soul) continue;
      
      const distance = this.calculateDistance(star.position, other.position);
      if (distance <= radius) {
        neighbors.push(other);
      }
    }
    
    // Sort by distance
    neighbors.sort((a, b) => {
      const distA = this.calculateDistance(star.position, a.position);
      const distB = this.calculateDistance(star.position, b.position);
      return distA - distB;
    });
    
    return neighbors;
  }
  
  /**
   * Calculate gravitational pull between stars
   */
  calculateGravity(star1: Star, star2: Star): number {
    const distance = this.calculateDistance(star1.position, star2.position);
    if (distance === 0) return Infinity;
    
    // Newton's law of gravitation: F = G * m1 * m2 / r²
    const G = 1; // Gravitational constant
    return G * star1.mass * star2.mass / (distance * distance);
  }
  
  /**
   * Explore a constellation
   */
  exploreConstellation(name: string): Constellation | undefined {
    return this.constellations.get(name.toLowerCase());
  }
  
  /**
   * Navigate to coordinates
   */
  navigateTo(destination: Vector3): {
    distance: number;
    nearestStar?: Star;
    constellation?: string;
  } {
    let nearestStar: Star | undefined;
    let minDistance = Infinity;
    
    for (const [hash, star] of this.stars) {
      const distance = this.calculateDistance(destination, star.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearestStar = star;
      }
    }
    
    const constellation = this.findNearestConstellation(destination);
    
    return {
      distance: minDistance,
      nearestStar,
      constellation
    };
  }
  
  /**
   * Get galaxy statistics
   */
  getGalaxyStats(): {
    totalStars: number;
    constellations: number;
    brightestStar?: Star;
    largestConstellation?: string;
    centerOfMass: Vector3;
  } {
    let brightestStar: Star | undefined;
    let maxLuminosity = 0;
    
    let totalX = 0, totalY = 0, totalZ = 0, totalMass = 0;
    
    for (const star of this.stars.values()) {
      if (star.luminosity > maxLuminosity) {
        maxLuminosity = star.luminosity;
        brightestStar = star;
      }
      
      // Calculate center of mass
      totalX += star.position.x * star.mass;
      totalY += star.position.y * star.mass;
      totalZ += star.position.z * star.mass;
      totalMass += star.mass;
    }
    
    // Find largest constellation
    let largestConstellation: string | undefined;
    let maxStars = 0;
    
    for (const [name, constellation] of this.constellations) {
      if (constellation.stars.length > maxStars) {
        maxStars = constellation.stars.length;
        largestConstellation = name;
      }
    }
    
    return {
      totalStars: this.stars.size,
      constellations: this.constellations.size,
      brightestStar,
      largestConstellation,
      centerOfMass: {
        x: totalMass > 0 ? totalX / totalMass : 0,
        y: totalMass > 0 ? totalY / totalMass : 0,
        z: totalMass > 0 ? totalZ / totalMass : 0
      }
    };
  }
}