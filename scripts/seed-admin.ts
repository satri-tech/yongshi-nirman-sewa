// import 'dotenv/config';
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
// No need for advanced mapping techniques, while loop will create admin users sequentially, as we do not need more than 5 admins for a simple landing page
async function seedAdmin() {
  try {
    console.log("🌱 Seeding admin users...");
    
    // Debug: Log environment variables to verify they're loaded
    console.log("Debug - ADMIN_EMAIL_1:", process.env.ADMIN_EMAIL_1);
    console.log("Debug - ADMIN_PASSWORD_1:", process.env.ADMIN_PASSWORD_1 ? "******" : undefined);
    console.log("Debug - All env keys:", Object.keys(process.env).filter(key => key.startsWith('ADMIN_')));
    
    const admins = [];
    let i = 1;

    // Collect all admin credentials from environment to the const admins =[]
    while (
      process.env[`ADMIN_EMAIL_${i}`] &&
      process.env[`ADMIN_PASSWORD_${i}`]
    ) {
      admins.push({
        email: process.env[`ADMIN_EMAIL_${i}`]!,
        password: process.env[`ADMIN_PASSWORD_${i}`]!,
      });
      i++;
    }

    if (admins.length === 0) {
      console.error("❌ No admin credentials found in environment variables");
      process.exit(1);
    }

    // Create/update each admin
    for (const admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 12);
      const username = admin.email.split("@")[0];

      const createdAdmin = await prisma.user.upsert({
        where: { email: admin.email },
        update: {
          password: hashedPassword,
        },
        create: {
          email: admin.email,
          password: hashedPassword,
          username,
        },
      });

      console.log(`✅ Admin user created/updated: ${createdAdmin.email}`);
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
