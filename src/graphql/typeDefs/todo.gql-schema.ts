import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    todos: [Todo!]!
  }

  extend type Mutation {
    createTodo(todoInput: TodoInputData): Todo
    updateTodo(todoInput: TodoInputData): Todo
    deleteTodo(todoInput: TodoInputData): Message
    changeStatus(todoInput: TodoInputData): Message
    shareTodoWithUsers(todoInput: TodoInputData): Message
    commentTodo(todoInput: TodoInputData): Message
  }

  type Todo {
    id: ID
    name: String
    status: String
    comment: String
    sharedUsers: [User]
    user: User
  }
  type Message {
    message: String!
  }

  input TodoInputData {
    id: String
    name: String
    userId: String
    status: String
    comment: String
  }
`;
