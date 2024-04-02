# Subscriptions Demo Code: HTTP Callback Protocol with Apollo Router

Hello and welcome! This repository houses the demo code used for the Apollo blog post "Federated Subscriptions with Router’s HTTP Callback Protocol."

To follow along, you'll need the following installed on your computer:
- Node (we recommend using [the latest version](https://nodejs.org/en/download)) as well as an IDE (we use [Visual Studio Code](https://code.visualstudio.com/))
- [Rover](https://www.apollographql.com/docs/rover/), the GraphOS CLI tool

Check that Node is installed on your machine by running `node -v`. Check that Rover is installed by running `rover` anywhere in the terminal.

You will also need a GraphOS account on the Enterprise plan. [Click here to sign up for a free Enterprise trial](https://studio.apollographql.com/signup?type=enterprise-trial&referrer=odyssey-ent)

## Set up the graph

To get your graph set up on GraphOS, follow these steps.

1. Create a new graph under an organization on the GraphOS Enterprise plan.
2. When your graph is created, you'll be given a graph reference. It takes the form of `my-graph@current`. Note down your graph ref as an environment variable, `APOLLO_GRAPH_REF`, as we'll use it shortly.
3. Additionally, you'll be given a graph key. Note this down as your `APOLLO_KEY`. We'll use it to authenticate to your graph when working locally.


## Authenticate to the graph

Next, we'll create a Personal API Key so we can authenticate to our organization and run Rover commands locally.

In GraphOS Studio, click on your profile picture, then _Personal Settings_. Click _API Keys_, then _Create new key_. Copy your key, then run the following command in the terminal to authenticate with Rover.

```
rover config auth
```

When prompted, paste the value of your Personal API key. To check if you're authenticated successfully, run the following command:

```
rover config whoami
```

If you see your profile information displayed, you're all set!

## Starting up the subgraphs

First, open a terminal to the `prices` directory. Run `npm install`, then `npm run dev`. Your `prices` subgraph server should now be running on `http://localhost:4001`.

Next, open another terminal to the `stocks` directory. Run `npm install`, then `npm run dev`. Your `stocks` subgraph server should now be running on `http://localhost:4002`.


## Publishing your subgraphs

Now we're ready to publish the subgraph schemas to our graph. We have two subgraphs, `prices` and `stocks`, and we need to publish each schema using a specific command: `rover subgraph publish`. We provide this command with the `name`, `schema`, and `routing_url` reported for the subgraph we're publishing. 

Here's what it looks like:

```
rover subgraph publish <APOLLO_GRAPH_REF> --name <SUBGRAPH_NAME> --schema <PATH TO SCHEMA FILE> --routing-url <WHERE THE SUBGRAPH IS RUNNING>
```

We'll run this command in each of our subgraph directories, swapping out some of the variables for each. 

Open a terminal to the root of the `prices` directory and run the following command, remembering to swap in your own `APOLLO_GRAPH_REF` where indicated.

```
rover subgraph publish <APOLLO_GRAPH_REF> --name prices --schema ./schema.graphl --routing-url http://localhost:4001
```

Rover will show some output indicating that the subgraph schema has been successfully published. Next, navigate up a directory and into the `stocks` directory. Run the following command, remembering to swap in your own `APOLLO_GRAPH_REF` where indicated.

```
rover subgraph publish <APOLLO_GRAPH_REF> --name stocks --schema ./schema.graphl --routing-url http://localhost:4002
```

Now you can return to GraphOS Studio, and select _Subgraphs_ from the menu on the left. We should see that our two subgraphs have been published, and are now registered as part of our graph!

## Downloading and running the router

As the next step, we'll download and run the router binary locally. 

In the root of our project (outside of the `prices` and `stocks` subgraphs), run the following command to download the router.

```
curl -sSL https://router.apollo.dev/download/nix/latest | sh
```

This will create a new binary called `router` in the project directory. We can now run the router directly. The `config.yaml` file located in our project provides some configuration details for how the router should run. We'll include it in our command that starts up the router, indicating it with a `--config` flag. To start the router, make sure you have both your `APOLLO_GRAPH_REF` and `APOLLO_KEY` variables ready.

```
APOLLO_GRAPH_REF=<YOUR-APOLLO-GRAPH-REF> APOLLO_KEY=<YOUR-APOLLO-KEY> ./router --config config.yaml
```

Finally, we should see that the router is up and running on `http://127.0.0.1:4000`.

## Providing GraphOS with the router location

Our final step is updating our graph details in GraphOS Studio with the location of our running router. We're going to keep our router running locally for the purposes of this demo. On your graph's README page, underneath the graph ref, click the Connecting Settings. Paste in the location of `http://127.0.0.1.4000`. Your graph is ready to query!

Navigate to the left-hand _Explorer_ tab to get started building queries. 

