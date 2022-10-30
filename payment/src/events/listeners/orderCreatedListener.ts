import { Message } from "node-nats-streaming"
import { Subjects, Listener, OrderCreatedEvent } from "@dedutickets/common"
import { queueGroupName } from "./queuGroupName"
import { Order } from "../../models/order"



export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        console.log("-------------------------", data)
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        })
        await order.save()

        msg.ack()
    }
}