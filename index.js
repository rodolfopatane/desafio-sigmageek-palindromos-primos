// Tarefa: Encontre o primeiro primo palíndromo de 9 dígitos na expansão decimal do π (3,1415…)

// Regras Você pode usar qualquer linguagem de programação que quiser e deverá submeter também seu código utilizado.

// Solução: O problema não pede o calculo de PI, apenas a identificação do "Primeiro Numero Primo" de 9 digitos que seja um Palíndromo, portanto o uso de PI como uma constante parece dentro das regras.

// Fonte do valor de PI: https://www.piday.org/million/
// A quantidade de decimais carregadas foram 130 mil, mais do que o suficiente

// Estratégia:
// Buscar primeiro palindromo de 9 digitos
// Verificação da condição: numero primo
// Avançar se necessários

const { decimalsPI } = require("./pi");

const decimalsSize = decimalsPI.length;
const chunkSize = 9;

let index = 0;
let eof = false;

const isPalindromo = (chunk) => {
  const limit = Math.floor(chunk.length / 2);
  for (let i = 0; i < limit; i++) {
    if (chunk.charAt(i) !== chunk.charAt(chunk.length - 1 - i)) return false;
  }
  return true;
};

const isPrime = (chunk) => {
  const value = parseInt(chunk);
  for (let i = 2; i < value; i++) if (value % i == 0) return false;
  return true;
};

while (!eof) {
  const chunk = decimalsPI.slice(index, index + chunkSize);
  if (isPalindromo(chunk))
    if (isPrime(chunk)) {
      console.log(`Find: ${chunk}`);
      break;
    }
  eof = index === decimalsSize - chunkSize;
  index += 1;
}
