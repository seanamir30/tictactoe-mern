import express, { Express } from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import { matchController } from './controllers/match.controller';
import cors from 'cors';


dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT;
const mongoDBUrl = process.env.MONGO_DB_URL || '';

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongoDBUrl)
    .then(()=>{
        console.log('Database Connected')
    })

app.use('/api/v1', matchController)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});