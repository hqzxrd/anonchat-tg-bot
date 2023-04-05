import "dotenv/config";

export function configService(key: string): string {
  const field = process.env[key];

  if (!field) {
    throw new Error(`Не существует такого поля`);
  }

  return field;
}
