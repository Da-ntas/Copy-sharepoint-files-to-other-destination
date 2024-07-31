import { Router } from "express";
import { getFileContent, writeFile } from "../../helpers/index.js";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";
import connection from "../../database/index.js";


const moveRouter = Router();

const itemSchema = Joi.object({
    id: Joi.string().required(),
    pathId: Joi.string().required(),
    path: Joi.string().required(),
    name: Joi.string().required(),
})

moveRouter.post('/list', async (req, res) => {
    try {
        const { list, folderId, letterPath } = req.body;

        if (!list || !folderId) {
            return res.status(400).json({ message: "Propriedades faltantes" });
        }

        const processingId = uuidv4();
        let flagErroInicial = false;

        for (let item of list) {
            const query = 'INSERT INTO logs_execucao (processing_id, item_id, item_name, item_path, status) VALUES (?, ?, ?, ?, ?)';
            const values = [processingId, item.id, item.name, item.path, 'processando'];
            connection.query(query, values, (err, results) => {
                if (err) {
                    console.error('Erro ao inserir log inicial:', err);
                    flagErroInicial = true;
                }
            });
        }

        if(!flagErroInicial) {
            res.status(200).json({
                message: 'Processamento em andamento! Para validar o andamento, valide a tabela logs_execucao',
                logs_id: processingId
            });
        }
        else {
            return res.status(400).json({
                message: "erro ao criar registros na base, favor tentar novamente"
            })
        }

        // Processar os itens e atualizar o status na tabela de logs
        for (let item of list.slice(0, 50)) {
            const { error, value } = itemSchema.validate(item);
            let status = 'sucesso';
            let errorMessage = '';

            if (!error) {
                try {
                    const fileContent = await getFileContent(folderId, value.id);
                    if (fileContent) {
                        const retBuidlFile = await writeFile(fileContent, value.name, `${letterPath}/${value.path}`);
                        if (!retBuidlFile) {
                            status = 'erro';
                            errorMessage = 'Falha ao escrever o arquivo';
                        }
                    } else {
                        status = 'erro';
                        errorMessage = 'Falha ao obter o conteúdo do arquivo';
                    }
                } catch (err) {
                    status = 'erro';
                    errorMessage = err.message;
                }
            } else {
                status = 'erro';
                errorMessage = 'Erro de validação';
            }

            // Atualizar o log no banco de dados com o status final
            const updateQuery = 'UPDATE logs_execucao SET status = ?, error_message = ? WHERE processing_id = ? AND item_id = ?';
            const updateValues = [status, errorMessage, processingId, value.id];
            connection.query(updateQuery, updateValues, (err, results) => {
                if (err) {
                    console.error('Erro ao atualizar log:', err);
                }
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "Erro ao buscar informações do site",
            error: error.message
        })
    }
})

export default moveRouter;