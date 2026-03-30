import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@ajenterprises.in" },
    create: {
      email: "admin@ajenterprises.in",
      fullName: "AJ Admin",
      role: UserRole.ADMIN,
      employeeProfile: {
        create: {
          salaryBase: 50000,
          leaveAllowance: 24
        }
      }
    },
    update: {}
  });
}

main().finally(() => prisma.$disconnect());
