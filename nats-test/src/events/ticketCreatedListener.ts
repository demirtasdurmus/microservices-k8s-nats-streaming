import { Message } from 'node-nats-streaming';
import { Listener } from "./baseListener"
import { Subjects } from "./subjects"
import { TicketCreatedEvent } from './ticketCreatedEvent';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'payment-service'

    onMessage = (data: TicketCreatedEvent['data'], msg: Message) => {
        console.log("Message received, seq:", msg.getSequence(), data)

        console.log(data.title)
        // business logic
        msg.ack()
    }
}