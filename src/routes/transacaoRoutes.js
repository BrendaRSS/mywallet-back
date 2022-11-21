import {postTransacoes, getTransacoes} from "../controllers/transacaoController.js"
import {Router} from "express";
import {validationTokenMeddleware} from "../middlewares/validationTokenMeddleware.js"; 
import { validationBodyTransacaoMeddleware } from "../middlewares/validationBodyTransacaoMeddleware.js";

const router = Router();

router.use(validationTokenMeddleware);

router.post("/transacoes", validationBodyTransacaoMeddleware, postTransacoes);

router.get("/transacoes", getTransacoes);

// router.put("transacoes", async (req, res) => {

// })

// router.delete("transacoes", async (req, res)=>{

// })

export default router;