import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import viewsRoute from "./routes/view.router.js";

const app = express();
const PORT = 3000;

const messages = [];
app.use(express.json());
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("iniciado con socket.io");
});

const io = new Server(httpServer);
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/views", viewsRoute);

app.get("/messages", (req, res) => {
  res.json(messages);
});

io.on("connection", (socket) => {
  //console.log("new user connected");
  socket.on("new-user", (data) => {
    socket.user = data.user;
    socket.id = data.id;
    io.emit("new-user-connected", {
      user: socket.user,
      id: socket.id,
    });
  });
  /*socket.broadcast.emit("new-user-connected", {
    user: socket.user,
    id: socket.id,
  });
  */

  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });
});
