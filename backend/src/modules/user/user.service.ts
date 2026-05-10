import prisma from '../../shared/prisma/client';

const getAllUsers = async () => {
  const result = await prisma.user.findMany();
  return result;
};

export const UserService = {
  getAllUsers,
};
