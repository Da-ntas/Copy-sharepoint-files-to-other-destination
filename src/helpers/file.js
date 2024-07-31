import fs from "fs"
// Função para fazer a requisição e salvar o arquivo
export async function downloadFile(response, filePath) {
    try {
      if (response.data.pipe) {
        filePath = filePath.replaceAll("\\", "/")
        response.data.pipe(fs.createWriteStream(filePath))
          .on('finish', () => {
            console.log(`Arquivo salvo em: ${filePath}`);
            return true;
          })
          .on('error', (error) => {
            console.error('Erro ao salvar o arquivo', error);
            return false;
          });
        return true;
      } else {
        console.error('A resposta não é um stream de dados.');
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição', error);
      return false;
    }
}