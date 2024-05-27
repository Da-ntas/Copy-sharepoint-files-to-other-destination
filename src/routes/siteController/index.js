import { Router } from "express";
import { validateSchema } from "../../validator.js";
import { siteChildrenSchema, siteInfoSchema } from "../../schema/sitesSchema.js";
import { api } from "../../api.js";


const sitesRouter = Router();

sitesRouter.post('/info', validateSchema(siteInfoSchema), async (req, res) => {
    try {
        const body = req.body;
        const {data: item} = await api.get(`/v1.0/sites/${body.tenant}:/sites/${body.name}`);

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

sitesRouter.post('/root', validateSchema(siteChildrenSchema), async (req, res) => {
    try {
        const body = req.body;
        const {data: item} = await api.get(`/v1.0/sites/${body.id}/drive/root`);
        
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


export default sitesRouter;