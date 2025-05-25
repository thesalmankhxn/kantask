// Environment configuration that's Edge Runtime compatible
export const config = {
  DATABASE_URL: process.env.DATABASE_URL!,
  APP_ENV: process.env.APP_ENV!,
  GITHUB_ID: process.env.GITHUB_ID!,
  GITHUB_SECRET: process.env.GITHUB_SECRET!,
  GOOGLE_ID: process.env.GOOGLE_ID!,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET!,
};

export default config;
