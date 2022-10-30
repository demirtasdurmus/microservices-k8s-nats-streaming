import { Message } from "node-nats-streaming"
import { Subjects, Listener, OrderCanceledEvent, OrderStatus } from "@dedutickets/common"
import { queueGroupName } from "./queuGroupName"
import { Order } from "../../models/order"


export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
    readonly subject: Subjects.OrderCanceled = Subjects.OrderCanceled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCanceledEvent['data'], msg: Message) {
        const order = await Order.findOne({ _id: data.id, version: data.version - 1 })
        if (!order) throw new Error('Order not found')
        order.set({
            status: OrderStatus.Canceled
        })
        await order.save()

        msg.ack()
    }
}