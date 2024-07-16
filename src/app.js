import express from "express";
import routerSetup from "./utils/routerSetup.js";
import { ApolloServer, gql } from "apollo-server-express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import resolvers from "./graphql/resolvers.js";
import * as db from './db/db.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemaPath = join(__dirname, "graphql/schema.graphql");

const typeDefs = gql(readFileSync(schemaPath, "utf-8"));

const PORT = 3000;

const app = express();

app.use(express.json());

app.use(routerSetup);

async function startApolloServer() {


  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
  });
}

startApolloServer().catch((err) => {
  console.error("Error starting Apollo Server:", err);
});
