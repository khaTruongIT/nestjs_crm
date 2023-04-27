import { genSalt, compare, hash } from 'bcryptjs';

export type HashPassword = (
  password: string,
  rounds: number,
) => Promise<string>;

export async function hashPassword(
  password: string,
  rounds: number,
): Promise<string> {
  const salt = await genSalt(rounds);
  return hashPassword(password, salt);
}

export async function comparePassword(
  providedPass: string,
  storedPass: string,
): Promise<boolean> {
  const isMatched = await compare(providedPass, storedPass);
  return isMatched;
}
