import { PrismaClient } from '@prisma/lms-backend/client/prisma-schema';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed…');

  // 1. Ensure your Roles exist
  const roles = ['SUPER_ADMIN', 'ORG_ADMIN', 'TEACHER', 'PARENT', 'STUDENT','ADMIN'] as const;
  const roleRecords = await Promise.all(
    roles.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  console.log('✅ Roles set up:', roleRecords.map((r) => r.name));

  // 2. Create a tenant
  const tenant = await prisma.tenant.upsert({
    where: { domain: 'demo-high-school.edu' },
    update: {},
    create: {
      name: 'Demo High School',
      slug: 'demo-high-school',
      domain: 'demo-high-school.edu',
      image: '',
    },
  });
  console.log('✅ Created tenant:', tenant.name);

  // Helper to hash & create user + link role
  async function createUser(
    email: string,
    phone: string,
    plainPass: string,
    firstName: string,
    lastName: string,
    roleName: typeof roles[number],
    tenantId: string | null
  ) {
    const hashed = await bcrypt.hash(plainPass, 12);
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashed,
        firstName,
        lastName,
        tenantId,
      },
    });
    // find the role record
    const roleRec = roleRecords.find((r) => r.name === roleName)!;
    // link via UserRole
    await prisma.userRole.create({
      data: {
        user_id: user.user_id,
        role_id: roleRec.role_id,
      },
    });
    console.log(`✅ Created ${roleName.toLowerCase()}:`, email);
    return user;
  }

  // 3. Seed your users
  await createUser('superadmin@lms.com', '9876543210', 'superadmin123', 'Super', 'Admin', 'SUPER_ADMIN', null);
  await createUser('admin@demo-hs.edu', '9876543211', 'orgadmin123', 'School', 'Administrator', 'ORG_ADMIN', tenant.tenant_id);
  await createUser('teacher@demo-hs.edu', '9876543212', 'teacher123', 'John', 'Teacher', 'TEACHER', tenant.tenant_id);
  await createUser('parent@demo-hs.edu', '9876543213', 'parent123', 'Jane', 'Parent', 'PARENT', tenant.tenant_id);
  await createUser('student@demo-hs.edu', '9876543214', 'student123', 'Alice', 'Student', 'STUDENT', tenant.tenant_id);

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
