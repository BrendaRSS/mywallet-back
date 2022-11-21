import {collectionUsers, collectionSessions} from "../database/db.js";

export async function validationTokenMeddleware(req, res, next){
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).send("Token não enviado!");
    }

    try{
        const session = await collectionSessions.findOne({ token });
        if (!session) {
            return res.sendStatus(401);
        }

        const user = await collectionUsers.findOne({ _id: session.userId });
        if (!user) {
            return res.sendStatus(401);
        }

        res.locals.user = user;

    } catch(error){
        console.log(error);
        res.status(500).send("Token não enviado!")
    }

    next();
}