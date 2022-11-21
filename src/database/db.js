import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// configs
dotenv.config();

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
