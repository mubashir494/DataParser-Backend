import express from "express";
import bodyParser from 'body-parser'
import cors from 'cors'
import data from './routes/data.js'
import { PrismaClient } from "@prisma/client";


const PORT = 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



app.use('/data',data)


app.listen(PORT,() =>{
    console.log("Listening on PORT "+PORT)
})