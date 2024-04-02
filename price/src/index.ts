import { readFileSync } from "fs";
import gql from "graphql-tag";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { ApolloServer, ContextFunction } from "@apollo/server";
import { ApolloServerPluginSubscriptionCallback } from "@apollo/server/plugin/subscriptionCallback"
import {
  StandaloneServerContextFunctionArgument,
  startStandaloneServer,
} from "@apollo/server/standalone";
import { DataSourceContext } from "./types/DataSourceContext";
import { GraphQLError } from "graphql";
import { PubSub, withFilter } from "graphql-subscriptions"
import { Resolvers } from "./__generated__/resolvers-types"

const pubsub = new PubSub();

const port = process.env.PORT ?? "4001";
const subgraphName = require("../package.json").name;
const routerSecret = process.env.ROUTER_SECRET;
let currentPrice = 234;

const context: ContextFunction<
  [StandaloneServerContextFunctionArgument],
  DataSourceContext
> = async ({ req }) => {
  if (routerSecret && req.headers["router-authorization"] !== routerSecret) {
    throw new GraphQLError("Missing router authentication", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  return {
    auth: req.headers.authorization,
  };
};

async function main() {

  let typeDefs = gql(
    readFileSync("schema.graphql", {
      encoding: "utf-8",
    })
  );

  const resolvers: Resolvers = {
    Query: {
      currentPrice() {
        return currentPrice;
      },
    },
    Mutation: {
      async changePrice(_, {stockId, newPrice }) {
        currentPrice = newPrice
        await pubsub.publish("INCREASE_STOCK_PRICE", { stockPriceChange: { id: stockId, currentPrice }})
        return currentPrice
      },
    },
    Subscription: {
      stockPriceChange: {

        // @ts-ignore
        subscribe: withFilter(
          () => pubsub.asyncIterator(["INCREASE_STOCK_PRICE"]),
          (payload, variables) => {
            // Only push an update if the price updated on the stock we queried
            return (
              payload.stockPriceChange.id === variables.id
            );
          },
        ),
      }
    },
    Stock: {
      __resolveReference(representation) {
        return representation
      },
      currentPrice() {
        return currentPrice
      }
    }
  }

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
    plugins: [
      ApolloServerPluginSubscriptionCallback()
    ]
  });
  const { url } = await startStandaloneServer(server, {
    context,
    listen: { port: Number.parseInt(port) },
  });

  console.log(`🚀  Subgraph ${subgraphName} ready at ${url}`);
  console.log(`Run rover dev --url ${url} --name ${subgraphName}`);


}

main();
