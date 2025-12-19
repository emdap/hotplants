import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const ENV_VARS = {
  dev: {
    trustedOrigins: ["http://localhost:5173"],
    baseURL: "http://localhost:4000",
    serverURL: "http://localhost:3000",
    dbName: "dev-auth",
  },
  test: {
    trustedOrigins: ["http://localhost:8080"],
    baseURL: "http://localhost:8080",
    serverURL: "http://localhost:3000",
    dbName: "dev-auth",
  },
  prod: {
    trustedOrigins: ["https://hotplants.fly.dev"],
    baseURL: "https://hotplants.fly.dev",
    serverURL: "https://hotplants-server.fly.dev",
    dbName: "auth",
  },
};

export const { trustedOrigins, baseURL, serverURL, dbName } =
  process.env.NODE_ENV === "dev" ? ENV_VARS.dev : ENV_VARS.prod;

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);
const authDb = client.db(dbName);

export const auth = betterAuth({
  database: mongodbAdapter(authDb),
  baseURL,
  basePath: "/auth",

  trustedOrigins,
  //  requireEmailVerification: true,

  emailAndPassword: {
    enabled: true,
  },
});
