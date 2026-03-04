import bcrypt from 'bcrypt';
export const hashPassword = async (password: string): Promise<string> => {
  const saltRound = Number(process.env.SALT_ROUND) || 10;
  return await bcrypt.hash(password, saltRound);
};

export const comparePassoword = async ({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}): Promise<boolean> => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};
