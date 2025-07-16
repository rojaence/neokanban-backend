// import { BcryptService } from '@src/common/services/bcrypt/bcrypt.service';
// import { PrismaClient } from '../../../../generated/prisma';

// const prisma = new PrismaClient();
// const bcryptService: BcryptService = new BcryptService();

// async function main() {
//   let password = await bcryptService.genPasswordHash('12345')
//   const adminData = {
//     email: 'admin@example.com',
//     name: 'Ron',
//     surname: 'Doe',
//     password: '1234',
//   };
//   const user1 = await prisma.user.upsert({
//     where: { email: adminData.email },
//     update: {},
//     create: {
//       email: adminData.email,
//     },
//   });
// }
