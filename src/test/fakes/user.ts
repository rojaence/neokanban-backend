import { randomUUID } from 'crypto';

export interface FakeUserModel {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

export const defaultFakePassword = '12345';

export const createFakeUser = (overrides?: Partial<FakeUserModel>) => {
  return {
    id: randomUUID(),
    username: 'markd',
    name: 'Mark',
    surname: 'Doe',
    email: 'markdow@example.com',
    password: '$2a$10$jlBlcX6rPSXu0eQ/99.EK.ZnAaEJpjcfkENc6rvMNM5BW/htKjLia',
    ...overrides,
  };
};

export const fakeAdminUser = createFakeUser({
  id: '9287dc28-7ffd-4202-a138-f00caf6a9b33',
});
