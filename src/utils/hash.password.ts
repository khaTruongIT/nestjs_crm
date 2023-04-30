import { genSalt, compare, hash } from 'bcryptjs';

const SALT_NUMBER = 10;

export type HashPassword = (
  password: string,
  rounds: number,
) => Promise<string>;

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await genSalt(SALT_NUMBER);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw err;
  }
}

export async function comparePassword(
  providedPass: string,
  storedPass: string,
): Promise<boolean> {
  const isMatched = await compare(providedPass, storedPass);
  return isMatched;
}
