import 'dotenv/config';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    database: process.env.DB_NAME ?? 'recruitment',
    user: process.env.DB_USER ?? 'recruitment_user',
    password: process.env.DB_PASSWORD ?? 'recruitment_password'
  }
};
