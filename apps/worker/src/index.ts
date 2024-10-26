import {Kafka} from "kafkajs"


const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
})

async function main(){
  const consumer = kafka.consumer({ groupId: 'main-worker',
   })

await consumer.connect()
await consumer.subscribe({ topic: 'zap-events', fromBeginning: true }
)

await consumer.run({
  autoCommit:false,
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      topic,
      value: message.value?.toString(),
      offset: message.offset
    })

    await new Promise(r => setTimeout(r,1000))

    await consumer.commitOffsets([{
      topic: "zap-events",
      partition: partition,
      offset: String(parseInt(message.offset) + 1),
    }])
  },
})
}

main()