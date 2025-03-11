import { PrismaClient } from "@prisma/client";

// No need to declare global here, as it's done in global.d.ts
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;