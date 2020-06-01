
const { JsonRpc } = require('eosjs');
const ecc = require('eosjs-ecc');
const fetch = require('node-fetch');
const rpc = new JsonRpc('https://fullnode.meet.one', { fetch });

// generate new key pair
ecc.PrivateKey.randomKey().then(privateKey => {
  console.log('Private Key:\t', privateKey.toWif());                 // wallet import format
  console.log('Public Key:\t', privateKey.toPublic().toString());    
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})

// return general network information
rpc.get_info().then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return a blockchain account
rpc.get_account('eosio').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return smart contract code hash
// rpc.get_code('eosio').then(result => {
//   console.log(result.code_hash);
// })


// return smart contract abi
rpc.get_abi('eosio').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return smart contract raw of code and abi
rpc.get_raw_code_and_abi('eosio').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return a block from the blockchain.
rpc.get_block("3833592").then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return the minimum state necessary to validate transaction headers.
rpc.get_block_header_state("3833592").then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return smart contract data from an account.
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



// return currency balance
rpc.get_currency_balance('eosio.token', 'eosio', 'MEETONE').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return currency stats
rpc.get_currency_stats('eosio.token', 'MEETONE').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return producers list from system contract
rpc.get_producers(true, 'meetone.m', 1).then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
}) 


// return currently producer schedule
rpc.get_producer_schedule().then(result => {
  console.log(JSON.stringify(result, null, 2));
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return transaction info
rpc.history_get_transaction('98ff999d1395553ba9f3eb8acf59206aece4676b406cd6389911b42378c4ccdb').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return key accounts
rpc.history_get_key_accounts('EOS6ZtMCx7eCkNxkRcizJm7J5Fr13YKtaBEx6PtETnh1ihoHRZvWU').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return accounts controlled by eosio.prods
rpc.history_get_controlled_accounts('eosio.prods').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return account actions
rpc.history_get_actions(
  'meetone.m',    
  '',           // An absolute sequence positon -1 is the end/last action
  '20'          //The number of actions relative to pos, negative numbers return [pos-offset,pos), positive numbers return [pos,pos+offset)
).then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})


// return rammarket data and RAM price
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


// return CPU/NET price
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


// return producer info
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


// return blockchain global data
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
