import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

//configs
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

//validações joi
const userSchema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required()
});

const mongoClient = new MongoClient("mongodb://localhost:27017");

try {
    await mongoClient.connect();
    console.log("MongoDB conectado!");
} catch (error) {
    console.log(error);
}

const db = mongoClient.db("ApiMyWallet");
const collectionUsers = db.collection("users");

app.post("/sign-up", async (req, res) => {
    const bodyUser = req.body;
    console.log(bodyUser);

    try {
        const userExist = await collectionUsers.findOne({ email: bodyUser.email });
        if (userExist) {
            return res.status(409).send({ message: "Usuário já cadastrado!" })
        }

        const { error } = userSchema.validate(bodyUser, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(422).send(errors);
        }

        const hashPassowrd = bcrypt.hashSync(bodyUser.password, 10);
        console.log({ ...bodyUser, password: hashPassowrd });

        await collectionUsers.insertOne({ ...bodyUser, password: hashPassowrd });
        return res.status(201).send("Usuário cadastrado com sucesso!");
    } catch (error) {
        console.log(error);
        return res.status(400).send("Algum erro ocorreu!")
    }
});


// app.post("/sign-in", async (req, res) => {

// })

// app.get("/transacoes", async (req, res) => {

// })

// app.put("transacoes", async (req, res) => {

// })

// app.delete("transacoes", async (req, res)=>{

// })

app.listen(5000, () => console.log("Server running in port: 5000"));