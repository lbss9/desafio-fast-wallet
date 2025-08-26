import argon2 from 'argon2';

export interface IHashPassword {
  password: string;
}

export interface IComparePassword {
  password: string;
  hashedPassword: string;
}

export async function hashPassword(input: IHashPassword): Promise<string> {
  return argon2.hash(input.password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}

export async function comparePassword(
  input: IComparePassword,
): Promise<boolean> {
  try {
    return argon2.verify(input.hashedPassword, input.password);
  } catch (error) {
    return false;
  }
}
