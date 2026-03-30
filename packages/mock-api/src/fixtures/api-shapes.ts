/**
 * Shapes aligned with `docs/10-API-CONTRACT-EXAMPLES.md` (Prisma/API JSON).
 * Use for Storybook / tests / future MSW handlers.
 */
export const mockApiEmployeesResponse = [
  {
    id: "cm_emp_1",
    email: "rahul@ak.local",
    fullName: "Rahul Shinde",
    role: "EMPLOYEE",
    isActive: true,
    employeeProfile: {
      id: "cm_profile_1",
      salaryBase: "22000.00",
      leaveAllowance: 24,
      phone: "9876543210"
    }
  }
];

export const mockApiDashboardSummary = {
  day: { achieved: 500, target: 1500 },
  week: { achieved: 2400, target: 6000 }
};
