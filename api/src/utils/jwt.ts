import jwt from "jsonwebtoken";
import { IUser } from "../feature/user/userInterface";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = "30d";

export interface JwtPayload {
  _id: string;
  username: string;
}

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { _id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};
