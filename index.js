import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import dayjs from "dayjs";

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

const transacaoSchema = joi.object({
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
const collectionUsers = db.collection("users");
const collectionSessions = db.collection("sessions");
const collectionTransacoes = db.collection("transacoes");

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


app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;

    const token = uuidV4();

    try {
        const userExist = await collectionUsers.findOne({ email });
        if (!userExist) {
            return res.sendStatus(401);
        }

        const passwordOkay = bcrypt.compareSync(password, userExist.password);
        if (!passwordOkay) {
            return res.status(401).send("Senha incorreta!");
        }

        await collectionSessions.insertOne({
            token,
            userId: userExist._id
        })

        return res.status(201).send({ token });
    } catch (error) {
        console.log(error);
        return res.status(400).send("Algum erro ocorreu!");
    }

})

app.post("/transacoes", async (req, res) => {
    const bodyTransacao = req.body
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).send("Token não enviado!");
    }

    const { error } = transacaoSchema.validate(bodyTransacao, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const session = await collectionSessions.findOne({ token });
        if (!session) {
            return res.sendStatus(401);
        }

        const user = await collectionUsers.findOne({ _id: session.userId });
        if (!user) {
            return res.sendStatus(401);
        }

        const transacoesUser = await collectionTransacoes.insertOne({ ...bodyTransacao, time: dayjs().locale("pt").format("DD/MM/YYYY"), userId: user._id });

        return res.status(201).send({message:"Transação feita com sucesso!"});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Algum erro ocorreu!");
    }

})

app.get("/transacoes", async (req, res) => {
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).send("Token não enviado!");
    }

    try {
        const session = await collectionSessions.findOne({ token });
        
        const user = await collectionUsers.findOne({ _id: session?.userId });
        if (!user) {
            return res.sendStatus(401);
        }
        
        const transacoesUser = await collectionTransacoes.find({ userId: user._id }).toArray();

        return res.status(201).send(transacoesUser)

    } catch (error) {
        console.log(error);
        return res.status(500).send("Algum erro ocoreu!")
    }

})

// app.put("transacoes", async (req, res) => {

// })

// app.delete("transacoes", async (req, res)=>{

// })

app.listen(5000, () => console.log("Server running in port: 5000"));