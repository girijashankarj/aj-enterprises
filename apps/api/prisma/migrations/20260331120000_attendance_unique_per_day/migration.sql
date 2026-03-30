-- One attendance row per employee profile per calendar day (stored as normalized date).
CREATE UNIQUE INDEX "Attendance_employeeProfileId_attendanceDate_key" ON "Attendance"("employeeProfileId", "attendanceDate");
