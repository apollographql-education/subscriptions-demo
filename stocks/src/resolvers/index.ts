import { Query } from "./Query";
import { Stock } from "./Stock";

const resolvers = {
  ...Query,
  ...Stock,
};

export default resolvers;
