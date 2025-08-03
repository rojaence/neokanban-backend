import { exec } from 'child_process';
import { promisify } from 'util';
import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';

const execPromise = promisify(exec);

async function resetDatabase(prisma: PrismaClient, mongo: MongoClient) {
  try {
    console.log('Resetting database...');

    // Reiniciar base de datos de mongo

    const collections = await mongo.db().collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
    await mongo.close();
    // Ejecutar el comando de reset de Prisma
    const { stderr } = await execPromise('npx prisma migrate reset --force');
    if (stderr) {
      console.error('Error resetting the database:', stderr);
      return;
    }
    console.log('Database reset successfully!');
  } catch (error) {
    console.error('Error during reset process:', error);
  } finally {
    // Asegúrate de desconectar Prisma si hubo un error o no
    await prisma.$disconnect();
  }
}

export default resetDatabase;
