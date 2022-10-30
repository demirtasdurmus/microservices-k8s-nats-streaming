import { Publisher, OrderCanceledEvent, Subjects } from "@dedutickets/common"


export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
    subject: Subjects.OrderCanceled = Subjects.OrderCanceled
}