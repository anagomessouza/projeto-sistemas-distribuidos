const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors('http://localhost:5500'));
const PORT = 3001;

const filePath = path.join(__dirname, 'dataReplica.txt');

app.use(express.json());

app.get('/', (req, res) => {
  res.download(filePath, 'dataReplica.txt', (err) => {
    if (err) {
      console.error('Erro ao enviar o arquivo:', err);
      res.status(500).send('Erro ao enviar o arquivo.');
    }
  });
});

app.post('/atualizarArquivo', (req, res) => {
  const { fileContent } = req.body;

  if (fileContent) {
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error('Erro ao salvar o arquivo:', err);
        return res.status(500).send('Erro ao salvar o arquivo.');
      }

      console.log('Arquivo salvo com sucesso em:', filePath);
      res.status(200).send('Arquivo recebido e salvo com sucesso!');
    });
  } else {
    res.status(400).send('Conteúdo do arquivo não encontrado!');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando na porta ${PORT}`);
});