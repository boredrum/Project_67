import express from "express";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";

const readStream = fs.createReadStream("./public/message.txt");
const writeStream = fs.createWriteStream("./public/message.txt");

const handleError = () => {
	console.log("Error");
	readStream.destroy();
	writeStream.end("Finished with error...");
};

readStream
  .on("error", handleError)
  .pipe(writeStream)
  .on("error", handleError);

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");

app.get("/", (req, res) => {
      res.render("index");
});

app.get("/load-chat", (req, res) => {
  fs.readFile("./public/message.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Cannot load chat:", err);
      res.status(500).send("Error loading chat");
    } else {
      res.send(data);
    }
  });
});

server.listen(PORT, () => {
	console.log(`Server started on http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
	console.log("a user connected");

	socket.on("con_user", (data) => {
		io.emit("on_user", { name: data.name });

		socket.on("disconnect", (reason) => {
			console.log(`User disconnect, reason: ${reason}`);
			io.emit("off_user", { name: data.name });
		});
	});

	socket.on("send_msg", (data) => {
		io.emit("new_msg", { name: data.name, msg: data.msg });
	});

	socket.on("save_chat", (savedChat) => {
		fs.writeFile("./public/message.txt", savedChat, (err) => {
      console.log(savedChat)
      if (err){
        console.error("Cannot save the chat:", err);
      }else{
        console.log("Chat has been saved");
      }
    })
	});
});
