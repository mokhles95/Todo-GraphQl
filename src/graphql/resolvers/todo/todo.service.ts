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
  //  obtenir la liste des taches
  static async getTodos(req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      return await Todo.find();
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  //  créer une tache
  static async createTodo({ name, userId }: InputFields, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      const todoExist = await Todo.findOne({ name });
      if (todoExist) return new CreateError.Conflict("todo name alredy exist");

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
  // modifier une tache
  static async updateTodo({ id, name }: InputFields, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      const todo = await Todo.findById(id);

      if (!todo) return new CreateError.NotFound("todos does not exist");
      else return await Todo.findByIdAndUpdate(id, { name });
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  //  supprimer une tache
  static async deleteTodo({ userId, id }: InputFields, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();
      const todo = await Todo.findById(id);

      if (todo.user != userId)
        return new CreateError.NotFound(
          "you dont have the permession to delete this todo"
        );
      else await Todo.deleteOne({ _id: id, user: data.id });
      return { message: "todo deleted" };
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  // changer le statut
  static async changeStatus({ id, status }: InputFields, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      const todo = await Todo.findById(id);
      if (!todo) return new CreateError.NotFound("todos does not exist");
      else await Todo.findByIdAndUpdate(id, { status: status });
      return { message: "status changed to " + status };
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  //  partager une tache avec d'autres utilisateurs
  static async shareTodoWithUsers({ id, userId }: InputFields, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      const user = await User.findById(userId);
      if (!user) return new CreateError.NotFound("user does not exist");
      const todo = await Todo.findById(id);
      if (!todo) return new CreateError.NotFound("todo does not exist");

      if (todo.sharedUsers.includes(user._id))
        return new CreateError.NotFound("user already affected");
      todo.sharedUsers.push(user._id);
      await todo.save();
      return { message: user.userName + "is affected to this todo" };
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  //  commenter un todo
  static async commentTodo({ id, userId, comment }: InputFields, req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();
      const user = await User.findById(userId);
      const todo = await Todo.findById(id);
      if (!user) return new CreateError.NotFound("user does not exist");
      if (!todo) return new CreateError.NotFound("todo does not exist");
      else {
        const newComment = new Comment({
          message: comment,
          user: user._id,
        });
        await newComment.save();
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
