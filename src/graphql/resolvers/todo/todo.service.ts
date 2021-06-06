import CreateError from "http-errors";
import { Request } from "express";
import Todo from "../../../graphql/schemas/todo.schema";
import { authMiddleWare } from "../../../middleware/jwt.redis";
import { User } from "../../schemas";
import Comment from "../../schemas/comment.schema";

export interface InputFields {
  id?: string;
  name?: string;
  userId?: string;
  status?: string;
  comment?: string;
}

export default class TodoService {
  //  get list of todos
  static async getTodos(req: Request) {
    try {
      // check if the user is athentificated
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();
      //  return the todos
      return await Todo.find();
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  //  create a todo
  //  this function recieve the name of the todo and the user id of the user connected
  //  the status of this todo will bel "complété" by default
  static async createTodo({ name, userId }: InputFields, req: Request) {
    try {
      // check if the user is athentificated
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();
      // check if the name is already exist
      const todoExist = await Todo.findOne({ name });
      //  if the the todo exist return the error
      if (todoExist) return new CreateError.Conflict("todo name alredy exist");
      // else create the todo
      const todo = new Todo({
        name: name,
        user: userId,
        status: "non complétée",
      });

      await todo.save();
      return todo;
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  // update the todo
  //  this function recirve the todo id and the todo name as a parametres
  static async updateTodo({ id, name }: InputFields, req: Request) {
    try {
      // check if the user is athentificated
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();
      // check if the todo exist
      const todo = await Todo.findById(id);
      // if not return an error
      if (!todo) return new CreateError.NotFound("todos does not exist");
      // update the todo
      else return await Todo.findByIdAndUpdate(id, { name });
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  //  delete the todo
  //  this function recieve user id and the todo id as a parametres
  //  only the owner of the todo can delete
  static async deleteTodo({ userId, id }: InputFields, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();
      const todo = await Todo.findById(id);
      //  check if the todo created by the the user
      if (todo.user != userId)
        //  if not return an error
        return new CreateError.NotFound(
          "you dont have the permession to delete this todo"
        );
      else await Todo.deleteOne({ _id: id, user: data.id });
      return { message: "todo deleted" };
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  // change the status of the todo
  //  this function recieve the todo id and the user have to choose the status
  static async changeStatus({ id, status }: InputFields, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();
      //  chech if the todo exist
      const todo = await Todo.findById(id);
      //  if not return an error
      if (!todo) return new CreateError.NotFound("todos does not exist");
      else await Todo.findByIdAndUpdate(id, { status: status });
      return { message: "status changed to " + status };
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  //  share the todo with other users
  // this function recieve the todo id and the user id
  static async shareTodoWithUsers({ id, userId }: InputFields, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();
      //  find the user
      const user = await User.findById(userId);
      // check if the user exist
      if (!user) return new CreateError.NotFound("user does not exist");
      //  find the todo
      const todo = await Todo.findById(id);
      //  check if the todo exist
      if (!todo) return new CreateError.NotFound("todo does not exist");
      //  check if the user is alredy affected in the past
      if (todo.sharedUsers.includes(user._id))
        //  if yes return an error
        return new CreateError.NotFound("user already affected");
      // push the user in the list of shared users
      todo.sharedUsers.push(user._id);
      await todo.save();
      return { message: user.userName + "is affected to this todo" };
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  //  comment a todo
  //  this function recieve the todo is the user id and the comment wirtten by the user
  static async commentTodo({ id, userId, comment }: InputFields, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();
      //  find the user and the todo
      const user = await User.findById(userId);
      const todo = await Todo.findById(id);
      //  if any of them does not exist return an error
      if (!user) return new CreateError.NotFound("user does not exist");
      if (!todo) return new CreateError.NotFound("todo does not exist");
      // create the comment
      //  I make the comment in another schema to make a tracability of the user
      else {
        const newComment = new Comment({
          message: comment,
          user: user._id,
        });
        //  save the comment
        await newComment.save();
        //  affect this comment in list of comments in todo schema
        await Todo.findByIdAndUpdate(id, {
          $push: { comment: newComment._id },
        });
      }
      return { message: "comment added successfully" };
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
}
