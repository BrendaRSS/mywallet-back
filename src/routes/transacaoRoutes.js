import {postTransacoes, getTransacoes} from "../controllers/transacaoController.js"
import {Router} from "express";

const router = Router();

router.post("/transacoes", postTransacoes)

router.get("/transacoes", getTransacoes)

// router.put("transacoes", async (req, res) => {

// })

// router.delete("transacoes", async (req, res)=>{

// })

export default router;