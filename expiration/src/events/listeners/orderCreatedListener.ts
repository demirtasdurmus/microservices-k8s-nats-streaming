import { Message } from "node-nats-streaming"
import { Subjects, Listener, OrderCreatedEvent } from "@dedutickets/common"
import { queueGroupName } from "./queuGroupName"
import { expirationQueue } from "../../queues/expirationQueue"


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - Date.now()
        console.log("waiting millisecods delay", delay)
        await expirationQueue.add(
            {
                orderId: data.id
            },
            { delay }
        )

        msg.ack()
    }
}