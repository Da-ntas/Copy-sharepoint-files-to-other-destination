import dotenv from "dotenv";
import express from "express";
import { logRequest, middleware, router } from "./src/index.js";

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(express.json({ limit: '150mb' }));
app.use(middleware);
app.use(logRequest);

app.use('/v1', router)

app.listen(PORT, () => {
    console.log(`A mágica acontece na porta: ${PORT}`)
})