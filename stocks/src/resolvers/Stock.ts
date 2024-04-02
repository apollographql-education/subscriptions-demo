import { Resolvers } from "../__generated__/resolvers-types";

const articles = [
  "Hot new company Meteor making waves in the industry",
  "Experts say to buy and hold Meteor stock",
  "Economic downturn likely, tech companies impacted",
  "Why Fortune 500 top economist says this is the one stock to sell right now",
  "When it rains, it pours: getting the most from your present holdings"
]

export const Stock: Resolvers = {
  Stock: {
    __resolveReference(representation) {
      return representation
    },
    name() {
      return "Meteor"
    },
    latestNews() {
      return articles[Math.floor(Math.random() * articles.length)]
    },
    action({currentPrice}) {
      return currentPrice ? (currentPrice > 230 ? "Sell" : "Buy") : "Hold"
    }
  }
}