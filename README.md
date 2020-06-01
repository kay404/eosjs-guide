## eosjs-guide
Step-by-step guide to learning eosjs API for integration with EOSIO-based blockchains. (EOS, MEETONE, BOS)

[Sourcecode of Guide](index.js)

[History API Documentation](https://documenter.getpostman.com/view/3895747/S11Ey1cw)

[Click me if you would like to know how to push action to custom contract](articles.js)

[Private Key to Public Key](https://github.com/meet-one/private-to-public)

[eosjs-guide of eosjs v16.0](eosjs-guide-v16.0)

### Install

```
yarn add eosjs
```

### Basic config
```
const { Api, JsonRpc } = require('eosjs');
const ecc = require('eosjs-ecc');
const fetch = require('node-fetch');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder

const defaultPrivateKey = '', 
signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const rpc = new JsonRpc('http://fullnode.meet.one', { fetch });
const chainId = '7136e3e32a458bb99cf6973ab5055869d25830607b9e78593769e1be52fb6f20'; // 32 byte (64 char) hex string
const api = new Api({ rpc, signatureProvider, chainId, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
```

### Basic Usage

Generate new key pair 

```
ecc.PrivateKey.randomKey().then(privateKey => {
  console.log('Private Key:\t', privateKey.toWif());                 // wallet import format
  console.log('Public Key:\t', privateKey.toPublic().toString());    
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return general network information

```
rpc.get_info().then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return a blockchain account
```
rpc.get_account('eosio').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return smart contract code hash
```
eos.getCodeHash('eosio', (error, result) => {
  console.log(error, result)
});
```

Return smart contract abi
```
rpc.get_abi('eosio').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return smart contract raw of code and abi
```
rpc.get_raw_code_and_abi('eosio').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return a block from the blockchain.
```
rpc.get_block("3833592").then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return the minimum state necessary to validate transaction headers.
```
rpc.get_block_header_state("3833592").then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

smart contract data from an account.
```
rpc.get_table_rows({
  json: true,
  code: 'eosio',
  scope: 'eosio',
  table: 'voters',
  lower_bound: 'meetone.m',  // default = 0
  upper_bound: '',           // default = -1
  limit: 5,                  // default = 10
  key_type: '',              // The key type of --index, primary only supports (i64), all others support (i64, i128, i256, float64, float128). Special type 'name' indicates an account name.
  index_position: '',        // 1 - primary (first), 2 - secondary index (in order defined by multi_index), 3 - third index, etc
  reverse: false,           // Optional: Get reversed data
  show_payer: false,        // Optional: Show ram payer
}).then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return currency balance
```
rpc.get_currency_balance('eosio.token', 'eosio', 'MEETONE').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return currency stats
```
rpc.get_currency_stats('eosio.token', 'MEETONE').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return producers list from system contract
```
rpc.get_producers(true, 'meetone.m', 1).then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
}) 
```

Return currently producer schedule
```
rpc.get_producer_schedule().then(result => {
  console.log(JSON.stringify(result, null, 2));
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return transaction info
```
rpc.history_get_transaction('98ff999d1395553ba9f3eb8acf59206aece4676b406cd6389911b42378c4ccdb').then(result => {
  console.log(JSON.stringify(result, null, 2));
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return key accounts
```
rpc.history_get_key_accounts('EOS6ZtMCx7eCkNxkRcizJm7J5Fr13YKtaBEx6PtETnh1ihoHRZvWU').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return accounts controlled by eosio.prods
```
rpc.history_get_controlled_accounts('eosio.prods').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return account actions
```
rpc.history_get_actions(
  'meetone.m',    
  '',           // An absolute sequence positon -1 is the end/last action
  '20'          //The number of actions relative to pos, negative numbers return [pos-offset,pos), positive numbers return [pos,pos+offset)
).then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return rammarket data and RAM price
```
rpc.get_table_rows({
  json: true,
  code: 'eosio',
  scope: 'eosio',
  table: 'rammarket'
}).then(result => {
  console.log(result);
  var data = result.rows[0];
  var quoteBalance = data.quote.balance.split(' ')[0];
  var baseBalance = data.base.balance.split(' ')[0];
  console.log('current RAM price of per KB: ' + quoteBalance / baseBalance * 1024);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return CPU/NET price
```
rpc.get_account('meetone.m').then(result => {
  console.log(result);

  var netWeight = result.total_resources.net_weight.split(' ')[0];
  var netLimit = result.net_limit.max;
  console.log('current price of NET (MEETONE/KB/Day): ' + netWeight / (netLimit / 1024) / 3);

  var cpuWeight = result.total_resources.cpu_weight.split(' ')[0];
  var cpuLimit = result.cpu_limit.max;
  console.log('current price of CPU (MEETONE/KB/Day): ' + cpuWeight / (cpuLimit / 1000) / 3);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return block producer info
```
rpc.get_table_rows({
  json: true,
  code: 'eosio',
  scope: 'eosio',
  table: 'producers',
  lower_bound: 'meetone.m',
  limit: 1
}).then(result => {
  console.log(result);

  // convert vote_weight to token amount
  // staked = voteWeight / Math.pow(2, seconds_since_year_2000 / seconds_per_year ) / 10000

  var voteWeight = result.rows[0].total_votes;
  var staked = voteWeight / Math.pow(2, Math.floor(((new Date()).getTime() - 946684800000) / 1000 / (86400 * 7 )) / 52) / 10000;
  console.log(staked);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Return blockchain global data
```
rpc.get_table_rows({
  json: true,
  code: 'eosio',
  scope: 'eosio',
  table: 'global',
}).then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

Create new account [source code](createNewAccount.js)
```
api.transact({
  actions: [{
    account: 'eosio',
    name: 'newaccount',
    authorization: [{
      actor: payer,
      permission: faucetPermission
    }],
    data: {
      creator: payer,
      name: newAccountName,
      owner: {
        threshold: 1,
        keys: [{
          key: publicKey,
          weight: 1
        }],
        accounts: [],
        waits: []
      },
      active: {
        threshold: 1,
          keys: [{
            key: publicKey,
            weight: 1
          }],
        accounts: [],
        waits: []
      },
    }         
  },{
    account: 'eosio',
    name: 'buyrambytes',
    authorization: [{
      actor: payer,
      permission: faucetPermission
      }
    ],
    data: {
      payer: payer,
      receiver: newAccountName,
      bytes: 1024 * 3
    }
  },{
    account: 'eosio',
    name: 'delegatebw',
    authorization: [{
      actor: payer,
      permission: faucetPermission
      }
    ],
    data: {
      from: payer,
      receiver: newAccountName,
      stake_net_quantity: '1.0000 MEETONE',
      stake_cpu_quantity: '1.0000 MEETONE',
      transfer: true,
    }
  }]
},{
    blocksBehind: 3,
    expireSeconds: 60,
}).then(function (result) {
  console.log(result);
  // https://meetone-test.eosx.io/account/eosjsguide.m
}).catch(function (error) {
  if (error) {
    console.log(JSON.parse(error));
  }
});
```

Tables of system contract eosio

```
// record of each voter
// cleos -u http://fullnode.meet.one get table eosio eosio voters
voters

// record of each producer
// cleos -u http://fullnode.meet.one get table eosio eosio producers
producers

// votepay_share record of each producer
// cleos -u http://fullnode.meet.one get table eosio eosio producers2
producers2

// info of system rammarket
// cleos -u http://fullnode.meet.one get table eosio eosio rammarket -l 1
rammarket

// record of each account
// cleos -u http://fullnode.meet.one get table eosio meetone.m userres -l 1
userres

// record of each account's delegate bandwith
// cleos -u http://fullnode.meet.one get table eosio meetone.m delband -l 1
delband

// record of each account's refunding token amount
// cleos -u http://fullnode.meet.one get table eosio m refunds -l 1
refunds

// record of each namebids
// MEETONE sidechain doesn't support bid name
namebids

// record of each refunding namebids
// MEETONE sidechain doesn't support bid name
bidrefunds
```
