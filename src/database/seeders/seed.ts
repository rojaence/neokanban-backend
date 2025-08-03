import env from '../../environment/environment';
import { PrismaClient } from '@prisma/client';
import { parseArgs } from 'node:util';
import userSeeder from '../seeders/development/userSeeder';
import resetDatabase from '../seeders/resetDatabase';
import { MongoClient } from 'mongodb';

const options = {
  environment: { type: 'string' as const },
  reset: { type: 'boolean' as const },
};

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

const mongo = new MongoClient(env.MONGO_DATABASE_URL);

async function main() {
  const {
    values: { reset },
  } = parseArgs({ options });
  if (reset) {
    await resetDatabase(prisma, mongo);
  }

  const environment = process.env.NODE_ENV;

  console.log('Seeding data...');

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
    case 'test':
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
