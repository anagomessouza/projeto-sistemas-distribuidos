const axios = require('axios');
const fs = require('fs');

const MASTER_URL = 'http://localhost:3000/consistent';
const REPLICA_URL = 'http://localhost:4000/inconsistent';

// Baixa um arquivo de um servidor
async function downloadFile(url, saveAs) {
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(saveAs));
    console.log(`${saveAs} baixado com sucesso.`);
}

// Faz o download das versões consistente e desatualizada
async function main() {
    await downloadFile(MASTER_URL, 'consistent_stock_data.txt'); // Arquivo do servidor principal
    await downloadFile(REPLICA_URL, 'inconsistent_stock_data.txt'); // Arquivo da réplica
}

main();
