import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import userModel from "../feature/user/userModel";

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded: JwtPayload | null = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  const user = await userModel.findById(decoded._id).select("-password");
  if (!user) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  req.user = user;
  next();
};
