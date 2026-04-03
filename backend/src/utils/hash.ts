import bcrypt from 'bcrypt';
export const hash = async (plainText: string): Promise<string> => {
  const saltRound = Number(process.env.SALT_ROUND) || 10;
  return await bcrypt.hash(plainText, saltRound);
};

export const compareHash = async ({
  plaintext,
  hashedText,
}: {
  plaintext: string;
  hashedText: string;
}): Promise<boolean> => {
  const result = await bcrypt.compare(plaintext, hashedText);
  return result;
};
