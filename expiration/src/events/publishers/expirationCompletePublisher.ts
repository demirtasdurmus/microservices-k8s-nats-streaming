import { Publisher, ExpirationCompleted, Subjects } from "@dedutickets/common"


export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleted> {
    readonly subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted
}