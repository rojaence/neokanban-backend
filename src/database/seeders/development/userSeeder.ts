import env from '../../../environment/environment';
import { BcryptService } from '../../../common/services/bcrypt/bcrypt.service';
import { PrismaClient } from '@prisma/client';
import { fakeAdminUser } from '../../../test/fakes/user';

const prisma = new PrismaClient();
const bcryptService: BcryptService = new BcryptService();

async function main() {
  const password = await bcryptService.genPasswordHash(
    env.USER_DEFAULT_PASSWORD,
  );
  const adminData = {
    email: fakeAdminUser.email,
    name: fakeAdminUser.name,
    surname: fakeAdminUser.surname,
    password,
  };
  await prisma.user.upsert({
    where: { email: adminData.email },
    update: {},
    create: {
      email: fakeAdminUser.email,
      name: fakeAdminUser.name,
      surname: fakeAdminUser.surname,
      username: fakeAdminUser.username,
      password,
    },
  });
}

export default main;
