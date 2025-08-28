/**
 * Protein Hash Registry Client
 * Interface to the Library of Code Souls
 */

import { ProteinHasher, ProteinHashResult } from '@soul-forge/protein-hash';
import { Database } from 'sqlite3';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface RegistryEntry {
  phash: string;
  pattern?: string;
  languages: string[];
  eigenvalues: number[];
  complexity: number;
  purity: number;
  examples: CodeExample[];
  first_seen: Date;
  last_seen: Date;
  occurrences: number;
}

export interface CodeExample {
  code: string;
  language: string;
  project?: string;
}

export class ProteinHashRegistry {
  private db: Database;
  private hasher: ProteinHasher;
  private cacheDir: string;
  
  constructor(dbPath: string = './registry.db', cacheDir: string = './cache') {
    this.db = new Database(dbPath);
    this.hasher = new ProteinHasher();
    this.cacheDir = cacheDir;
    this.initDatabase();
  }
  
  private async initDatabase() {
    const run = promisify(this.db.run.bind(this.db));
    
    await run(`
      CREATE TABLE IF NOT EXISTS hashes (
        phash TEXT PRIMARY KEY,
        pattern TEXT,
        eigenvalues TEXT,
        complexity REAL,
        purity REAL,
        first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
        occurrences INTEGER DEFAULT 1
      )
    `);
    
    await run(`
      CREATE TABLE IF NOT EXISTS examples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phash TEXT,
        code TEXT,
        language TEXT,
        project TEXT,
        FOREIGN KEY (phash) REFERENCES hashes(phash)
      )
    `);
    
    await run(`CREATE INDEX IF NOT EXISTS idx_pattern ON hashes(pattern)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_language ON examples(language)`);
  }
  
  /**
   * Look up a hash in the registry
   */
  async lookup(code: string, language: string = 'typescript'): Promise<RegistryEntry | null> {
    // First compute the hash
    const result = this.hasher.computeHash(code);
    
    // Check cache
    const cached = await this.getCached(result.phash);
    if (cached) {
      await this.incrementOccurrence(result.phash);
      return cached;
    }
    
    // Not in registry, store it
    await this.store(result, code, language);
    return this.getCached(result.phash);
  }
  
  /**
   * Store a new hash in the registry
   */
  async store(
    result: ProteinHashResult,
    code: string,
    language: string = 'typescript',
    pattern?: string
  ): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));
    
    // Store hash metadata
    await run(
      `INSERT OR IGNORE INTO hashes (phash, pattern, eigenvalues, complexity, purity)
       VALUES (?, ?, ?, ?, ?)`,
      [
        result.phash,
        pattern || this.detectPattern(code),
        JSON.stringify(result.eigenTop),
        result.complexity,
        result.purity
      ]
    );
    
    // Store example
    await run(
      `INSERT INTO examples (phash, code, language) VALUES (?, ?, ?)`,
      [result.phash, code, language]
    );
    
    // Update cache
    await this.updateCache(result.phash);
  }
  
  /**
   * Get cached entry
   */
  private async getCached(phash: string): Promise<RegistryEntry | null> {
    const get = promisify(this.db.get.bind(this.db));
    const all = promisify(this.db.all.bind(this.db));
    
    const hash = await get('SELECT * FROM hashes WHERE phash = ?', [phash]);
    if (!hash) return null;
    
    const examples = await all(
      'SELECT code, language, project FROM examples WHERE phash = ?',
      [phash]
    );
    
    return {
      phash: hash.phash,
      pattern: hash.pattern,
      languages: [...new Set(examples.map((e: any) => e.language))],
      eigenvalues: JSON.parse(hash.eigenvalues),
      complexity: hash.complexity,
      purity: hash.purity,
      examples: examples as CodeExample[],
      first_seen: new Date(hash.first_seen),
      last_seen: new Date(hash.last_seen),
      occurrences: hash.occurrences
    };
  }
  
  /**
   * Detect common patterns
   */
  private detectPattern(code: string): string | undefined {
    const patterns = {
      'binary_addition': /\+/,
      'binary_subtraction': /-/,
      'binary_multiplication': /\*/,
      'binary_division': /\//,
      'comparison': /[<>]=?|===?|!==?/,
      'array_map': /\.map\(/,
      'array_filter': /\.filter\(/,
      'array_reduce': /\.reduce\(/,
      'async_function': /async/,
      'promise': /Promise/,
      'recursion': /function\s+(\w+)[^}]*\1\(/
    };
    
    for (const [name, regex] of Object.entries(patterns)) {
      if (regex.test(code)) return name;
    }
    
    return undefined;
  }
  
  /**
   * Increment occurrence count
   */
  private async incrementOccurrence(phash: string): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));
    await run(
      `UPDATE hashes SET occurrences = occurrences + 1, last_seen = CURRENT_TIMESTAMP
       WHERE phash = ?`,
      [phash]
    );
  }
  
  /**
   * Update file cache
   */
  private async updateCache(phash: string): Promise<void> {
    const entry = await this.getCached(phash);
    if (!entry) return;
    
    const hashDir = path.join(this.cacheDir, 'by-hash', phash);
    await fs.mkdir(hashDir, { recursive: true });
    await fs.writeFile(
      path.join(hashDir, 'metadata.json'),
      JSON.stringify(entry, null, 2)
    );
  }
  
  /**
   * Get statistics
   */
  async getStats(): Promise<{
    totalHashes: number;
    totalExamples: number;
    topPatterns: Array<{ pattern: string; count: number }>;
    languages: string[];
  }> {
    const get = promisify(this.db.get.bind(this.db));
    const all = promisify(this.db.all.bind(this.db));
    
    const hashCount = await get('SELECT COUNT(*) as count FROM hashes');
    const exampleCount = await get('SELECT COUNT(*) as count FROM examples');
    const patterns = await all(
      `SELECT pattern, COUNT(*) as count FROM hashes 
       WHERE pattern IS NOT NULL 
       GROUP BY pattern 
       ORDER BY count DESC 
       LIMIT 10`
    );
    const languages = await all('SELECT DISTINCT language FROM examples');
    
    return {
      totalHashes: hashCount.count,
      totalExamples: exampleCount.count,
      topPatterns: patterns,
      languages: languages.map((l: any) => l.language)
    };
  }
}

// Export for CLI usage
export { ProteinHasher } from '@soul-forge/protein-hash';