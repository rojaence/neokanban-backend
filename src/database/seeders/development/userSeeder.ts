import { BcryptService } from '../../../common/services/bcrypt/bcrypt.service';
import { PrismaClient } from '../../../../generated/prisma';
import environment from '../../../../environment/environment';

const prisma = new PrismaClient();
const bcryptService: BcryptService = new BcryptService();

async function main() {
  const password = await bcryptService.genPasswordHash(
    environment.userDefaultPassword,
  );
  const adminData = {
    email: 'admin@example.com',
    name: 'Ron',
    surname: 'Doe',
    password,
  };
  await prisma.user.upsert({
    where: { email: adminData.email },
    update: {},
    create: {
      email: adminData.email,
      name: adminData.name,
      surname: adminData.surname,
      password,
      createdAt: new Date(),
    },
  });
}

export default main;
