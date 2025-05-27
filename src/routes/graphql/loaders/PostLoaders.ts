import DataLoader from 'dataloader';
import { PrismaClient, Post } from '@prisma/client';

const batchPostsByAuthorId = async (authorIds: readonly string[], prisma: PrismaClient) => {
  const posts = await prisma.post.findMany({
    where: { authorId: { in: [...authorIds] } },
  });
  const postsByAuthorMap: { [key: string]: Post[] } = {};
  authorIds.forEach(id => postsByAuthorMap[id] = []);
  posts.forEach((post) => {
    if (post.authorId) {
      (postsByAuthorMap[post.authorId] = postsByAuthorMap[post.authorId] || []).push(post);
    }
  });
  return authorIds.map((id) => postsByAuthorMap[id] || []);
};

export const createPostLoaders = (prisma: PrismaClient) => ({
  postsByAuthorIdLoader: new DataLoader<string, Post[]>((authorIds) => batchPostsByAuthorId(authorIds, prisma)),
});
