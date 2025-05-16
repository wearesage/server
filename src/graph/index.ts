import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import { ApolloServer } from "apollo-server";
import fs from "node:fs";
import { join } from "node:path";

const domains = ["Code", "User", "Mind", "Session"].map((v) =>
  fs.readFileSync(join(__dirname, `./domains/${v}.gql`)).toString()
);

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "password")
);

const neoSchema = new Neo4jGraphQL({ typeDefs: domains.join("\n"), driver });

export default {
  async init() {
    try {
      const schema = await neoSchema.getSchema();
      const server = new ApolloServer({
        schema,
        context: ({ req }: any) => ({ req }),
      });

      const port = 4000;
      await server.listen(port);
      console.log(`Apollo listening on port ${port}.`);

      return {
        schema,
        server
      }
    } catch (e) {
      console.log(`Error initializing Apollo server:\n\n`);
      console.log(e);
      return {
        schema: null,
        server: null
      }
    }
  },
};
