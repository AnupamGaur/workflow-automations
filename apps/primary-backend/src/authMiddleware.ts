import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config";

interface customrequest extends Request{
  id?: number;
}

interface JWTpayload {
  userId: string;
}

export function authMiddleware(req: customrequest, res: Response,next:NextFunction){
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) {
    res.status(404).json({
      "error": "Token not found"
    })
    return;
  }

  try{
    const payload = jwt.verify(
      token,
      config.JWT_SECRET
      ) as JWTpayload;
      req.id = Number(payload.userId);
      next();
  } catch(e){
    res.json({ error : "JWT not verified" });
    return;
  }

}