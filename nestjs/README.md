# NestJS side

NestJS 12 · TypeScript 6 · TypeORM 0.3 + better-sqlite3 (in-memory) · class-validator · Jest 30 + supertest.
Needs **Node.js 24.9+**: NestJS 12 ships as ES modules, and Jest needs Node ≥ 24.9 to load
them. Run `nvm use` to pick up `.nvmrc`.

```bash
npm install
npm test                     # one e2e spec per gotcha in test/
npm run start:dev            # http://localhost:3000, ValidationPipe OFF
npm run start:dev:validated  # same, with VALIDATION=on
```

Explanations are in [`../gotchas`](../gotchas).
