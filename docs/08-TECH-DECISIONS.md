# Technical Decisions (ADR-style)

Architecture Decision Records capture **what** was chosen, **why**, and **alternatives** considered. This is the engineering "memory" for AJ Enterprises.

---

## ADR-001 — PostgreSQL + Prisma

| Field | Content |
|-------|---------|
| **Status** | Accepted |
| **Context** | Need relational data: users, tasks, ledger, leave; migrations must be reviewable. |
| **Decision** | Use **PostgreSQL** with **Prisma ORM**. |
| **Alternatives** | Sequelize + SQLite (boilerplate); raw SQL; MongoDB. |
| **Rationale** | Prisma gives typed client + migrations; Postgres fits money + constraints. |
| **Consequences** | Need hosted Postgres in prod; connection pooling for scale later. |

---

## ADR-002 — Redux Toolkit on web and mobile

| Field | Content |
|-------|---------|
| **Status** | Accepted |
| **Context** | Multiple screens share operational state (tasks, auth, theme). |
| **Decision** | **Redux Toolkit** for both apps. |
| **Alternatives** | Zustand; Context only; React Query alone. |
| **Rationale** | Explicit slices for domain; RTK is standard; React Query can be added for server cache later. |
| **Consequences** | Boilerplate for actions; team must follow slice patterns. |

---

## ADR-003 — Tailwind CSS (no custom CSS files)

| Field | Content |
|-------|---------|
| **Status** | Accepted |
| **Context** | Fast iteration on admin UI; consistent spacing/typography. |
| **Decision** | **Tailwind utility classes only** in web admin. |
| **Alternatives** | CSS modules; styled-components; component library. |
| **Rationale** | Speed; fewer files; dark mode via class strategy. |
| **Consequences** | Long class strings; need discipline to avoid duplication (extract components). |

---

## ADR-004 — Google ID token + app JWT

| Field | Content |
|-------|---------|
| **Status** | Accepted (evolving) |
| **Context** | Need verified identity without password management for MVP. |
| **Decision** | Verify **Google ID token** server-side; issue **short-lived JWT** for API. |
| **Alternatives** | Session cookies only; Cognito user pools; username/password. |
| **Rationale** | Google Sign-In is familiar; JWT is stateless for API. |
| **Consequences** | Need refresh/rotation strategy later; protect secrets. |

---

## ADR-005 — Mock-first prototype (`@aj/mock-api`)

| Field | Content |
|-------|---------|
| **Status** | Accepted |
| **Context** | UI must progress before DB is stable. |
| **Decision** | Central **mock-api** package + env flags to preload Redux. |
| **Alternatives** | MSW only; hardcoded data per app; fake backend. |
| **Rationale** | Single fixture source for web + mobile + future tests. |
| **Consequences** | Must keep mocks aligned with API contracts. |

---

## ADR-006 — Monorepo with npm workspaces

| Field | Content |
|-------|---------|
| **Status** | Accepted |
| **Context** | Share types and mocks; one PR for cross-cutting changes. |
| **Decision** | **npm workspaces** at repo root. |
| **Alternatives** | Turborepo; Nx; multi-repo. |
| **Rationale** | Simplicity; low tooling overhead for current team size. |
| **Consequences** | May add Turborepo later for caching builds. |

---

## Open decisions (not yet decided)

| Topic | Options |
|-------|---------|
| **API hosting** | Long-lived Node on EC2 vs Lambda + API Gateway |
| **File storage** | S3 for future attachments vs none |
| **Notifications** | FCM vs Expo push vs SMS vendor |

---

## Related documents

- Blueprint: [03-TECHNICAL-EXECUTION-BLUEPRINT.md](./03-TECHNICAL-EXECUTION-BLUEPRINT.md)
- Mock: [12-MOCK-PROTOTYPE.md](./12-MOCK-PROTOTYPE.md)
