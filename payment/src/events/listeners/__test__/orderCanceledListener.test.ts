import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCanceledEvent, OrderStatus } from '@dedutickets/common';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCanceledListener } from '../orderCanceledListener';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 10,
    userId: "sdknk"
  })

  await order.save()

  const data: OrderCanceledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'alskdfj',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order };
};

it('sets order status to canceled', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
