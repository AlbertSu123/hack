import {
  createSpyRPCServiceClient,
  subscribeSignedVAA,
} from "@certusone/wormhole-spydk";

import {
  importCoreWasm,
  parseTransferPayload,
  setDefaultWasm,
} from "@certusone/wormhole-sdk";

setDefaultWasm("node");

const { parse_vaa } = await importCoreWasm();
const client = createSpyRPCServiceClient("143.198.69.169:7073");
const stream = await subscribeSignedVAA(client, {});
import http from "http";

var data = [];
for (let i = 0; i < 19; i++) {
  data.push(0);
}
var counter = 0;
stream.addListener("data", ({ vaaBytes }) => {
  const parsedVAA = parse_vaa(vaaBytes);

  parsedVAA.signatures.forEach((obj) => {
    counter += 1;
    data[obj.guardian_index] += 1;
  });
  //console.log(parsedVAA.signatures.length);
  console.log(data);
  if (counter >= 1000000) {
    data = data.map((x) => 0);
    counter = 0;
  }

  //const payloadBuffer = Buffer.from(parsedVAA.payload);
  //const transferPayload = parseTransferPayload(payloadBuffer);
  //console.log(transferPayload);
});

http
  .createServer(function (req, res) {
    console.log("responded to a request");
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" /* @dev First, read about security */,
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      "Access-Control-Max-Age": 2592000, // 30 days
    });
    const dataResponse = JSON.stringify(data);
    res.end(dataResponse);
  })
  .listen(9615);
stream.addListener("error", (error) => {
  console.log(error);
});
