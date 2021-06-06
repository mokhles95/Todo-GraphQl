import { Request } from "express";

import todoService, { InputFields } from "./todo.service";

export default {
  Query: {
    todos: async (_: any, args: any, { req }: { req: Request }) => {
      return await todoService.getTodos(req);
    },
  },
  Mutation: {
    createTodo: async (
      _: any,
      { todoInput: { name, userId } }: any,
      { req }: { req: Request }
    ) => {
      return await todoService.createTodo({ name, userId }, req);
    },
    updateTodo: async (
      _: any,
      { todoInput: { id, name } }: any,
      { req }: { req: Request }
    ) => {
      return await todoService.updateTodo({ id, name }, req);
    },
    deleteTodo: async (
      _: any,
      { todoInput: { userId, id } }: any,
      { req }: { req: Request }
    ) => {
      return await todoService.deleteTodo({ userId, id }, req);
    },

    changeStatus: async (
      _: any,
      { todoInput: { id, status } }: any,
      { req }: { req: Request }
    ) => {
      return await todoService.changeStatus({ id, status }, req);
    },
    shareTodoWithUsers: async (
      _: any,
      { todoInput: { id, userId } }: any,
      { req }: { req: Request }
    ) => {
      return await todoService.shareTodoWithUsers({ id, userId }, req);
    },

    commentTodo: async (
      _: any,
      { todoInput: { id, userId, comment } }: any,
      { req }: { req: Request }
    ) => {
      return await todoService.commentTodo({ id, userId, comment }, req);
    },
  },
};
