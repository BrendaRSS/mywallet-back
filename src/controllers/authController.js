import {userSchema} from "../index.js";
import { collectionUsers, collectionSessions} from "../database/db.js"
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function postSignup(req, res) {
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
}

export async function postSignin (req, res) {
    const { email, password } = req.body;

    const token = uuidV4();

    try {
        const userExist = await collectionUsers.findOne({ email });
        if (!userExist) {
            return res.status(401).send("Usuário não cadastrado!");
        }

        const passwordOkay = bcrypt.compareSync(password, userExist.password);
        if (!passwordOkay) {
            return res.status(401).send("Senha incorreta!");
        }

        await collectionSessions.insertOne({
            token,
            userId: userExist._id
        })

        delete userExist.password;

        return res.status(201).send({ token, userExist });
    } catch (error) {
        console.log(error);
        return res.status(400).send("Algum erro ocorreu!");
    }

}