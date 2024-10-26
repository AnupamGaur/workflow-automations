import express from 'express';
import { userRouter } from './routes/user';
import { zapRouter } from './routes/zap';
import cors from 'cors'
const app = express();
app.use(cors())
app.use(express.json())
app.use('/api/v1/user', userRouter);
app.use('/api/v1/zap', zapRouter);

app.listen(5000)