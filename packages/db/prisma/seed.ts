import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a demo coach
  const coach = await prisma.user.upsert({
    where: { email: "coach@demo.nooch.ai" },
    update: {},
    create: {
      clerkId: "demo_coach_clerk_id",
      email: "coach@demo.nooch.ai",
      firstName: "Demo",
      lastName: "Coach",
      role: UserRole.COACH,
      coachProfile: {
        create: {
          bio: "Certified nutrition coach specializing in sustainable weight management.",
          specialty: "Weight Management",
          timezone: "America/New_York",
        },
      },
    },
  });

  console.log("Created demo coach:", coach.email);

  // Create a demo client
  const client = await prisma.user.upsert({
    where: { email: "client@demo.nooch.ai" },
    update: {},
    create: {
      clerkId: "demo_client_clerk_id",
      email: "client@demo.nooch.ai",
      firstName: "Demo",
      lastName: "Client",
      role: UserRole.CLIENT,
      clientProfile: {
        create: {
          coachId: coach.id,
          goals: "Lose 20 lbs and build healthy eating habits",
          onboardingComplete: true,
        },
      },
    },
  });

  console.log("Created demo client:", client.email);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
