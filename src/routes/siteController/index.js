import { Router } from "express";
import { validateSchema } from "../../validator.js";
import { siteChildrenSchema, siteInfoSchema, siteItemsSchema, sitePathsSchema, siteSubfolderIdSchema } from "../../schema/sitesSchema.js";
import { api } from "../../api.js";
import { formatPath, getFolderData, getPathOfItemInsideFolder } from "../../helpers/index.js";


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

sitesRouter.post('/subfolder/id', validateSchema(siteSubfolderIdSchema), async (req, res) => {
    try {
        const body = req.body;
        const {data: item} = await api.get(`/v1.0/sites/${body.folderId}/drive/root:/${body.path}`);
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

sitesRouter.post('/subfolder/items', validateSchema(siteItemsSchema), async (req, res) => {
    try {
        const body = req.body;
        const {data: item} = await api.get(`/v1.0/sites/${body.folderId}/drive/items/${body.id}/children`)
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

sitesRouter.post('/subfolder/paths', validateSchema(sitePathsSchema), async (req, res) => {
    try {
        let retorno = [];
        const body = req.body;
        const dataRoot = await getFolderData(body.rootFolderId, body.folderId);

        if(dataRoot && dataRoot.value) {
            retorno = await getPathOfItemInsideFolder(
                dataRoot.value, 
                formatPath(body.pathSubFolderSharepoint), 
                formatPath(body.pathSubFolderDestino),
                null,
                body.rootFolderId
            );
        }

        res.status(200).json(retorno);

    } catch (error) {
        res.status(400).json({
            message: "Erro ao buscar informações do site",
            error: error.message
        })
    }
})

export default sitesRouter;