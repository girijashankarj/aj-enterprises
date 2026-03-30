# Architecture and User Flows

This document describes **how the system is structured** and **how people move through it** during real operations.

---

## 1. Container view (C4-style)

```mermaid
flowchart TB
  subgraph users [Users]
    admin[Admin Manager]
    employee[Employee]
  end
  subgraph apps [Applications]
    web[Web Admin]
    mobile[Mobile App]
  end
  subgraph backend [Backend]
    api[Express API]
    prisma[Prisma]
  end
  subgraph data [Data store]
    pg[(PostgreSQL)]
  end
  admin --> web
  employee --> mobile
  web --> api
  mobile --> api
  api --> prisma
  prisma --> pg
```

---

## 2. Domain model (conceptual ER)

Core persistence aligns with Prisma models in `apps/api/prisma/schema.prisma`.

```mermaid
erDiagram
  User ||--o| EmployeeProfile : has
  EmployeeProfile ||--o{ Attendance : marks
  User ||--o{ TaskAssignment : receives
  User ||--o{ TaskAssignment : assigns
  TaskTemplate ||--o{ TaskAssignment : uses
  TaskAssignment ||--o{ TaskProgressLog : logs
  TaskAssignment ||--o{ TaskSuggestion : has
  User ||--o{ LeaveRequest : requests
  User ||--o{ SalaryLedger : ledger
```

**Note:** `TaskTemplate` holds reusable **part number + part name**; each **assignment** binds a template to an employee and date with a **target count**.

---

## 3. User journey — assign and complete a task

```mermaid
flowchart TD
  A[Manager opens Task Planner] --> B[Select employee part target date]
  B --> C[API creates TaskTemplate plus TaskAssignment]
  C --> D[Employee sees task on mobile]
  D --> E[Employee adds progress increments]
  E --> F{Achieved greater or equal target?}
  F -->|Yes| G[Status completed]
  F -->|No| H[Status in progress]
  E --> I[Optional issue note]
  I --> J[Manager may add suggestion]
```

---

## 4. Sequence — progress update (shop floor)

```mermaid
sequenceDiagram
  participant E as Employee
  participant M as Mobile App
  participant A as API
  participant D as Database

  E->>M: Tap plus 50 count add issue
  M->>A: POST tasks id progress
  A->>D: Insert TaskProgressLog
  A->>D: Update TaskAssignment achievedCount
  A->>M: Updated assignment
  M->>E: Show new total
```

---

## 5. User journey — leave

```mermaid
flowchart LR
  R[Request leave] --> P[Pending]
  P -->|Manager approves| A[Approved]
  P -->|Manager rejects| X[Rejected]
```

---

## 6. User journey — finance snapshot

1. **Admin** posts ledger entries (advance, salary credit, adjustment).
2. **Employee** sees **advance taken** and **pending** on mobile (aggregates derived from ledger in product iterations).

---

## 7. Deployment architecture (typical EC2)

```mermaid
flowchart TB
  subgraph internet [Internet]
    users[Users]
  end
  subgraph aws [AWS VPC example]
    nginx[Nginx TLS]
    api[Node or container]
    rds[(RDS Postgres)]
  end
  users --> nginx
  nginx --> api
  api --> rds
```

NAT Gateway and ALB are optional cost drivers; see [11-AWS-INFRASTRUCTURE-COSTS.md](./11-AWS-INFRASTRUCTURE-COSTS.md).

---

## 8. Related documents

- Technical blueprint: [03-TECHNICAL-EXECUTION-BLUEPRINT.md](./03-TECHNICAL-EXECUTION-BLUEPRINT.md)
- Deployment: [07-MONOREPO-AND-DEPLOYMENT.md](./07-MONOREPO-AND-DEPLOYMENT.md)
