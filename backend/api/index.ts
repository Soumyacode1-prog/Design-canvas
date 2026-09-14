import app from "../src/app";
import { connectDatabase } from "../src/config/database";

let databaseReady: Promise<void> | undefined;

export default async function handler(req: Parameters<typeof app>[0], res: Parameters<typeof app>[1]) {
  databaseReady ??= connectDatabase();
  await databaseReady;
  return app(req, res);
}
