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

const batchAuthorsUserSubscribedTo = async (subscriberIds: readonly string[], prisma: PrismaClient): Promise<User[][]> => {
  const subscriptions = await prisma.user.findMany({
    where: { id: { in: [...subscriberIds] } },
    include: {
      subscribedToUser: {
        include: {
          author: true,
        },
      },
    },
  });

  const authorsBySubscriberId: Record<string, User[]> = {};
  subscriptions.forEach(user => {
    authorsBySubscriberId[user.id] = user.subscribedToUser?.map(sub => sub.author).filter(Boolean) || [];
  });

  return subscriberIds.map(id => authorsBySubscriberId[id] || []);
};

const batchSubscribersToUser = async (authorIds: readonly string[], prisma: PrismaClient): Promise<User[][]> => {
  const usersWithSubscribers = await prisma.user.findMany({
    where: { id: { in: [...authorIds] } },
    include: {
      userSubscribedTo: {
        include: {
          subscriber: true,
        },
      },
    },
  });

  const subscribersByAuthorId: Record<string, User[]> = {};
  usersWithSubscribers.forEach(user => {
    subscribersByAuthorId[user.id] = user.userSubscribedTo?.map(sub => sub.subscriber).filter(Boolean) || [];
  });

  return authorIds.map(id => subscribersByAuthorId[id] || []);
};

export const createUserLoaders = (prisma: PrismaClient) => ({
  userLoader: new DataLoader<string, User | null>((ids) => batchUsers(ids, prisma)),
  authorsUserSubscribedToLoader: new DataLoader<string, User[]>((subscriberIds) => batchAuthorsUserSubscribedTo(subscriberIds, prisma)),
  subscribersToUserLoader: new DataLoader<string, User[]>((authorIds) => batchSubscribersToUser(authorIds, prisma)),
});
