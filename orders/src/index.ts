import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from "./natsWrapper"
import { TicketCreatedListener } from "./events/listeners/ticketCreatedListener"
import { TicketUpdatedListener } from "./events/listeners/ticketUpdatedListener"
import { ExpirationCompletedListener } from "./events/listeners/expirationCompletedListener"
import { PaymentCreatedListener } from "./events/listeners/paymentCreatedListener"

const start = async () => {
  console.log("----")
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
      console.log("NATS lost connection")
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
    process.on('SIGUSR2', () => natsWrapper.client.close())

    // start listening NATS
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompletedListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()

    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Mongodb:' + con.connections[0].name);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
