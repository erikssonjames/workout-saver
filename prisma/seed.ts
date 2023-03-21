import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/auth/password"
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "james@example.com" },
    update: {},
    create: {
      email: "james@example.com",
      password: await hashPassword("james123"),
    }
  });
  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  })
