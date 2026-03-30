import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "../../types";

type EmployeesState = { list: Employee[] };

const initialState: EmployeesState = {
  list: [
    { id: "emp-1", fullName: "Rahul Shinde", email: "rahul@ak.local", salaryBase: 22000, phone: "9876543210" }
  ]
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee(state, action: PayloadAction<Employee>) {
      state.list.push(action.payload);
    }
  }
});

export const { addEmployee } = employeesSlice.actions;
export const employeesReducer = employeesSlice.reducer;
