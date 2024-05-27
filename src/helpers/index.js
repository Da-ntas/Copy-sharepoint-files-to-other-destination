import { api } from '../api.js';

async function getFileContent(fileId, fileName) {
    try {
        const response = await api.get(`/v1.0/sites/drive/items/${fileId}/content`, {
            headers: {
                'Accept': 'application/json;odata=verbose'
            },
            responseType: 'arraybuffer'  // To handle binary data
        });
        return response.data;

    } catch (error) {
        console.error(`Failed to fetch content for file ${fileName}:`, error);
        return error;
    }
}