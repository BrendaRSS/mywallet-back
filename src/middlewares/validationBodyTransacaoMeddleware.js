import { transacaoSchema } from "../index.js";

export function validationBodyTransacaoMeddleware(req, res, next){
    const bodyTransacao = req.body;

    const { error } = transacaoSchema.validate(bodyTransacao, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    req.bodyTransacao = bodyTransacao;

    next();
}