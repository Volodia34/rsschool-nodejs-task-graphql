import DataLoader from 'dataloader';
import { PrismaClient, User } from '@prisma/client';

const batchUsers = async (ids: readonly string[], prisma: PrismaClient): Promise<(User | null)[]> => {
  const users = await prisma.user.findMany({
    where: { id: { in: [...ids] } },
  });
  const userMap: { [key: string]: User } = {};
  users.forEach((user) => {
    userMap[user.id] = user;
  });
  return ids.map((id) => userMap[id] || null);
};

export const createUserLoaders = (prisma: PrismaClient) => ({
  userLoader: new DataLoader<string, User | null>((ids) => batchUsers(ids, prisma)),
});
