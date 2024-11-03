import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  canManageUsers: boolean;
  canManageVendors: boolean;
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, "Invalid email!"],
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    // select: false, // to hide password from the response
  },

  canManageUsers:{
    type: Boolean,
    default: false
  },
  canManageVendors:{
    type: Boolean,
    default: false
  }
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
