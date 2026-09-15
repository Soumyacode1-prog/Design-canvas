import app from "../dist/app.js";
import { connectDatabase } from "../dist/config/database.js";

let databaseReady: Promise<void> | undefined;

export default async function handler(req: Parameters<typeof app>[0], res: Parameters<typeof app>[1]) {
  databaseReady ??= connectDatabase();
  await databaseReady;
  return app(req, res);
}
