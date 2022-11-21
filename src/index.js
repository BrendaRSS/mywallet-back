import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
import {postSignup, postSignin} from "./controllers/authController.js"
import {postTransacoes, getTransacoes} from "./controllers/transacaoController.js"


//configs
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

//validações joi
export const userSchema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required()
});

export const transacaoSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().min(3).required(),
    type: joi.string().valid("saída", "entrada").required()
})

const mongoClient = new MongoClient("mongodb://localhost:27017");

try {
    await mongoClient.connect();
    console.log("MongoDB conectado!");
} catch (error) {
    console.log(error);
}

const db = mongoClient.db("ApiMyWallet");
export const collectionUsers = db.collection("users");
export const collectionSessions = db.collection("sessions");
export const collectionTransacoes = db.collection("transacoes");

app.post("/sign-up", postSignup);


app.post("/sign-in", postSignin);

app.post("/transacoes", postTransacoes)

app.get("/transacoes", getTransacoes)

// app.put("transacoes", async (req, res) => {

// })

// app.delete("transacoes", async (req, res)=>{

// })

app.listen(5000, () => console.log("Server running in port: 5000"));