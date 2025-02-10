import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { corsoptions } from "./constants/config.js";
import { socketAuthentication } from "./middleware/auth.js";
import { handleApiError } from "./middleware/error.js";
import { userRouter } from "./router/user.router.js";
import { connect } from "./utils/connection.js";
import { eventRouter } from "./router/event.router.js";
connect();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsoptions));

const server = createServer(app);
const io = new Server(server, { cors: corsoptions });

app.set("io", io);
io.use(socketAuthentication);

export const userSocketIds = new Map();

io.on("connection", (socket) => {
  const user = socket.user;

  userSocketIds.set(user._id.toString(), socket.id);
  console.log(userSocketIds);
  

  socket.on("disconnect", () => {
    if (user && user._id) {
      userSocketIds.delete(user._id.toString());
    }
    console.log("user disconnected");
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.get("/", (req, res) => {
  res.send("<div>Hello World</div>");
});

app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);

app.use(handleApiError);

server.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
