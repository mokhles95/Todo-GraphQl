import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";

import formatGraphQLErrors from "./formatGraphQlErrors";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

const app = express();
// instance de appolo server avec les options:
// formatError : Fournir cette fonction pour transformer la structure des objets d’erreur avant qu’ils ne soient envoyés à un client
// typeDefs : représentant le schéma GraphQL de notre serveur
// resolvers : ce sont des fonctions pour alimententer les données pour les champs de schéma.
// context : cela permet aux "resolvers" de partager un contexte utile, comme une connexion à une base de données.
const server = new ApolloServer({
  formatError: formatGraphQLErrors,
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

server.applyMiddleware({ app });

mongoose
  .connect("mongodb://localhost:27017/todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("connected");
    });
  })
  .catch((err) => console.log(err));
