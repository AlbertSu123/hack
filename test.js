const endpoints = [
    "https://wormhole.inotel.ro/",
    "https://wormhole-v2-mainnet-api.mcf.rocks/",
    "https://wormhole-v2-mainnet-api.chainlayer.network/",
    "https://wormhole-v2-mainnet-api.staking.fund/",
    "https://wormhole-v2-mainnet-api.certus.one/",
    "https://wormhole-v2-mainnet.01node.com/"
]

async function willFail(obj, usdval, chainId){
    let arr = obj["entries"]
    for (let i=0; i < arr.length; i++){
        let chainNotional = arr[i];
        if (chainNotional["chainId"] == chainId){
            return chainNotional["remainingAvailableNotional"] >= usdval;
        }
    }
}

async function testTransaction(usdval, chainId) {
    for(let i=0; i < endpoints.length; i++){
        let call = endpoints[i] + "v1/governor/available_notional_by_chain";
        let res = await fetch(call);
        console.log(await res.json())
    }
}

testTransaction(0,0).then(result => {
    console.log(result);
  }).catch(error => {
    console.log(error);
  })