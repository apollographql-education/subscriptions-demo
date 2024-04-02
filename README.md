# Subscriptions Demo Code: HTTP Callback Protocol with Apollo Router

Hello and welcome! This repository houses the demo code used for the Apollo blog post "Federated Subscriptions with Router’s HTTP Callback Protocol."

To follow along, you'll need the following:
- Node installed on your computer (we recommend using [the latest version](https://nodejs.org/en/download)) as well as an IDE (we use [Visual Studio Code](https://code.visualstudio.com/))
- A GraphOS account on the Enterprise plan.[Click here to sign up for a free Enterprise trial](https://studio.apollographql.com/signup?type=enterprise-trial&referrer=odyssey-ent)


## Set up the graph

To get your graph set up on GraphOS, follow these steps.

1. Create a new graph under an organization on the GraphOS Enterprise plan.
2. Note down your environment variables (`APOLLO_GRAPH_REF` and `APOLLO_KEY`). You'll use these to authenticate to your graph.
1. Publish the subgraph schemas for each 
The [subgraph schemas](demo code link) are published to the graph, with the `name`, `schema`, and `routing_url` reported for each.
The graph ref and graph API key provided by GraphOS are used to boot up a local router connected to the graph.
Both subgraph servers are running locally.
