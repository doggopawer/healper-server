import "dotenv/config";

type Config = {
  db: {
    host: string | undefined;
    user: string | undefined;
    password: string | undefined;
    database: string | undefined;
  };
};

export const config: Config = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};
