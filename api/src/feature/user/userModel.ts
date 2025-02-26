import mongoose from "mongoose";
import { IUser } from "./userInterface";
import bcrypt from "bcryptjs";

interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  // we use gen salt because we need more security
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model<IUser, UserModel>("User", userSchema);

export default userModel;
