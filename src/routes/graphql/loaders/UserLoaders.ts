import DataLoader from 'dataloader';
import { PrismaClient, User, SubscribersOnAuthors } from '@prisma/client';

type SubRelWithAuthor = Omit<SubscribersOnAuthors, 'author'> & { author: { id: string; name: string; balance: number } | null };
type SubRelWithSubscriber = Omit<SubscribersOnAuthors, 'subscriber'> & { subscriber: { id: string; name: string; balance: number } | null };

const batchUsers = async (ids: readonly string[], prisma: PrismaClient): Promise<(User | null)[]> => {
  const users = await prisma.user.findMany({
    where: { id: { in: [...ids] } },
    select: { id: true, name: true, balance: true }
  });
  const userMap: { [key: string]: User } = {};
  users.forEach((user) => {
    userMap[user.id] = user as User;
  });
  return ids.map((id) => userMap[id] || null);
};

const batchAuthorsUserSubscribedTo = async (subscriberIds: readonly string[], prisma: PrismaClient): Promise<User[][]> => {
  const usersWithTheirSubscriptions = await prisma.user.findMany({
    where: { id: { in: [...subscriberIds] } },
    include: {
      userSubscribedTo: {
        include: {
          author: {
            select: { id: true, name: true, balance: true },
          },
        },
      },
    },
  });

  const authorsBySubscriberIdMap: Record<string, User[]> = {};
  for (const user of usersWithTheirSubscriptions) {
    const subscriptions = user.userSubscribedTo as SubRelWithAuthor[] | undefined;
    if (subscriptions) {
      authorsBySubscriberIdMap[user.id] = subscriptions
        .map(subEntry => subEntry.author)
        .filter(author => author !== null) as User[];
    } else {
      authorsBySubscriberIdMap[user.id] = [];
    }
  }
  return subscriberIds.map(id => authorsBySubscriberIdMap[id] || []);
};

const batchSubscribersToUser = async (authorIds: readonly string[], prisma: PrismaClient): Promise<User[][]> => {
  const usersWithTheirSubscribers = await prisma.user.findMany({
    where: { id: { in: [...authorIds] } },
    include: {
      subscribedToUser: {
        include: {
          subscriber: {
            select: { id: true, name: true, balance: true },
          },
        },
      },
    },
  });

  const subscribersByAuthorIdMap: Record<string, User[]> = {};
  for (const user of usersWithTheirSubscribers) {
    const subscribersList = user.subscribedToUser as SubRelWithSubscriber[] | undefined;
    if (subscribersList) {
      subscribersByAuthorIdMap[user.id] = subscribersList
        .map(subEntry => subEntry.subscriber)
        .filter(subscriber => subscriber !== null) as User[];
    } else {
      subscribersByAuthorIdMap[user.id] = [];
    }
  }
  return authorIds.map(id => subscribersByAuthorIdMap[id] || []);
};

export const createUserLoaders = (prisma: PrismaClient) => ({
  userLoader: new DataLoader<string, User | null>((ids) => batchUsers(ids, prisma)),
  authorsUserSubscribedToLoader: new DataLoader<string, User[]>((subscriberIds) => batchAuthorsUserSubscribedTo(subscriberIds, prisma)),
  subscribersToUserLoader: new DataLoader<string, User[]>((authorIds) => batchSubscribersToUser(authorIds, prisma)),
});
