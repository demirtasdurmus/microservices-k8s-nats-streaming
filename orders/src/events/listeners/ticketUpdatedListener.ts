import { Message } from "node-nats-streaming"
import { Subjects, Listener, TicketUpdatedEvent } from "@dedutickets/common"
import { queueGroupName } from "./queuGroupName"
import { Ticket } from "../../models/ticket"


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName = queueGroupName

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data)
        if (!ticket) throw new Error('Ticket not found')
        const { title, price } = data
        ticket.set({ title, price })
        await ticket.save()

        msg.ack()
    }
}