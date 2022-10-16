const endpoints = [
    "https://wormhole.inotel.ro/",
    "https://wormhole-v2-mainnet-api.mcf.rocks/",
    "https://wormhole-v2-mainnet-api.chainlayer.network/",
    "https://wormhole-v2-mainnet-api.staking.fund/",
    "https://wormhole-v2-mainnet-api.certus.one/"
    // "https://wormhole-v2-mainnet.01node.com/"
]

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

async function testTransaction(usdval, chainId) {
    let hasExceededCapacity = false;
    for(let i=0; i < endpoints.length; i++){
        let call = endpoints[i] + "v1/governor/available_notional_by_chain";
        let res = await(await fetch(call)).json();
        let exceededCapacity = await willFail(res, usdval, chainId);
        hasExceededCapacity = hasExceededCapacity || exceededCapacity;
    }
    return hasExceededCapacity;
}

const usdval = 10; // 10 USD of value
const chainId = 1; //Ethereum
testTransaction(usdval, chainId).then(result => {
    console.log(result);
  }).catch(error => {
    console.log(error);
  })