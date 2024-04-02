import { Resolvers } from "../__generated__/resolvers-types";

export const Query: Resolvers = {
  Query: {
    stock() {
      return { id: "1" };
    },
  },
};
