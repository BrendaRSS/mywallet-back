import {
    transacaoSchema, 
    collectionUsers, 
    collectionSessions, 
    collectionTransacoes } from "../index.js";
    import dayjs from "dayjs";

export async function postTransacoes(req, res){
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

}

export async function getTransacoes(req, res) {
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

}