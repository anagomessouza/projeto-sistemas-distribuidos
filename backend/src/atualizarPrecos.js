const fs = require('fs');
const path = require('path');

// Caminho para o arquivo data.txt
const filePath = path.join(__dirname,'data.txt');

// Função para atualizar o preço

// Função para atualizar os preços
function atualizarPrecos() {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    try {
      // Converte o conteúdo do arquivo em JSON
      const jsonData = JSON.parse(data);

      // Itera sobre as ações e atualiza os preços
      Object.keys(jsonData).forEach((acao) => {
        const precoAtual = parseFloat(jsonData[acao].preco.replace(',', '.'));

        // Gera uma variação de preço entre -5 e +5
        const variacao = (Math.random() * 10 - 5).toFixed(2);
        let novoPreco = precoAtual + parseFloat(variacao);

        // Garante que o preço não seja negativo
        novoPreco = Math.max(0, novoPreco);

        // Atualiza o preço da ação
        jsonData[acao].preco = novoPreco.toFixed(2).replace('.', ',');
      });

      console.log(jsonData);

      // Escreve o JSON atualizado de volta no arquivo
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