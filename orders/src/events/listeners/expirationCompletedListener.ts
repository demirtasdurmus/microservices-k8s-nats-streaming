import { Message } from "node-nats-streaming"
import { Subjects, Listener, ExpirationCompleted, OrderStatus } from "@dedutickets/common"
import { queueGroupName } from "./queuGroupName"
import { Order } from "../../models/order"
import { OrderCanceledPublisher } from "../publishers/orderCanceledPublisher"


export class ExpirationCompletedListener extends Listener<ExpirationCompleted> {
    readonly subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted
    queueGroupName = queueGroupName

    async onMessage(data: ExpirationCompleted['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket')

        if (!order) throw new Error('Order not found')

        // cofig after payment
        if (order.status === OrderStatus.Completed) return msg.ack()

        order.set({ status: OrderStatus.Canceled })
        await order.save()

        await new OrderCanceledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack()
    }
}