import user from './user/user.resolver';
import todo from './todo/todo.resolver';
export default {
  Query: {
    ...user.Query,
    ...todo.Query,
  },
  Mutation: {
    ...user.Mutation,
    ...todo.Mutation,
  },
//   Subscription: {
//   },
};
