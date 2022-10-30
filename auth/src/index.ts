import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) throw Error("MONGO URI MISSING")
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb:' + con.connections[0].name);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
