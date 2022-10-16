import {
  createSpyRPCServiceClient,
  subscribeSignedVAA,
} from "@certusone/wormhole-spydk";

import {
  importCoreWasm,
  parseTransferPayload,
  setDefaultWasm,
} from "@certusone/wormhole-sdk";

import http from "http";
import Queue from "./queue.js";

import express from "express";
import cors from "cors";
const app = express();

setDefaultWasm("node");

const { parse_vaa } = await importCoreWasm();
const client = createSpyRPCServiceClient("143.198.69.169:7073");
const stream = await subscribeSignedVAA(client, {});

/* Global VAA signer count sliding window */
var hist = new Queue();

/* Global VAA signer count */
var data = [];
for (let i = 0; i < 19; i++) {
  data.push(0);
}

/* Update VAA signer counts */
const updateCounts = (signatures) => {
  let curr = [];
  for (let i = 0; i < 19; i++) {
    curr.push(0);
  }

  signatures.forEach((obj) => {
    curr[obj.guardian_index] = 1;
    data[obj.guardian_index] += 1;
  });

  if (hist.length < 1000) {
    hist.enqueue([...curr]);
  } else {
    hist.enqueue([...curr]);
    let old = hist.dequeue();
    for (let i = 0; i < 19; i++) {
      data[i] -= old[i];
    }
  }
};

stream.addListener("data", ({ vaaBytes }) => {
  const parsedVAA = parse_vaa(vaaBytes);
  updateCounts(parsedVAA.signatures);
  console.log(data);

  //const payloadBuffer = Buffer.from(parsedVAA.payload);
  //const transferPayload = parseTransferPayload(payloadBuffer);
  //console.log(transferPayload);
});

// http
//   .createServer(function (req, res) {
//     console.log("responded to a request");
//     res.writeHead(200, {
//       "Content-Type": "application/json",
//       "Access-Control-Allow-Origin": "*" /* @dev First, read about security */,
//       "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
//       "Access-Control-Max-Age": 2592000, // 30 days
//     });
//     const dataResponse = JSON.stringify(data);
//     res.end(dataResponse);
//   })
//   .listen(9615);
// stream.addListener("error", (error) => {
//   console.log(error);
// });
app.use(cors());
app.get("/api", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.json(data);
});

const server = app.listen(80);
