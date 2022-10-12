const bigIntSqrt = (value, k = 2n) => {
  let o = 0;
  let x = value;
  let limit = 100;
  while (x ** k !== k && x !== o && --limit) {
    o = x;
    x = ((k - 1n) * x + value / x ** (k - 1n)) / k;
  }
  return x;
};

const isPalindromo = (chunk) => {
  const limit = Math.floor(chunk.length / 2);
  for (let i = 0; i < limit; i++) {
    if (chunk.charAt(i) !== chunk.charAt(chunk.length - 1 - i)) return false;
  }
  console.log(`Palindrome: ${chunk}`);
  return true;
};

const isPrime = (chunk) => {
  if (chunk.length > 15) {
    const value = BigInt(chunk);
    const sqrt = bigIntSqrt(value);
    for (let i = 2n; i < sqrt; i++) if (value % i == 0n) return false;
    console.log(`Big Palindrome Prime: ${chunk}`);
    return true;
  }

  const value = parseInt(chunk);
  const sqrt = Math.sqrt(value);
  for (let i = 2; i < sqrt; i++) if (value % i == 0) return false;
  console.log(`Palindrome Prime: ${chunk}`);
  return true;
};

const findFirstPalindromePrimeNumber = (decimalsPI, chunkSize) => {
  return new Promise(async (resolve) => {
    const bufferSize = decimalsPI.length;
    let lastCheckedPosition = 0;
    let eof = false;
    let solution;

    while (!eof) {
      const chunk = decimalsPI.slice(
        lastCheckedPosition,
        lastCheckedPosition + chunkSize
      );
      if (!(chunk.length < chunkSize))
        if (isPalindromo(chunk))
          if (isPrime(chunk)) {
            solution = chunk;
            break;
          }

      eof = lastCheckedPosition === bufferSize - chunkSize - 1;
      lastCheckedPosition += 1;
    }
    resolve({
      lastCheckedPosition,
      solution,
    });
  });
};

export { findFirstPalindromePrimeNumber };
