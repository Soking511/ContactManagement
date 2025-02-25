import { initializeSocket } from "./services/socketService";
import { createServer } from "http";
import { mountRoutes } from "./routes/mainRoutes";
import express, { Express } from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Socket.IO
initializeSocket(httpServer);

// Connect to MongoDB
connectDB();

mountRoutes(app);

httpServer.listen(port, () => { 
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
