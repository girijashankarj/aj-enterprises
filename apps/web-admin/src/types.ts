export type ThemeMode = "light" | "dark";

export type Task = {
  id: string;
  employeeName: string;
  partNumber: string;
  partName: string;
  targetCount: number;
  achievedCount: number;
  issueNotes?: string;
  managerSuggestion?: string;
};

export type Employee = {
  id: string;
  fullName: string;
  email: string;
  salaryBase: number;
  /** Mobile number from `employeeProfile.phone` when loaded from the API. */
  phone?: string | null;
  /** Set when loaded from API or mock bootstrap (`employeeProfile.id`). */
  employeeProfileId?: string | null;
};

export type AttendanceRow = {
  id: string;
  employeeProfileId: string;
  /** Calendar date YYYY-MM-DD */
  attendanceDate: string;
  isPresent: boolean;
  notes: string | null;
  employeeName: string;
};
