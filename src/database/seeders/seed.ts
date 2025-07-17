import { PrismaClient } from '../../../generated/prisma';
import { parseArgs } from 'node:util';
import userSeeder from '../seeders/development/userSeeder';

const prisma = new PrismaClient();

const options = {
  environment: { type: 'string' as const },
};

async function main() {
  const {
    values: { environment },
  } = parseArgs({ options });

  switch (environment) {
    case 'development':
      // Seed data for development
      try {
        await userSeeder();
        await prisma.$disconnect();
      } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
      }
      break;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
