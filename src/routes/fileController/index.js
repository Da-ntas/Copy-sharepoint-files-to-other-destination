import { Router } from "express";
import { siteFileContentSchema } from "../../schema/sitesSchema.js";
import { validateSchema } from "../../validator.js";
import { api } from "../../api.js";

const filesRouter = Router();

filesRouter.post('/content', validateSchema(siteFileContentSchema), async (req, res) => {
    try {
        const body = req.body;
        const {data: item} = await api.get(`/v1.0/sites/${body.folderId}/drive/items/${body.fileId}/content`);
        if(item) {
            res.status(200).json(item);
        }
    } catch (error) {
        res.status(400).json({
            message: "Erro ao buscar informações do site",
            error: error.message
        })
    }
})

export default filesRouter;