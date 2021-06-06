# Description de projet :
c'est une petite application back-end de gestion de To-do List en NodeJs, TypeScript, avec GraphQL , MongoDB et redis
# pour lance ce projet il faut que vous suivez les étapes suivantes: 
1- npm install ==> pour installer les dépendances
2- npm start ==> pour lancer le projet
3- le projet va etre lancer sur le port 3000, donc pour tester les fonctionnalitées il faut que vous lancez le url suivant : http://localhost:3000/graphql
4- vous allez trouver l'interface playground pour tester
# scénario de test:
# I) gestion des utilisateurs
1- resgister : 
mutation {
  register(
    userInput: {
      userName: "mokhles"
      email: "mokhles@gmail.com"
      password: "123456"
    }
  ) {
    userName
  }
}

2- login : 
query { 
login(email:"mokhles@gmail.com",password:"123456") {message token}
}
ps : un token va etre générer apres le login 

3- liste des utilisateurs : 
query { 
users {id userName email password}
}
ps : n'oubliez pas de passer le token dans le "header" 
example :
{"authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MGI4ZjBiNjk1MDlkYzNiMGM2NDAxMzYiLCJpYXQiOjE2MjI5ODk0NzcsImV4cCI6MTYyMzA3NTg3N30.oejhk4HRazNPWzvzLP88VNLvr4KkMUGYmjNDdGhIvZw"}

# II) gestion des taches
1- lorsque vous etes authetifier vous pouvez ajouter une tache
mutation {
  createTodo(
    todoInput: { name: "first todo", userId: "60b8f0b69509dc3b0c640136" }
  ) {
    name
  }
}
2 - modifier une todo: 
mutation {
  updateTodo(
    todoInput: {id:"60ba17d8d1609f1f0471b74d", name: "new todo" }
  ) {
    name
  }
}
3 - supprimer une todo :
mutation {
  deleteTodo(
    todoInput: {userId:"60ba146b887a043e68dd6847", id: "60ba17d8d1609f1f0471b74d " }
  ) {
    name
  }
}
ps :  Un utilisateur ne pourra pas supprimer la tâche d un un autre utilisateur
4- marquer un todo comme (complété/nom complété) 
mutation {
  changeStatus(
    todoInput: {
      id: "60ba17d8d1609f1f0471b74d"
      status:"complété"
    }
  ) {
    message
  }
}
5- partager une todo avec des autres utilisateurs
mutation {
  shareTodoWithUsers(
    todoInput: {
      id: "60ba17d8d1609f1f0471b74d"
      userId:"60ba146b887a043e68dd6847"
    }
  ) {
    message
  }
}
6- commenter une todo:
mutation {
  commentTodo(
    todoInput: { id: "60ba17d8d1609f1f0471b74d", userId: "60b8f0b69509dc3b0c640136" , comment:"comment" }
  ) {
    message
  }
}
# middlewares :
- JWT pour la sécurité
- redis : pour sauvegarder les informations de l'utilisateur.
# Architecture de projet:
-src
 -config
    redis.init.ts
 -graphql
    -resolvers
    -schemas
    -typeDefs
 -middleware
formatGraphQlErrors.ts
index.ts



- description :
resolvers :contient les fonctions pour alimententer les données pour les champs de schéma.
typeDefs : représentant le schéma GraphQL de notre serveur
scheams: représente le models de notre application

# Docker
- J'ai utilisé docker-compose pour pour définir et exécuter l'application et la base de donnée sur Docker
- pour éxucuter l'application sur docker il faut suiver les étapes suivates: 
1)docker-compose build
2)docker-compose up -d mongo
3)docker-compose up
