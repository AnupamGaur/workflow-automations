import {Router, Request,Response} from 'express'
import { authMiddleware } from '../authMiddleware'
import { SigninSchema, SignupSchema } from '../types'
import {PrismaClient} from '@prisma/client'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { config } from '../config'
const router = Router()
const client = new PrismaClient()

interface customrequest extends Request{
  id?: number
}

router.post('/signup', async (req:Request,res:Response) => {
  const body = req.body
  const parsedData = SignupSchema.safeParse(body)
  const {username,password,name} = req.body

  if(!parsedData){
   res.json({error: 'Invalid data'})
   return;
  }
  const userExists = await client.user.findFirst({
    where: {email: username}
  })
  if(userExists){
    res.json({error: 'User already exists'})
    return;
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await client.user.create({
    data:{
      email: username,
      password: hashedPassword,
      name: name
    }
})
  res.json({
    "msg":"Please verify your email. You have receive a verification link on your email"
  })
  return;
})

router.post('/signin', async (req,res) => {
  const body = req.body
  const parsedData = SigninSchema.safeParse(body)
  const {username,password} = req.body
  
  if(!parsedData){
   res.json({error: 'Invalid data'})
   return;
  }
  const userExists = await client.user.findFirst({
    where: {email: username}
  })
  if(!userExists){
    res.status(403).json({error: 'User not found'});
    return; 
  }else{
    const isMatch = await bcrypt.compare(password, userExists.password);
    if(!isMatch){
    res.status(403).json({error: 'Invalid login credentials'});
    return;
    }
    const token = jwt.sign({ userId: userExists.id }, config.JWT_SECRET);
    res.json({token: token})
    }
  }
)

router.post('/',authMiddleware,async (req:customrequest,res) => {
  const id = req.id;
  const user = await client.user.findFirst({
    where:{
      id
    },
    select:{
      name:true,
      email:true
    }
  })
  res.json({
    user: user
  })
  return;
})

export const userRouter = router