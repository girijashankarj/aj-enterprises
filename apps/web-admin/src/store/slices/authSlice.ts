import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

type AuthState = {
  isAuthenticated: boolean;
  email: string | null;
  role: UserRole | null;
  accessToken: string | null;
};

const SESSION_KEY = "ak-session";

type SessionPayload = { email: string; role: UserRole; accessToken: string };

function loadSession(): Partial<AuthState> | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as SessionPayload;
    return {
      isAuthenticated: true,
      email: s.email,
      role: s.role,
      accessToken: s.accessToken
    };
  } catch {
    return null;
  }
}

function saveSession(s: SessionPayload) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function clearSessionStorage() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

const persisted = loadSession();

const initialState: AuthState = {
  isAuthenticated: !!persisted?.isAuthenticated,
  email: persisted?.email ?? null,
  role: persisted?.role ?? null,
  accessToken: persisted?.accessToken ?? null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInScaffold(state, action: PayloadAction<{ email: string; role: UserRole }>) {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.accessToken = "scaffold";
      saveSession({ ...action.payload, accessToken: "scaffold" });
    },
    signInFromApi(state, action: PayloadAction<SessionPayload>) {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      saveSession(action.payload);
    },
    signOut(state) {
      state.isAuthenticated = false;
      state.email = null;
      state.role = null;
      state.accessToken = null;
      clearSessionStorage();
    }
  }
});

export const { signInScaffold, signInFromApi, signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
