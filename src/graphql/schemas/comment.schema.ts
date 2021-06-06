import { Schema, model, Types } from 'mongoose';

const commentSchema = new Schema(
  {
    message: String,
    user : { type: Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default model('Comment', commentSchema);
