import { exec } from 'child_process';
import { promisify } from 'util';
import { PrismaClient } from '@prisma/client';

const execPromise = promisify(exec);

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('Resetting database...');

    // Detener Prisma Client
    await prisma.$disconnect();

    // Ejecutar el comando de reset de Prisma
    const { stdout, stderr } = await execPromise(
      'npx prisma migrate reset --force',
    );
    if (stderr) {
      console.error('Error resetting the database:', stderr);
      return;
    }
    console.log(stdout);
    console.log('Database reset successfully!');
  } catch (error) {
    console.error('Error during reset process:', error);
  } finally {
    // Asegúrate de desconectar Prisma si hubo un error o no
    await prisma.$disconnect();
  }
}

export default resetDatabase;
