# API mocks (placeholder)

This folder is reserved for **future** backend test doubles, for example:

- Prisma seed extensions that mirror `packages/mock-api` fixtures
- MSW or supertest fixtures for integration tests
- Optional `/dev/mock/*` routes (disabled in production)

**Prototype UI data** should live in **`packages/mock-api`** and be consumed by web/mobile, not duplicated here unless tests require it.
