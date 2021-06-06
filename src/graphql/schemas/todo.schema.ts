import { Schema, model, Types } from 'mongoose';

const todoSchema = new Schema(
  {
    name: String,
    status: String,
    comment: [{ type: Types.ObjectId, ref: 'Comment' , required:false }],
    sharedUsers :  [{ type: Types.ObjectId, ref: 'User' , required:false }],
    user : { type: Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default model('Todo', todoSchema);
