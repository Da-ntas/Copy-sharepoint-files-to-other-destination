import { Router } from "express";
import connection from "../../database/index.js";


const logs_router = Router();

logs_router.get('/:id', async (req, res) => {
    const processingId = req.params.id;

    try {
        // Consulta ao banco de dados para buscar logs pelo processing_id
        const query = 'SELECT * FROM logs_execucao WHERE processing_id = ?';
        connection.query(query, [processingId], (error, results) => {
            if (error) {
                return res.status(500).json({
                    message: "Erro ao buscar logs",
                    error: error.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Nenhum log encontrado para o UUID fornecido"
                });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        res.status(400).json({
            message: "Erro ao buscar logs",
            error: error.message
        });
    }
});

export default logs_router;