import express from 'express';
import cors from 'cors';

import mongoose from 'mongoose';
import userRouter from './routers/user.router';
import adminRouter from './routers/admin.router';

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/Masta-Basta')
const conn = mongoose.connection
conn.once('open', ()=>{
    console.log("DB ok")
})

const router = express.Router()
router.use('/korisnik', userRouter)
router.use('/admin', adminRouter)
app.use("/" ,router)

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(4000, () => console.log(`Express server running on port 4000`));