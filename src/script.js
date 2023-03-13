const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: 'Fullstack tutorial for GraphQL',
      url: 'www.howtographql.com',
      postedBy: { connect: { id: 1 } },
    },
  });
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
  prisma.link.update({
    where: { id: 1 },
    data: {
      url: '',
      description: '',
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
