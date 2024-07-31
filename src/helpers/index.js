import { api } from "../api.js";
import {promises as fs} from "fs";
import path from 'path';
import { downloadFile } from "./file.js";

function formatPathId(path) {
    // Divide o caminho em partes usando o separador '/'
    return encodeURIComponent(`/Shared Documents/${path}`).replace(/%20/g, '+');
}

export async function getFileContent(folderId, fileId) {
    try {
        const response = await api.get(`/v1.0/sites/${folderId}/drive/items/${fileId}/content`, {
            responseType: 'stream'
        });
        if(response) {
            return response;
        }
    } catch (error) {
        console.log(error?.response?.data ?? error?.data ?? error)
    }
}

export async function getFolderData(folderId, id) {
    try {
        const {data: response} = await api.get(`/v1.0/sites/${folderId}/drive/items/${id}/children`)
        if(response) {
            return response;
        }
    }
    catch(error) {
        // console.log('getFolderData')
        // console.log(error?.response?.data ?? error?.data ?? error)
    }
}

export async function getFolderId(folderId, path) {
    try {
        const {data: response} = await api.get(`/v1.0/sites/${folderId}/drive/root:/${path}`);

        if(response) {
            return response["id"]
        }
    } catch (error) {
        // console.log('getFolderId')
        // console.log(error?.response?.data ?? error?.data ?? error)
    }
}

// recursiva
export async function getPathOfItemInsideFolder(arrV, prevUrl, prevShareFolder, prevId, rootId) {
    if(!arrV && !Array.isArray(arrV)){
        return {
            id: prevId,
            path: prevUrl
        }
    }

    const rv = [];
    for(const item of arrV) {
        let name = item["name"] ?? item['Name'] ?? "";
        let flagIsFolder = item["IsFolder"] || (item["folder"] && Object.keys(item['folder']).length > 0);
        
        let fullPathNew = `${prevUrl}/${name}`;
        let pathFileToSave =  `${prevShareFolder}`;

        let obj = {};
        
        if(flagIsFolder) {
            pathFileToSave = `${pathFileToSave}/${name}`;
            const id = await getFolderId(rootId, fullPathNew);
            const data = await getFolderData(rootId, id);
            obj = await getPathOfItemInsideFolder(data?.value, fullPathNew, pathFileToSave, (item["id"] ?? item["Id"]), rootId);
        } else {
            obj = {
                id: item["Id"] ?? item["id"],
                pathId: formatPathId(fullPathNew),
                path: pathFileToSave,
                name: item["name"] ?? item["Name"]
            }
        }

        rv.push(obj);
    }

    return rv.flat();
}
export function formatPath(path = "") {
    return path.startsWith("/") ? path.slice(1) : path;
}


export async function writeFile(response, fileName, destiny) {
    try {
        // Junta o caminho de destino e o nome do arquivo
        const filePath = path.join(destiny, fileName);

        // Extrai o diretório do caminho completo do arquivo
        const dir = path.dirname(filePath);

        // Cria os diretórios necessários, se não existirem
        await fs.mkdir(dir, { recursive: true });

        // Verifique se response.data é realmente um stream
        return downloadFile(response, filePath);
    } catch (err) {
        console.error(`Erro ao criar o arquivo: ${err.message}`);
        return null;
    }
}