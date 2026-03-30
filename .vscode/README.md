# VS Code / Cursor launch profiles

Open **Run and Debug**, pick a configuration:

| Configuration | What it does |
|---------------|----------------|
| **Web: Admin (Vite)** | `apps/web-admin` dev server; mock API; full admin nav (`VITE_DEV_ROLE=admin`). |
| **Web: Employee (Vite)** | Same app, employee nav preview (`VITE_DEV_ROLE=employee`). |
| **Mobile: Admin (Expo)** | `expo start`; mock data; opens **Admin** tab first (`EXPO_PUBLIC_INITIAL_ROLE=ADMIN`). |
| **Mobile: Employee (Expo)** | Same; **Employee** role and **Tasks** tab first (`EXPO_PUBLIC_INITIAL_ROLE=EMPLOYEE`). |
| **API (Express)** | Backend only (needs `.env` + Postgres if not using UI mocks). |
| **API + Web: Admin / Employee** | Starts API and web together. |

Web URL is usually `http://localhost:5173` (Vite). Restart the dev server after changing env vars if the profile does not apply.
