import "dotenv/config";

import app from "./app.ts";

import {
  connectDatabase,
} from "./config/database.ts";

const PORT =
  Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `API running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
};

startServer();