import { Publisher, Subjects, TicketUpdatedEvent } from "@dedutickets/common"


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}