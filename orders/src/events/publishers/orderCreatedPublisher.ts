import { Publisher, OrderCreatedEvent, Subjects } from "@dedutickets/common"


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}