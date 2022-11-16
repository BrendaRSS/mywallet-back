import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

