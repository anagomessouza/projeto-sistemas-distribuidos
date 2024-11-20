const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuração da URL do servidor principal
const SERVER_URL = 'http://127.0.0.1:3000/sync'; // Altere para 127.0.0.1 caso o problema seja com o localhost

// Caminho para o arquivo de dados da réplica
const REPLICA_FILE = path.join(__dirname, 'replica_stock_data.txt');

// Função para sincronizar os dados da réplica com o servidor principal
const syncWithMasterServer = async () => {
    try {
        // Fazendo a requisição para o servidor principal
        const response = await axios.get(SERVER_URL);
        
        // Verificando a resposta do servidor principal
        if (response.status === 200) {
            console.log('Dados recebidos do servidor principal.');

            // Salvando os dados recebidos no arquivo da réplica
            fs.writeFileSync(REPLICA_FILE, response.data);
            console.log('Dados sincronizados e salvos na réplica.');
        } else {
            console.log('Erro ao obter dados do servidor principal: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro ao tentar sincronizar com o servidor principal:', error.message);
    }
};

// Função para verificar se os dados da réplica estão atualizados
const checkReplicaData = () => {
    if (fs.existsSync(REPLICA_FILE)) {
        const data = fs.readFileSync(REPLICA_FILE, 'utf8');
        console.log('Dados da réplica:', data);
    } else {
        console.log('Arquivo da réplica não encontrado. Iniciando sincronização...');
        syncWithMasterServer();
    }
};

// Chama a função para verificar e sincronizar os dados
checkReplicaData();
