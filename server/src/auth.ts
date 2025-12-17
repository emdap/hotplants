import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const ENV_VARS = {
  dev: {
    trustedOrigins: ["http://localhost:5173"],
    baseURL: "http://localhost:4000",
    domains: "http://localhost:3000",
    dbName: "dev-auth",
  },
  prod: {
    trustedOrigins: ["https://hotplants.fly.dev"],
    baseURL: "https://hostplants.fly.dev",
    domains: "https://hotplants-server.fly.dev",
    dbName: "auth",
  },
};

export const { trustedOrigins, baseURL, domains, dbName } =
  process.env.NODE_ENV === "dev" ? ENV_VARS.dev : ENV_VARS.prod;

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);
const authDb = client.db(dbName);

export const auth = betterAuth({
  database: mongodbAdapter(authDb),
  baseURL,
  advanced: {
    cookiePrefix: "hotplants",
    crossSubDomainCookies: {
      enabled: true,
      domains,
    },
  },

  trustedOrigins,
  //  requireEmailVerification: true,

  emailAndPassword: {
    enabled: true,
  },
});
