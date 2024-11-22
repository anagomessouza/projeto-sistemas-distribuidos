const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname,'data.txt');

function atualizarPrecos() {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      Object.keys(jsonData).forEach((acao) => {
        const precoAtual = parseFloat(jsonData[acao].preco.replace(',', '.'));

        const variacao = (Math.random() * 10 - 5).toFixed(2);
        let novoPreco = precoAtual + parseFloat(variacao);

        novoPreco = Math.max(0, novoPreco);

        jsonData[acao].preco = novoPreco.toFixed(2).replace('.', ',');
      });

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Erro ao escrever no arquivo:', writeErr);
        } else {
          console.log('Preços atualizados:', jsonData);
        }
      });
    } catch (parseErr) {
      console.error('Erro ao analisar o JSON:', parseErr);
    }
  });
}
module.exports = atualizarPrecos;