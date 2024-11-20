const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Caminho do arquivo
const MASTER_FILE = path.join(__dirname, 'master_stock_data.txt');

// Configuração de sincronização
let updateCount = 0;
const SYNC_THRESHOLD = 5; // Número de atualizações para sincronizar com a réplica
const REPLICA_SERVER_URL = 'http://localhost:4000/sync'; // URL do Servidor de Réplica

// Atualiza os preços
app.post('/update', (req, res) => {
    const newPrice = `AAPL, ${Math.random() * 1000}\n`; // Preço simulado
    fs.appendFileSync(MASTER_FILE, newPrice, 'utf-8');
    updateCount++;

    console.log(`Atualização realizada. Contador: ${updateCount}`);

    // Verifica se é hora de sincronizar com a réplica
    if (updateCount >= SYNC_THRESHOLD) {
        axios.post(REPLICA_SERVER_URL, { data: fs.readFileSync(MASTER_FILE, 'utf-8') })
            .then(() => {
                console.log('Réplica sincronizada!');
                updateCount = 0; // Reseta o contador
            })
            .catch(err => console.error(`Erro ao sincronizar com a réplica: ${err.message}`));
    }

    res.json({ message: 'Preço atualizado no servidor principal.' });
});

// Retorna a versão consistente
app.get('/consistent', (req, res) => {
    res.download(MASTER_FILE, 'master_stock_data.txt');
});

// Inicia o servidor principal
app.listen(PORT, () => {
    console.log(`Servidor Principal rodando na porta ${PORT}`);
});
