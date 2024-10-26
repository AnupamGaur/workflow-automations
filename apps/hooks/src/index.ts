import express from 'express'
import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

const app = express()
app.use(express.json())
app.post('/hooks/catch/:userId/:zapId', async (req, res) => {
  const user = req.params.userId
  const zapId = req.params.zapId
  await client.$transaction(async (tx) => {
    const run = await tx.zapRun.create({
      data:{
        zapId: zapId,
        metadata: req.body
      }
    }
    )
    await tx.zapRunOutbox.create({
      data:{
        zapRunId: run.id,
      }
  })

})
res.json(
  {
    message: `ZAP Scan for user ${user} with ZAP ID ${zapId} has been triggered and logged to the database`
  }
)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})