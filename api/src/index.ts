import { cleanContact, initializeSocket, setInitialContacts } from "./services/socketService";
import { createServer } from "http";
import { mountRoutes } from "./routes/mainRoutes";
import express, { Express } from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
import contactModel from "./feature/contact/contactModel";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;
let contactsLoaded = false;

// Configure CORS
app.use(cors({
  origin: '*',
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

httpServer.listen(port, async() => {
  if (!contactsLoaded) {
    const contacts = await contactModel.find();
    setInitialContacts(contacts.map(cleanContact));
    contactsLoaded = true;
  }
  console.log(`⚡️[server]: Server is running at port: ${port}`);
});
