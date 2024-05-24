import axios from "axios";
import { existsSync, mkdirSync, writeFileSync } from "fs";

const token = `eyJ0eXAiOiJKV1QiLCJub25jZSI6Imh1UDA2cTlSa3dTSkhGV09NVHZLWXNmU1JEWWhWRUZPTWZkb2JNdVBibkkiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xMWExZDQ0ZS1hOTgyLTQ2M2MtYTllYy02ZDhiN2M5OGZlYTcvIiwiaWF0IjoxNzE2NTU2NTI1LCJuYmYiOjE3MTY1NTY1MjUsImV4cCI6MTcxNjU2MDc3NiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhXQUFBQW84bXd2azY4SGpDNnhlcGQ4RWR2Y3d5eHAyamxSZGhGbzhXdVFCRldqdG1OZVFudXF1Z0ExR2NRSWd3SDZzYlNmWW1xVFR4UWU4cHAyNzVSeW9FTU1FMG83MHBTU2FOREI2M1JwQVo1bERJPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiU2hhcmVwb2ludC1QaXBlZHJlYW0iLCJhcHBpZCI6IjE3YTZmNzcxLTUwOTEtNGE4Yi04NTY5LTRiNWViZTY2NzRkNiIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiRmVybmFuZGVzIiwiZ2l2ZW5fbmFtZSI6Ikh1Z28iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiI0NS4xNjQuNjkuMjQwIiwibmFtZSI6Ikh1Z28gRmVybmFuZGVzIiwib2lkIjoiMGNlYTkwMzQtZTkyNi00ZGYwLThjYzAtZjllZDNiOWEwYWVjIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTI0MjcxMTExNjYtNDA5OTAxNzk0MC0xMDc5MzQ2NjMxLTIxMjgiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDExREI4NUMzRCIsInJoIjoiMC5BVmtBVHRTaEVZS3BQRWFwN0cyTGZKai1wd01BQUFBQUFBQUF3QUFBQUFBQUFBQlpBUFkuIiwic2NwIjoiU2l0ZXMuUmVhZC5BbGwgVXNlci5SZWFkIHByb2ZpbGUgb3BlbmlkIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiMHI5aUU0dlpfMS1DOHdKYVUtRlNaV1lObllvZzBKZ184QURNRnFsMjZoTSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJTQSIsInRpZCI6IjExYTFkNDRlLWE5ODItNDYzYy1hOWVjLTZkOGI3Yzk4ZmVhNyIsInVuaXF1ZV9uYW1lIjoiaHVnby5mZXJuYW5kZXNAYnRidGVsZWNvbS5jb20uYnIiLCJ1cG4iOiJodWdvLmZlcm5hbmRlc0BidGJ0ZWxlY29tLmNvbS5iciIsInV0aSI6ImtSM2tSaW1mbzBtVkhUb2lHYXRzQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjg4ZDhlM2UzLThmNTUtNGExZS05NTNhLTliOTg5OGI4ODc2YiIsImYyZWY5OTJjLTNhZmItNDZiOS1iN2NmLWExMjZlZTc0YzQ1MSIsIjcyOTgyN2UzLTljMTQtNDlmNy1iYjFiLTk2MDhmMTU2YmJiOCIsImYwMjNmZDgxLWE2MzctNGI1Ni05NWZkLTc5MWFjMDIyNjAzMyIsImYyOGExZjUwLWY2ZTctNDU3MS04MThiLTZhMTJmMmFmNmI2YyIsIjI5MjMyY2RmLTkzMjMtNDJmZC1hZGUyLTFkMDk3YWYzZTRkZSIsIjY5MDkxMjQ2LTIwZTgtNGE1Ni1hYTRkLTA2NjA3NWIyYTdhOCIsIjkzNjBmZWI1LWY0MTgtNGJhYS04MTc1LWUyYTAwYmFjNDMwMSIsImZlOTMwYmU3LTVlNjItNDdkYi05MWFmLTk4YzNhNDlhMzhiMSIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoibm9jblRSQnpYNnB5YWZHV2xlRE5Hb3VBMjJsVEtwd0F4R1I1UndEODc3TSJ9LCJ4bXNfdGNkdCI6MTQ4Nzk2NjYwNn0.XDcp4SmesTHtf1McOX5rkIFsLaCggMQyqLlFlo4y_HvA6T7ayY9yfmdlF5YyN-afcglqXD-Cob3Xns82YQfxJjY89S8AaTtumCCXr5BmyRs6Y60UqAomf1okXWxC4AafywNcZ2584Zpfn2Hk5QDMaLJC8F04DeAVbodZ3MgI1LJtSURsaXkKj-I4sAM_MdxFzC-9tFGDdaGDz6NB4lU8B6Tjrskz7HT8HL07W7GutYnOWafS_jbsCqVo6MTdwIH3UVW5pieXLZDEm5yuSKTxmDnTxpkC7DNQYjwzerzV99imt7vE_EeAWG-SB_FTShzUlmCAiyBhD2X6vq-EteZ8Ig`

const arrErros = [];

const arrItem = [
    {
      "id": "01CIVHXQLKF63HHZNTPFL3XSTFROCLVTMJ",
      "pathId": "%2FShared+Documents%2FContas+Operadora%2FAllergan+Produtos+Farmaceuticos+Ltda%2FAnos+anteriores%2F2017%2F11.2017%2FM%C3%B3vel%2FVivo%2F0316031638.pdf",
      "path": "Contas Operadora/Teste script/Anos anteriores/2017/11.2017/Móvel/Teste",
      "name": "0316031638.pdf"
    },
]

async function fetchFileContent(file, token) {
    const url = `https://graph.microsoft.com/v1.0/sites/btbtelecom.sharepoint.com,603c733f-1f43-44f7-866c-89bc93e1dd08,6ebbcea4-24a5-4b07-9a92-493205a213a4/drive/items/${file.id}/content`

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
                writeFileSync(`./sharepoint_graph/erros/erro_1.json`, JSON.stringify(arrErros))
            }
        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
        }
    }
}

processFiles(arrItem);
