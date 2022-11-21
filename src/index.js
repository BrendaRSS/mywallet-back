import express from "express";
import cors from "cors";
import joi from "joi";
import authRoutes from "./routes/authRoutes.js";
import transacaoRoutes from "./routes/transacaoRoutes.js";

//configs
const app = express();
app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(transacaoRoutes);

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

app.listen(5000, () => console.log("Server running in port: 5000"));