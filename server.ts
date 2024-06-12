// import app from "./src/app";
import { httpServer } from "./src/socket/socket";

const PORT = process.env.PORT || 3100;

const server = httpServer.listen(3100, "0.0.0.0", () => {
  console.log(`Connected port :: 3100`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit Server Express"));
  // notify.send()
});
