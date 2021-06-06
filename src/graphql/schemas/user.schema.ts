import { Schema, model, Types } from 'mongoose';

const userSchema = new Schema(
  {
    userName: String,
    email: String,
    password: String
  },
  { timestamps: true }
);

export default model('User', userSchema);
