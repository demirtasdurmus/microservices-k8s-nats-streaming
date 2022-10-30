import { Message } from "node-nats-streaming"
import { Subjects, Listener, OrderCanceledEvent } from "@dedutickets/common"
import { queueGroupName } from "./queuGroupName"
import { Ticket } from "../../models/ticket"
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher"


export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
    readonly subject: Subjects.OrderCanceled = Subjects.OrderCanceled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCanceledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket) throw new Error('Ticket not found')
        ticket.set({ orderId: undefined })
        await ticket.save()

        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId!
        })

        msg.ack()
    }
}