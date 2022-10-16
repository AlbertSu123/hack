import {
  createSpyRPCServiceClient,
  subscribeSignedVAA,
} from "@certusone/wormhole-spydk";

import {
  importCoreWasm,
  parseTransferPayload,
  setDefaultWasm,
} from "@certusone/wormhole-sdk";

import http from 'http';

class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}

setDefaultWasm("node");

const { parse_vaa } = await importCoreWasm();
const client = createSpyRPCServiceClient("143.198.69.169:7073");
const stream = await subscribeSignedVAA(client, {});


var hist = new Queue();

var data = [];
for (let i = 0; i < 19; i++) {
  data.push(0);
}

stream.addListener("data", ({ vaaBytes }) => {
  const parsedVAA = parse_vaa(vaaBytes);

  let curr = [];
  for (let i = 0; i < 19; i++) {
    curr.push(0);
  }

  parsedVAA.signatures.forEach(obj=> {
    curr[obj.guardian_index] = 1;
    data[obj.guardian_index] += 1;
  })

  if (hist.length < 1000) {
    hist.enqueue([...curr]);
  } else {
    hist.enqueue([...curr]);
    let old = hist.dequeue();
    for (let i = 0; i < 19; i++) {
      data[i] -= old[i];
    }
  }

  //console.log(parsedVAA.signatures.length);
  console.log(data);

  //const payloadBuffer = Buffer.from(parsedVAA.payload);
  //const transferPayload = parseTransferPayload(payloadBuffer);
  //console.log(transferPayload);
});


http.createServer(function (req, res) {
  console.log("responded to a request");
  res.writeHead(200, {'Content-Type': 'application/json'});
  const dataResponse = JSON.stringify(data)
  res.end(dataResponse);
}).listen(9615);

