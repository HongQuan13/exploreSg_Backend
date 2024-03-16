import mongoose from "mongoose";
import config from "../configs/mongodb.config";
import dotenv from "dotenv";
dotenv.config();

const { host, port, name } = config.db;
// const connectionString: string = `mongodb://${host}:${port}/${name}`;

const connectionString: string = `mongodb+srv://exploreSG:${process.env.MONGODB_PASSWORD}@chat-app.yybkju4.mongodb.net/ExploreSG?retryWrites=true&w=majority`;

class Database {
  static instance: any;

  constructor() {
    this.connect();
  }

  connect() {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });
    mongoose
      .connect(connectionString)
      .then((_) => {
        console.log(`Connected MongoDb successful`);
      })
      .catch((err: any) => console.log("Error Connection!", err.stack));
  }

  static getInstance = () => {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  };
}

const instanceMongodb = Database.getInstance;

export { instanceMongodb };
