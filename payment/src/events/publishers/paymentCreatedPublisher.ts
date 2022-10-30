import { Publisher, PaymentCreatedEvent, Subjects } from "@dedutickets/common"


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}