const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 4000;

// Caminho do arquivo que armazena os dados das ações
const MASTER_FILE = path.join(__dirname, 'master_stock_data.txt');

// Contador de atualizações
let updateCount = 0;
const SYNC_THRESHOLD = 5;  // Número de atualizações necessárias para disparar a sincronização

// API Key do Alpha Vantage (substitua com sua chave de API pessoal)
const ALPHA_VANTAGE_API_KEY = 'ENXUREI44U9FG9BR';

// Função para obter dados financeiros da API
const getStockDataFromAPI = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  try {
    const response = await axios.get(url);
    const timeSeries = response.data['Time Series (5min)'];
    
    if (!timeSeries) {
      console.log('Erro ao obter dados financeiros.');
      return null;
    }
    
    // Pega o último valor disponível
    const latestTime = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestTime];

    const stockPrice = latestData['4. close'];  // Preço de fechamento da última entrada

    return {
      symbol: symbol,
      price: stockPrice,
      timestamp: latestTime
    };
  } catch (error) {
    console.error('Erro ao fazer requisição para a API:', error);
    return null;
  }
};

// Função para salvar os dados no arquivo
const saveStockDataToFile = (data) => {
  const content = `Ação: ${data.symbol} - Preço: $${data.price} - Última Atualização: ${data.timestamp}\n`;
  fs.appendFileSync(MASTER_FILE, content);
  console.log(`Dados salvos: ${content.trim()}`);
};

// Função para atualizar os dados de ações
const updateStockData = async () => {
  updateCount++;
  
  const symbol = 'AAPL';  // Exemplo: Preço da ação da Apple (pode substituir por outros símbolos)
  const stockData = await getStockDataFromAPI(symbol);

  if (stockData) {
    saveStockDataToFile(stockData);
  }

  console.log(`Atualização ${updateCount}: Dados de ${symbol} foram atualizados.`);
  
  // Se atingir o limite de atualizações, sincroniza com a réplica
  if (updateCount >= SYNC_THRESHOLD) {
    console.log(`Número de atualizações atingiu ${SYNC_THRESHOLD}. Sincronizando com a réplica...`);
    updateCount = 0;  // Resetar o contador de atualizações
    // Adicione a lógica para sincronizar com a réplica aqui
  }
};

// Rota para fornecer os dados de preço das ações
app.get('/sync', (req, res) => {
  if (fs.existsSync(MASTER_FILE)) {
    const data = fs.readFileSync(MASTER_FILE, 'utf8');
    res.status(200).send(data);  // Envia os dados do arquivo
  } else {
    res.status(404).send('Dados não encontrados.');
  }
});

// Endpoint para simular a atualização dos preços de ações
app.get('/update', async (req, res) => {
  await updateStockData();  // Atualiza os dados
  res.status(200).send('Dados atualizados!');
});

// Inicia o servidor principal
app.listen(PORT, () => {
  console.log(`Servidor principal rodando na porta ${PORT}`);
});

// Simula atualizações a cada 10 segundos (para exemplo)
setInterval(updateStockData, 10000);  // Atualiza os dados de 10 em 10 segundos
