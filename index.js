import axios from "axios";
import { existsSync, mkdirSync, writeFileSync } from "fs";

const token = ``

const arrErros = [];

const arrItem = []

async function fetchFileContent(file, token) {
    const url = `https://graph.microsoft.com/v1.0/sites//drive/items/${file.id}/content`

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json;odata=verbose'
            },
            responseType: 'arraybuffer'  // To handle binary data
        });
        return response.data;

    } catch (error) {
        console.error(`Failed to fetch content for file ${file.name}:`, error);
        throw error;
    }
}

function saveFileContent(file, content) {
    console.log(`criando arquivo: ${file.name}`)
    try {

        if (!existsSync(`N:/${file.path}`)){
            mkdirSync(`N:/${file.path}`, { recursive: true });
            console.log(`Directory N:/${file.path} created successfully.`);
        }

        writeFileSync(`N:/${file.path}/${file.name}`, content, function(err) {
            if(err) {
                return console.log(err)
            }
            console.log(`arquivo criado! - ${file.name}`)
        });
        console.log(`arquivo criado: ${file.name}`)
    } catch (error) {
        console.log(error)
        console.log(`erro ao criar arquivo: ${file.name}`);
        arrErros.push(file);
    }
}

async function processFiles(files, obj) {
    for (const file of files) {
        try {
            const content = await fetchFileContent(file, token);
            saveFileContent(file, content);
            if(arrErros.length > 0) {
                writeFileSync(`./erros/erro_1.json`, JSON.stringify(arrErros))
            }
        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
        }
    }
}

processFiles(arrItem);
