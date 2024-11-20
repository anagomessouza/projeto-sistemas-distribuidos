const axios = require('axios');
const fs = require('fs');

const SERVER_URL = 'http://localhost:3000';

// Baixa um arquivo do servidor
async function downloadFile(endpoint, saveAs) {
    const response = await axios.get(`${SERVER_URL}/${endpoint}`, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(saveAs));

    console.log(`${saveAs} baixado com sucesso.`);
}

// Baixa as versões consistente e desatualizada
async function main() {
    await downloadFile('consistent', 'consistent_stock_data.txt');
    await downloadFile('inconsistent', 'inconsistent_stock_data.txt');
}

main();
