import { PrismaClient } from "@prisma/client";
import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
})

const client = new PrismaClient();


async function main() {
  const producer = kafka.producer()

await producer.connect()

  while(1){
    const pendingRows = await client.zapRunOutbox.findMany({
      where:{},
      take:10
    })

      await producer.send({
        topic: 'zap-events',
        messages: pendingRows.map(r => ({
          value: r.zapRunId 
        })
        )
      })

      await client.zapRunOutbox.deleteMany({
        where: {
          id: {
            in: pendingRows.map(r => r.id)
          }
        }
      })
  
}
}
main();