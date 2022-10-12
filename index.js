//
// Author: Rodolfo Patané (rodolfo@patane.dev)
//

import { spawn } from "child_process";

const START_CHILD = 1;
const END_CHILD = 2;
const TARGET_SIZE = 21; // target

// map all files .ycd of Google 100 trillions PI digits
const ycdFileList = [];
for (let i = 0; i < 1000; i++) {
  ycdFileList.push(
    `https://storage.googleapis.com/pi100t/Pi%20-%20Dec%20-%20Chudnovsky/Pi%20-%20Dec%20-%20Chudnovsky%20-%20${i}.ycd`
  );
}

const childList = [];
let lastPid = 0;
let activeChild = 0;

const createChild = (chunkSize, pid) => {
  const child = spawn(process.argv[0], [
    "find-solution.js",
    ycdFileList[pid],
    chunkSize,
    pid,
  ])
    .stdout.on("data", (stdout) => {
      console.log(`${pid}: ${stdout.toString()}`);
    })
    .on("error", (error) => {
      console.log(`${pid}: ${error}`);
    })
    .on("exit", (code, signal) => {
      console.log(`${pid}: exit code ${code} signal ${signal}`);
      childList[pid].status = "DEAD";
      activeChild -= 1;
    });
  return {
    subprocess: child,
    pid,
    status: "ACTIVE",
  };
};

const startChild = (chunkSize, pid) => {
  childList.push(createChild(chunkSize, pid));
  activeChild += 1;
  console.log(`New thread PID: ${pid}`);
};

const startCrawler = async () => {
  for (let pid = START_CHILD; pid < END_CHILD; pid++) {
    lastPid = pid;
    startChild(TARGET_SIZE, pid);
    await new Promise((res) => setTimeout(res, 1000)); // prevent crash on start many childs
  }
};

startCrawler();
