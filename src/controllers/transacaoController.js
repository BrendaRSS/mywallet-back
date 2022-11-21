import { collectionTransacoes } from "../database/db.js"
import dayjs from "dayjs";

export async function postTransacoes(req, res){
    const bodyTransacao = req.bodyTransacao;
    const user = res.locals.user;
    console.log(user);

    try {
        const transacoesUser = await collectionTransacoes.insertOne({ ...bodyTransacao, time: dayjs().locale("pt").format("DD/MM/YYYY"), userId: user._id });

        return res.status(201).send({message:"Transação feita com sucesso!"});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Algum erro ocorreu!");
    }

}

export async function getTransacoes(req, res) {
    const user = res.locals.user;

    try {
        const transacoesUser = await collectionTransacoes.find({ userId: user._id }).toArray();

        return res.status(201).send(transacoesUser)

    } catch (error) {
        console.log(error);
        return res.status(500).send("Algum erro ocoreu!")
    }

}