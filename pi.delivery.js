import { get } from "https";
import { Readable } from "stream";

export function getDigitsfromRemoteYCDFile(url, startBytePosition, bytesLimit) {
  const HEADER_SPLIT = "\0";
  const NO_DIGITS = "3.";
  const WORD_SIZE = 8;

  let bytesFromLastBody = [];
  let totalDownloadesBytes = 0;
  let targetBytes = 0;
  let header;
  let totalChunks = 0;
  let download;

  const readableStream = new Readable({
    read() {},
  });

  const destroy = () => {
    download.abort();
    readableStream.destroy();
  };

  function finishStreaming() {
    readableStream.push(null);
    download.abort();
  }

  function downloadError(error) {
    download.abort();
  }

  const setTargetBytes = (data) => {
    targetBytes = parseInt(data.headers["content-length"]);
    console.log(`Total File ${(targetBytes / 1000000000).toFixed(1)} GB`);
  };

  //Extract Digits From YCD
  let firstChunkOfFile = true;
  function processFile(chunk) {
    if (totalDownloadesBytes >= bytesLimit) {
      return finishStreaming();
    }

    totalChunks += 1;
    totalDownloadesBytes += chunk.length;

    let body;

    if (firstChunkOfFile) {
      firstChunkOfFile = false;
      header = chunk.toString().split(HEADER_SPLIT)[0];
      body = Buffer.from(chunk).slice(header.length + 1);
    } else {
      body = Buffer.from(chunk);
    }

    // agrupa sobra anterior
    bytesFromLastBody.push(body);
    body = Buffer.concat(bytesFromLastBody);
    bytesFromLastBody = [];

    const words = Math.floor(body.byteLength / WORD_SIZE);
    const restOfBytes = body.byteLength - WORD_SIZE * words;

    // salva resto
    if (restOfBytes > 0) {
      bytesFromLastBody.push(body.slice(body.byteLength - restOfBytes));
    }
    // remove resto to body
    body = body.slice(0, WORD_SIZE * words);

    let digits = "";
    for (let i = 0; i < words; i++) {
      const startPosition = i * WORD_SIZE;

      if (startPosition < body.byteLength) {
        const word = body
          .slice(startPosition, startPosition + WORD_SIZE)
          .readBigUint64LE()
          .toString(10)
          .padStart(19, "0");
        digits += word;
      }
    }
    const lastBytePosition = targetBytes - totalDownloadesBytes;
    readableStream.push(
      JSON.stringify({
        lastBytePosition,
        digits,
      })
    );
  }

  download = get(url, (response) => {
    response.on("data", processFile);
  })
    .on("response", setTargetBytes)
    .on("error", downloadError)
    .on("end", finishStreaming)
    .end();

  return {
    start: readableStream,
    destroy,
  };
}
