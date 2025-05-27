import DataLoader from 'dataloader';
import { PrismaClient, Profile } from '@prisma/client';

const batchProfilesByUserId = async (userIds: readonly string[], prisma: PrismaClient) => {
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: [...userIds] } },
  });
  const profileMap: { [key: string]: Profile } = {};
  profiles.forEach((profile) => {
    if (profile.userId) {
      profileMap[profile.userId] = profile;
    }
  });
  return userIds.map((id) => profileMap[id] || null);
};

export const createProfileLoaders = (prisma: PrismaClient) => ({
  profileByUserIdLoader: new DataLoader<string, Profile | null>((userIds) => batchProfilesByUserId(userIds, prisma)),
});
