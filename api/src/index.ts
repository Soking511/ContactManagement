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

// Configure CORS
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Socket.IO
initializeSocket(httpServer);

// Connect to MongoDB
connectDB();

mountRoutes(app);

httpServer.listen(port, () => { 
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
