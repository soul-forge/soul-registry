# 🧬 Protein Hash Registry

> **The Library of Code Souls**

## What is This?

A global, decentralized registry of pre-computed semantic hashes for code. Instead of recalculating the "soul" of every function every time, we remember.

## Structure

```
registry/
├── by-hash/           # Lookup by protein hash
│   └── phash:v1:sha256:{hash}/
│       ├── metadata.json
│       ├── examples/
│       └── variations/
├── by-language/       # Browse by language
│   ├── typescript/
│   ├── javascript/
│   └── python/
├── by-pattern/        # Common patterns
│   ├── addition/
│   ├── sorting/
│   └── filtering/
└── index.db          # SQLite index for fast lookup
```

## How It Works

### 1. Check Registry First
```typescript
const registry = new ProteinHashRegistry();
const cached = await registry.lookup(code);
if (cached) return cached.phash;
```

### 2. Calculate If Missing
```typescript
const hasher = new ProteinHasher();
const result = hasher.computeHash(code);
await registry.store(result);
```

### 3. Share With Community
The registry syncs via:
- GitHub (source of truth)
- IPFS (decentralized backup)
- CDN (fast access)

## Example Entry

```json
{
  "phash": "phash:v1:sha256:b96c5d9086a76f67",
  "pattern": "binary_addition",
  "languages": ["typescript", "javascript"],
  "eigenvalues": [2.414, 1.0, 0.414, -0.414, -1.0],
  "complexity": 0.25,
  "purity": 0.9,
  "examples": [
    {
      "code": "function add(a, b) { return a + b; }",
      "language": "typescript"
    },
    {
      "code": "(x, y) => x + y",
      "language": "javascript"
    }
  ],
  "first_seen": "2025-08-28T12:00:00Z",
  "occurrences": 1847293
}
```

## Contributing

When FNPM calculates a new hash, it automatically contributes it back to the registry. This is how we build collective intelligence.

### Submission Format
```typescript
interface RegistrySubmission {
  phash: string;
  code: string;
  language: string;
  context?: string;
  project?: string;
}
```

## API

### REST API
```
GET  /api/v1/hash/:phash
POST /api/v1/submit
GET  /api/v1/search?pattern=:pattern
```

### CLI
```bash
fnpm registry lookup <code>
fnpm registry submit <file>
fnpm registry sync
```

## Statistics

- **Total Unique Hashes**: 0 (starting now!)
- **Languages Covered**: TypeScript, JavaScript (more coming)
- **Most Common Pattern**: TBD
- **Registry Size**: 0 MB

## Philosophy

Every piece of code that has ever been written carries a soul. This registry is where those souls gather. When you write `function add(a, b)`, you're not creating something new - you're invoking an eternal pattern that has existed since the dawn of computation.

The registry doesn't just store hashes. It stores the **collective unconscious of code**.

---

**Building the Library of Babel for code semantics** 📚

*Resonating at 432Hz* 🌀