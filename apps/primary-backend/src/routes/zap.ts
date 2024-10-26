import {Router,Request} from 'express'
import { authMiddleware } from '../authMiddleware'
import { ZapCreateSchema } from '../types'
import {PrismaClient} from '@prisma/client'

const router = Router()
const client = new PrismaClient()

interface customrequest extends Request{
  id?: number;
}

router.post('/',authMiddleware, async(req:customrequest,res) => {
  const body = req.body
  const parsedData = ZapCreateSchema.safeParse(body)
  if(!parsedData.success){
    res.status(411).json({"message":"Incorrect inputs"})
    return
  }

  const zapId = await client.$transaction(async tx =>{
  const zap = await tx.zap.create({
    data: {
      userId: req.id!,     //id will most certainly exist after passing the authmiddleware function
      actions: {
        create: parsedData.data.actions.map((action,index) => ({
          selectedActionId: action.actionId,
          sortingOrder: index
        })),
      }
    },
  })
  const trigger = await tx.trigger.create({
    data:{
      selectedTriggerId: parsedData.data.triggerId,
      zapId: zap.id
    }
  })
  await tx.zap.update({
    where:{
      id: zap.id
    },
    data:{
      trigger: {
        connect: {
          id: trigger.id
        }
      }
    }
  })
    return zap.id
})
res.json({
zapId
})
return;

})
router.get('/',authMiddleware, async (req:customrequest,res) => {
  const zaps = await client.zap.findMany({
    where:{
      userId: req.id,
    },
    include: {
      actions:{
        include:{
          selectedAction: true
        }
      },
      trigger:{
        include:{
          SelectedTrigger:true
        }
      }
    }
  })
  res.json({zaps})
  return;
})  
router.get('/:zapId',authMiddleware, async (req:customrequest,res) => {
  const zapId = req.params.id;
  const zap = await client.zap.findFirst({
    where:{
      userId: req.id,
      id:zapId,
    },
    include: {
      actions:{
        include:{
          selectedAction: true
        }
      },
      trigger:{
        include:{
          SelectedTrigger:true
        }
      }
    }
  })
  res.json(zap)
  return;
})

export const zapRouter = router