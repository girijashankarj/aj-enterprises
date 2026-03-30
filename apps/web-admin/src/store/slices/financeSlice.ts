import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type LedgerEntry = {
  id: string;
  employeeName: string;
  type: "ADVANCE" | "CREDIT" | "PENDING";
  amount: number;
};

type FinanceState = { entries: LedgerEntry[] };

const initialState: FinanceState = {
  entries: [{ id: "led-1", employeeName: "Rahul Shinde", type: "ADVANCE", amount: 3000 }]
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    addLedgerEntry(state, action: PayloadAction<LedgerEntry>) {
      state.entries.push(action.payload);
    }
  }
});

export const { addLedgerEntry } = financeSlice.actions;
export const financeReducer = financeSlice.reducer;
