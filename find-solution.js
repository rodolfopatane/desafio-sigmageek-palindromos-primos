import { findFirstPalindromePrimeNumber } from "./prime.palindrome.identifier.js";
import { getDigitsfromRemoteYCDFile } from "./pi.delivery.js";
import { createWriteStream, existsSync, mkdir, mkdirSync } from "fs";

let lastUpdate = 0;
const url = process.argv[2];
const chunkSize = parseInt(process.argv[3]);
const pid = parseInt(process.argv[4]);
const START = new Date();

if (!existsSync("./log")) mkdirSync("./log");
const fileLog = createWriteStream(`./log/${pid}.log`);

fileLog.write(`FILE: ${url}\n\n`);
fileLog.write(`start: ${START.toLocaleString()}\n\n`);

const updateStatus = (status) => {
  if (status.solution) {
    const fileSolution = createWriteStream(`./log/${pid}.solution`);
    fileSolution.write(`${JSON.stringify(status)}\n`);
    const END = new Date();
    fileLog.write(`\nend: ${END.toLocaleString()}\n`);
    return;
  }

  lastUpdate += 1;
  if (lastUpdate > 10000) {
    lastUpdate = 0;
    fileLog.write(`${JSON.stringify(status)}\n`);
    console.log(
      `Total processed digits : ${(
        status.lastCheckedPosition / 1000000000
      ).toFixed(3)} bi`
    );
  }
};

const findSolution = async (digitsReader, targetSize) => {
  return new Promise((resolve, reject) => {
    let lastChunkSizeNoVefiried = "";
    let lastCheckedPosition = 0;
    digitsReader.start
      .on("data", async (chunk) => {
        const digits = lastChunkSizeNoVefiried + JSON.parse(chunk).digits;
        lastChunkSizeNoVefiried = digits.slice(digits.length - targetSize);
        const res = await findFirstPalindromePrimeNumber(digits, targetSize);
        if (res.solution) {
          digitsReader.destroy();
          const result = {
            lastCheckedPosition: lastCheckedPosition + res.lastCheckedPosition,
            solution: res.solution,
          };
          updateStatus(result);
          resolve(result);
          return;
        }

        lastCheckedPosition += digits.length - targetSize;
        updateStatus({
          lastCheckedPosition,
        });
      })
      .on("close", () => {
        console.log("streaming close");
        resolve();
      })
      .on("error", (error) => {
        reject(error);
        console.log("streaming error");
        console.log(error);
      });
  });
};
const res = await findSolution(getDigitsfromRemoteYCDFile(url, 0), chunkSize);
console.log(res);
