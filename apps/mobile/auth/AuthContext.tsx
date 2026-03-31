import * as SecureStore from "expo-secure-store";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import type { ApiUserRole } from "../services/liveApi";
import { exchangeGoogleToken, hydrateMobileStoreData } from "../services/liveApi";
import { ApiError } from "../services/apiClient";
import { financeActions, roleActions, taskActions, leaveActions, USE_MOCK } from "../store/mobileStore";

const SESSION_KEY = "aj_mobile_session_v1";

export type PersistedSession = {
  token: string;
  userId: string;
  email: string;
  role: ApiUserRole;
};

type AuthStatus = "loading" | "signedOut" | "signedIn";

type AuthContextValue = {
  status: AuthStatus;
  session: PersistedSession | null;
  error: string | null;
  clearError: () => void;
  signInWithIdToken: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function saveSession(s: PersistedSession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(s));
}

async function loadStoredSession(): Promise<PersistedSession | null> {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as PersistedSession;
    if (!p?.token || !p?.userId || !p?.role) return null;
    return p;
  } catch {
    return null;
  }
}

async function clearStoredSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<AuthStatus>(USE_MOCK ? "signedIn" : "loading");
  const [session, setSession] = useState<PersistedSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyHydration = useCallback(
    async (s: PersistedSession) => {
      const data = await hydrateMobileStoreData(s.token, s.userId, s.role);
      dispatch(taskActions.hydrateTasks(data.tasks));
      dispatch(leaveActions.hydrateLeave(data.leave));
      dispatch(roleActions.setRoleFromApi(s.role));
      if (data.finance) {
        dispatch(financeActions.hydrateFinance(data.finance));
      } else if (s.role === "EMPLOYEE") {
        dispatch(financeActions.hydrateFinance({ pending: 0, advanceTaken: 0 }));
      }
    },
    [dispatch]
  );

  const refreshData = useCallback(async () => {
    if (USE_MOCK || !session) return;
    await applyHydration(session);
  }, [USE_MOCK, session, applyHydration]);

  useEffect(() => {
    if (USE_MOCK) return;
    let cancelled = false;
    (async () => {
      const stored = await loadStoredSession();
      if (cancelled) return;
      if (stored) {
        try {
          await applyHydration(stored);
          setSession(stored);
          setStatus("signedIn");
        } catch (e) {
          await clearStoredSession();
          setSession(null);
          setStatus("signedOut");
          if (e instanceof ApiError && e.status === 401) {
            setError("Session expired. Sign in again.");
          }
        }
      } else {
        setStatus("signedOut");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyHydration]);

  const signInWithIdToken = useCallback(
    async (idToken: string) => {
      setError(null);
      try {
        const { token, user } = await exchangeGoogleToken(idToken);
        const next: PersistedSession = {
          token,
          userId: user.id,
          email: user.email,
          role: user.role
        };
        await saveSession(next);
        await applyHydration(next);
        setSession(next);
        setStatus("signedIn");
      } catch (e) {
        const msg =
          e instanceof ApiError
            ? e.message
            : e instanceof Error
              ? e.message
              : "Sign-in failed";
        setError(msg);
      }
    },
    [applyHydration]
  );

  const signOut = useCallback(async () => {
    await clearStoredSession();
    setSession(null);
    setStatus("signedOut");
    dispatch(taskActions.hydrateTasks([]));
    dispatch(leaveActions.hydrateLeave([]));
    dispatch(financeActions.hydrateFinance({ pending: 0, advanceTaken: 0 }));
    dispatch(roleActions.setRoleFromApi("EMPLOYEE"));
  }, [dispatch]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      error,
      clearError,
      signInWithIdToken,
      signOut,
      refreshData
    }),
    [status, session, error, clearError, signInWithIdToken, signOut, refreshData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
