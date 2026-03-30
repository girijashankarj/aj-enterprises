import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SupportedLanguage = "en" | "hi" | "mr";
export type DashboardRange = "day" | "week" | "month";
export type TableDensity = "compact" | "comfortable";

type PreferenceValues = {
  language: SupportedLanguage;
  dashboardRange: DashboardRange;
  tableDensity: TableDensity;
};

type PreferencesState = {
  orgDefaults: PreferenceValues;
  userOverrides: Partial<PreferenceValues>;
};

const STORAGE_KEY = "ak-preferences-v1";

const defaultPrefs: PreferenceValues = {
  language: "en",
  dashboardRange: "week",
  tableDensity: "comfortable"
};

const initialState: PreferencesState = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { orgDefaults: defaultPrefs, userOverrides: {} };
    }
    const parsed = JSON.parse(raw) as PreferencesState;
    return {
      orgDefaults: { ...defaultPrefs, ...parsed.orgDefaults },
      userOverrides: parsed.userOverrides ?? {}
    };
  } catch {
    return { orgDefaults: defaultPrefs, userOverrides: {} };
  }
})();

const persist = (state: PreferencesState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore localStorage failures in private browsing contexts.
  }
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setUserLanguage(state, action: PayloadAction<SupportedLanguage>) {
      state.userOverrides.language = action.payload;
      persist(state);
    },
    setUserDashboardRange(state, action: PayloadAction<DashboardRange>) {
      state.userOverrides.dashboardRange = action.payload;
      persist(state);
    },
    setUserTableDensity(state, action: PayloadAction<TableDensity>) {
      state.userOverrides.tableDensity = action.payload;
      persist(state);
    },
    setOrgDefaults(state, action: PayloadAction<PreferenceValues>) {
      state.orgDefaults = action.payload;
      persist(state);
    }
  }
});

export const {
  setUserLanguage,
  setUserDashboardRange,
  setUserTableDensity,
  setOrgDefaults
} = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
