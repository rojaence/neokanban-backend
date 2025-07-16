import { PrismaClient } from '../../../generated/prisma';
import { parseArgs } from 'node:util';

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
      await new Promise((resolve) => resolve(true));
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
