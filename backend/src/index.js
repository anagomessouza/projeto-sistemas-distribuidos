const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs')
const atualizarPrecos = require('./atualizarPrecos');

const app = express();
const PORT =  3000;
const filePath = path.join(__dirname, 'data.txt');
let updateCount = 0;

function atualizarPrecosEEnviar() {
  atualizarPrecos(); // Atualiza os preços no arquivo
  updateCount++; // Incrementa o contador

  // Verifica se já realizou 10 atualizações
  if (updateCount >= 10) {
    enviarArquivoAutomatico(); // Envia o arquivo automaticamente
    updateCount = 0; // Reseta o contador
  }
}

// Função para enviar o arquivo para a API automaticamente
async function enviarArquivoAutomatico() {
  try {
    const fileData = fs.readFileSync(filePath, 'utf8'); // Lê o conteúdo do arquivo
    const response = await axios.post('http://localhost:3001/atualizarArquivo', { 
      fileContent: fileData, 
    });

    console.log('Arquivo enviado com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao enviar o arquivo automaticamente:', error.message);
  }
}

app.get('/', (req, res) => {
  
  
  // Envia o arquivo para o usuário
  res.download(filePath, 'data.txt', (err) => {
    if (err) {
      console.error('Erro ao enviar o arquivo:', err);
      res.status(500).send('Erro ao enviar o arquivo.');
    }
  });
});

app.listen(PORT, ()=> {console.log(`Servidor funcionando na porta ${PORT}`)} );

setInterval(atualizarPrecosEEnviar, 2000);