## Desafio SigmaGeek

Link do desafio:
https://sigmageek.com/challenge/find-large-palindromic-prime-numbers-in-the-decimal-expansion-of-%CF%80-31415%E2%80%A6-1656603146901x235034290182684670

## Tarefa:

    Encontre o primeiro primo palíndromo de 21 dígitos na expansão decimal do π (3,1415…)

**Dica:** Talvez você queira usar a fonte https://pi.delivery/ para usar o maior cálculo do π com 100 trilhões de dígitos.

#

## Regras:

Você pode usar qualquer linguagem de programação que quiser e deverá submeter também seu código utilizado.

#

## Estratégia utilizada:

    1 - Executar multiplos processos simultaneos para varrer varios arquivos ao mesmo tempo
    2 - Executar processamento do arquivo .ydc (y-cruncher) em tempo real conforme chegam.
        2.1 - Determinando o inicio do body
        2.2 - Ler maior trecho multiplo de 8 bytes do chunk
        2.3 - armazenar bytes restantes para concatenar com próximo chunk
        2.4 - fazendo a desconpactação dos dados recebidos.
    3 - processar chunk em busca de palindromos de 21 digitos.
    4 - validar se palindromo encontrado é primo.
    5 - se falhar avançar.

#

## Solução:

Para executar o codígo e encontrar a solução use:

    npm start

**Primeiro Palíndromo Primo:** 151978145606541879151

**Localização:** 140672630233

#

## Limitações

1 - Os ultimos 20 digitos de cada arquivo não estão sendo processados.

2 - Não há gestão de processos para interromper tarefas desnecessárias após encontrar o Target

3 - Não é possivel continuar o download em caso de queda de internet ou morte do processo.

4 - Não é possível fazer busca em paralelo em pedaços do mesmo arquivo.

5 - Cálculo de númros primos bloqueia a thread em questão

#

## Como verificar:

https://api.pi.delivery/v1/pi?start=140672630233&numberOfDigits=21&radix=10

#

## Fonte do valor de PI:

https://pi.delivery/

https://storage.googleapis.com/pi100t/index.html

#

## Referências utilizadas:

Referencia em c++ para leitura e descompactação de .ycd

https://github.com/Mysticial/DigitViewer

```
Compressed File Format:

To date, I've been too lazy to write a document on the compression format and how the .ycd files are laid out.
But it should be pretty easy to see from just examining it through a hex viewer.

Two things that might be useful:

Base 16 .ycd files are stored as 64-bit integers words with 16 digits per word.
Base 10 .ycd files are stored as 64-bit integers words with 19 digits per word.
In both cases, each 8-byte word is little-endian.

```
