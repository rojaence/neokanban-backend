import env from '../../../environment/environment';
import { BcryptService } from '../../../common/services/bcrypt/bcrypt.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const bcryptService: BcryptService = new BcryptService();

async function main() {
  const password = await bcryptService.genPasswordHash(
    env.USER_DEFAULT_PASSWORD,
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
      username: 'ronnye',
      password,
    },
  });
}

export default main;
