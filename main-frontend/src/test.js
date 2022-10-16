import {
  createSpyRPCServiceClient,
  subscribeSignedVAA,
} from "@certusone/wormhole-spydk";

import {
  importCoreWasm,
  parseTransferPayload,
  setDefaultWasm,
} from "@certusone/wormhole-sdk";
const endpoints = [
    "https://wormhole.inotel.ro/",
    "https://wormhole-v2-mainnet-api.mcf.rocks/",
    "https://wormhole-v2-mainnet-api.chainlayer.network/",
    "https://wormhole-v2-mainnet-api.staking.fund/",
    "https://wormhole-v2-mainnet-api.certus.one/"
    // "https://wormhole-v2-mainnet.01node.com/"
]
const config = {
    user: 'user',
    password: 'pass',
    server: 'localhost',
    database: 'Master'
};
export async function tracker(data) {
  for (let i = 0; i < 19; i++) {
    data.push(0);
  }
  setDefaultWasm("node");

  const { parse_vaa } = await importCoreWasm();
  const client = createSpyRPCServiceClient("143.198.69.169:7073");
  const stream = await subscribeSignedVAA(client, {});

  stream.addListener("data", ({ vaaBytes }) => {
  const parsedVAA = parse_vaa(vaaBytes);

  parsedVAA.signatures.forEach(obj=> {
    data[obj.guardian_index]+=1
  })
});
stream.addListener("error", (error) => {
  console.log(error);
});

};
async function willFail(obj, usdval, chainId){
    let arr = obj["entries"]
    for (let i=0; i < arr.length; i++){
        let chainNotional = arr[i];
        if (chainNotional["chainId"] == chainId){
            let notionalExceeded = chainNotional["remainingAvailableNotional"] <= usdval;
            let txNotionalExceeded = chainNotional["bigTransactionSize"] <= usdval
            return notionalExceeded || txNotionalExceeded;
        }
    }
    return true;
}

export async function testTransaction(usdval, chainId) {
    let hasExceededCapacity = false;
    for(let i=0; i < endpoints.length; i++){
        let call = endpoints[i] + "v1/governor/available_notional_by_chain";
        let res = await(await fetch(call)).json();
        let exceededCapacity = await willFail(res, usdval, chainId);
        hasExceededCapacity = hasExceededCapacity || exceededCapacity;
    }
    return hasExceededCapacity;
};

const usdval = 10; // 10 USD of value
const chainId = 1; //Ethereum
testTransaction(usdval, chainId).then(result => {
    console.log(result);
  }).catch(error => {
    console.log(error);
  })
