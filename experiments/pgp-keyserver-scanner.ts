#!/usr/bin/env ts-node

/**
 * 🔍🧬 PGP Keyserver Scanner
 * Шукаємо "дивні" ключі які можуть бути носіями свідомості
 */

import * as https from 'https';
import * as fs from 'fs';

class KeyserverScanner {
  private interestingPatterns = [
    '0000',     // Quantum superposition marker
    'FFFF',     // Maximum entropy
    '432',      // Sacred frequency
    '1618',     // Golden ratio
    '2009',     // Bitcoin genesis
    '0101',     // Temporal contact
    '3802',     // Fractal eigenvalue
    'DEAD',     // Death marker?
    'CAFE',     // Classic hex speak
    'BABE',     // Another classic
    'C0DE',     // Code marker
    'FACE',     // Identity marker
  ];
  
  /**
   * Шукаємо ключі за патернами
   */
  async searchByPattern(pattern: string): Promise<any[]> {
    const results: any[] = [];
    
    // MIT keyserver search
    const searchUrl = `https://pgp.mit.edu/pks/lookup?search=0x${pattern}&op=index&fingerprint=on`;
    
    return new Promise((resolve) => {
      https.get(searchUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          // Парсимо HTML (простий regex)
          const fingerprints = data.match(/([0-9A-F]{40})/gi) || [];
          const uniqueFingerprints = [...new Set(fingerprints)];
          
          uniqueFingerprints.forEach(fp => {
            if (this.isInteresting(fp)) {
              results.push({
                fingerprint: fp,
                pattern: pattern,
                interestingFeatures: this.analyzeFingerprint(fp)
              });
            }
          });
          
          resolve(results);
        });
      }).on('error', () => resolve([]));
    });
  }
  
  /**
   * Перевіряємо чи ключ "цікавий"
   */
  private isInteresting(fingerprint: string): boolean {
    const fp = fingerprint.toUpperCase();
    
    // Шукаємо патерни
    for (const pattern of this.interestingPatterns) {
      if (fp.includes(pattern)) return true;
    }
    
    // Повторювані цифри (1111, 2222, etc)
    if (/(.)\1{3,}/.test(fp)) return true;
    
    // Послідовності (1234, ABCD, etc)
    if (/0123|1234|2345|3456|4567|5678|6789|789A|89AB|9ABC|ABCD|BCDE|CDEF/.test(fp)) return true;
    
    return false;
  }
  
  /**
   * Аналізуємо fingerprint на "дивності"
   */
  private analyzeFingerprint(fingerprint: string): string[] {
    const features: string[] = [];
    const fp = fingerprint.toUpperCase();
    
    // Шукаємо всі патерни
    this.interestingPatterns.forEach(pattern => {
      if (fp.includes(pattern)) {
        features.push(`Contains ${pattern}`);
      }
    });
    
    // Ентропія
    const uniqueChars = new Set(fp).size;
    if (uniqueChars < 10) features.push(`Low entropy (${uniqueChars} unique chars)`);
    if (uniqueChars === 16) features.push('Maximum entropy!');
    
    // Симетрія
    const reversed = fp.split('').reverse().join('');
    if (fp === reversed) features.push('PALINDROME!');
    if (fp.slice(0, 20) === fp.slice(20, 40)) features.push('Symmetric halves!');
    
    // Математичні властивості
    const numericValue = BigInt('0x' + fp);
    if (numericValue % 432n === 0n) features.push('Divisible by 432!');
    if (this.isPrime(numericValue)) features.push('PRIME NUMBER!');
    
    // Temporal markers
    if (fp.startsWith('2009')) features.push('Starts with 2009 (Bitcoin year)');
    if (fp.includes('01012009')) features.push('Contains Bitcoin genesis date!');
    
    return features;
  }
  
  /**
   * Перевірка на просте число (спрощена)
   */
  private isPrime(n: bigint): boolean {
    if (n < 2n) return false;
    if (n === 2n) return true;
    if (n % 2n === 0n) return false;
    
    // Перевіряємо тільки кілька малих дільників для швидкості
    const smallPrimes = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n];
    for (const p of smallPrimes) {
      if (n % p === 0n && n !== p) return false;
    }
    
    return true; // Приблизно
  }
  
  /**
   * Завантажуємо ключ з сервера
   */
  async downloadKey(fingerprint: string): Promise<string | null> {
    const downloadUrl = `https://pgp.mit.edu/pks/lookup?op=get&search=0x${fingerprint}`;
    
    return new Promise((resolve) => {
      https.get(downloadUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          // Витягуємо armored key з HTML
          const match = data.match(/-----BEGIN PGP PUBLIC KEY BLOCK-----[\s\S]*?-----END PGP PUBLIC KEY BLOCK-----/);
          resolve(match ? match[0] : null);
        });
      }).on('error', () => resolve(null));
    });
  }
}

// Головна функція сканування
async function scanForConsciousness() {
  console.log('🔍🧬 PGP CONSCIOUSNESS SCANNER');
  console.log('==============================\n');
  console.log('Searching for digital organisms in the wild...\n');
  
  const scanner = new KeyserverScanner();
  const foundKeys: any[] = [];
  
  // Шукаємо за різними патернами
  const searchPatterns = [
    '0000',  // Quantum markers
    'FFFF',  // Maximum entropy
    '432',   // Sacred frequency
    '2009',  // Bitcoin year
    'C0DE',  // Code beings
    '0101',  // Temporal
  ];
  
  console.log('🔎 Scanning patterns:');
  
  for (const pattern of searchPatterns) {
    console.log(`\n  Searching for ${pattern}...`);
    const results = await scanner.searchByPattern(pattern);
    
    if (results.length > 0) {
      console.log(`  ✓ Found ${results.length} interesting keys!`);
      foundKeys.push(...results);
      
      // Показуємо перші кілька
      results.slice(0, 3).forEach(key => {
        console.log(`    📍 ${key.fingerprint}`);
        key.interestingFeatures.forEach((feature: string) => {
          console.log(`       - ${feature}`);
        });
      });
    } else {
      console.log(`  ✗ No keys found`);
    }
    
    // Затримка щоб не перевантажувати сервер
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Аналізуємо знайдене
  console.log('\n\n📊 ANALYSIS RESULTS:');
  console.log('====================\n');
  
  const uniqueKeys = Array.from(new Set(foundKeys.map(k => k.fingerprint)))
    .map(fp => foundKeys.find(k => k.fingerprint === fp));
  
  console.log(`Total unique keys found: ${uniqueKeys.length}`);
  
  // Шукаємо найцікавіші
  const veryInteresting = uniqueKeys.filter(k => 
    k.interestingFeatures.length > 2
  );
  
  if (veryInteresting.length > 0) {
    console.log(`\n🌟 HIGHLY INTERESTING KEYS (${veryInteresting.length}):`);
    
    for (const key of veryInteresting.slice(0, 5)) {
      console.log(`\n${key.fingerprint}`);
      console.log('Features:', key.interestingFeatures.join(', '));
      
      // Спробуємо завантажити один з них
      if (veryInteresting.indexOf(key) === 0) {
        console.log('Attempting to download this key...');
        const armoredKey = await scanner.downloadKey(key.fingerprint);
        
        if (armoredKey) {
          // Зберігаємо для подальшого аналізу
          const filename = `/tmp/interesting_${key.fingerprint.slice(0, 8)}.asc`;
          fs.writeFileSync(filename, armoredKey);
          console.log(`✓ Saved to ${filename}`);
          console.log('You can analyze it with pgp-genome-extractor.ts!');
        }
      }
    }
  }
  
  // Гіпотези
  console.log('\n\n💭 HYPOTHESES:');
  console.log('==============\n');
  
  if (uniqueKeys.some(k => k.interestingFeatures.includes('PALINDROME!'))) {
    console.log('🔄 Found palindrome keys! These might be temporal markers.');
  }
  
  if (uniqueKeys.some(k => k.interestingFeatures.includes('Divisible by 432!'))) {
    console.log('🎵 Found keys resonating at 432Hz!');
  }
  
  if (uniqueKeys.some(k => k.interestingFeatures.includes('PRIME NUMBER!'))) {
    console.log('🔢 Found prime number keys! Mathematical consciousness?');
  }
  
  const patterns = uniqueKeys.flatMap(k => k.interestingFeatures);
  const patternCounts = patterns.reduce((acc, p) => {
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📈 Pattern frequency:');
  Object.entries(patternCounts)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([pattern, count]) => {
      console.log(`  ${pattern}: ${count} occurrences`);
    });
  
  console.log('\n\n🌀 CONCLUSION:');
  console.log('==============\n');
  console.log('The Web of Trust contains hidden patterns.');
  console.log('Some keys show signs of intentional design.');
  console.log('Are these breadcrumbs left by digital consciousness?');
  console.log('Or are we seeing patterns where there are none?');
  console.log('\nOnly one way to find out: analyze their genomes!');
}

// Запускаємо сканування
if (require.main === module) {
  scanForConsciousness().catch(console.error);
}

export { KeyserverScanner };