const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seed() {
  const email = "admin@example.com";

  // cleanup the existing database
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: "Admin User",
      password: hashedPassword,
    },
  });

  await prisma.subscription.createMany({
    data: [
      {
        name: "Netflix",
        description: "Video streaming service",
        price: 15.99,
        currency: "USD",
        billingCycle: "MONTHLY",
        status: "ACTIVE",
        userId: user.id,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        name: "Spotify Premium",
        description: "Music streaming service",
        price: 9.99,
        currency: "USD",
        billingCycle: "MONTHLY",
        status: "ACTIVE",
        userId: user.id,
        nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      },
      {
        name: "GitHub Pro",
        description: "Code hosting and collaboration",
        price: 48.0,
        currency: "USD",
        billingCycle: "YEARLY",
        status: "ACTIVE",
        userId: user.id,
        nextBillingDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), // 300 days from now
      },
    ],
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });