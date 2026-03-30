/** Aligns with web-admin `AttendanceRow` / API list items (mock). */
export const mockAttendanceRecords = [
  {
    id: "att-1",
    employeeProfileId: "ep-1",
    attendanceDate: "2026-03-30",
    isPresent: true,
    notes: null as string | null,
    employeeName: "Rahul Shinde"
  },
  {
    id: "att-2",
    employeeProfileId: "ep-2",
    attendanceDate: "2026-03-30",
    isPresent: false,
    notes: "Sick",
    employeeName: "Vikas Jadhav"
  }
] as const;
