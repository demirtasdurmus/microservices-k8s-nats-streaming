import Queue from "bull"
import { natsWrapper } from '../natsWrapper'
import { ExpirationCompletedPublisher } from "../events/publishers/expirationCompletePublisher"

interface Payload {
    orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => {
    console.log("pusblish an expiration", job.data.orderId)
    new ExpirationCompletedPublisher(natsWrapper.client).publish({ orderId: job.data.orderId })
})

export { expirationQueue }