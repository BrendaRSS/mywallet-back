import bcrypt from "bcrypt";
import { collectionUsers } from "../database/db.js"
import {userSchema} from "../index.js";

export async function validationSignUpMeddleware(req, res, next) {
    const bodyUser = req.body;

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

    const bodyUserHashPassword = { ...bodyUser, password: hashPassowrd };

    req.bodyUserHashPassword = bodyUserHashPassword;

    next();
}