export const mockTasks = [
  {
    id: "task-1",
    employeeName: "Rahul Shinde",
    partNumber: "PP-102",
    partName: "Pressure Valve Plate",
    targetCount: 1000,
    achievedCount: 320,
    issueNotes: "Machine vibration reported",
    managerSuggestion: "Check spindle alignment before next batch."
  },
  {
    id: "task-2",
    employeeName: "Vikas Jadhav",
    partNumber: "LM-204",
    partName: "Latte Pump Housing",
    targetCount: 500,
    achievedCount: 180,
    issueNotes: undefined,
    managerSuggestion: undefined
  }
] as const;
