import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import userModel from "./userModel";
import { generateToken } from "../../utils/jwt";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userExists = await userModel.findOne({ username });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = await userModel.create({ username, password });
  const token = generateToken(user);

  res.status(201).json({
    _id: user._id,
    username: user.username,
    token,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }

  const token = generateToken(user);

  res.json({
    _id: user._id,
    username: user.username,
    token,
  });
});
