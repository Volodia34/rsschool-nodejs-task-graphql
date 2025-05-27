import DataLoader from 'dataloader';
import { PrismaClient, MemberType as PrismaMemberType } from '@prisma/client';

const batchMemberTypes = async (ids: readonly string[], prisma: PrismaClient) => {
  const memberTypes = await prisma.memberType.findMany({
    where: { id: { in: [...ids] } },
  });
  const memberTypeMap: { [key: string]: PrismaMemberType } = {};
  memberTypes.forEach((mt) => {
    memberTypeMap[mt.id] = mt;
  });
  return ids.map((id) => memberTypeMap[id] || null);
};

export const createMemberTypeLoaders = (prisma: PrismaClient) => ({
  memberTypeLoader: new DataLoader<string, PrismaMemberType | null>((ids) => batchMemberTypes(ids, prisma)),
});
