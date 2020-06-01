// We have deloyed contract articles.m to MEETONE sidechain testnet.
// Contract articles.m stores article on chain. It inclueds 3 actions, publish, edit, delete.
// Source code: https://github.com/meet-one/contracts/tree/master/articles.m

const { Api, JsonRpc } = require('eosjs');
const fetch = require('node-fetch');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder

const defaultPrivateKey = '5KQhMkrKQCdRz3n5UVXB7PxUf5r6LBNwqvMQQHcyHgSMMPJ61z8', // This is test only keys and should never be used for the production blockchain.
signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const rpc = new JsonRpc('http://sidechain-test.meet.one:8888', { fetch });
const chainId = '7136e3e32a458bb99cf6973ab5055869d25830607b9e78593769e1be52fb6f20'; // 32 byte (64 char) hex string
const api = new Api({ rpc, signatureProvider, chainId, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

var sender = 'testnetaaa.m';
var permission = 'active';
var contractName = 'articles.m';


function query() {
  rpc.get_table_rows({
    json: true,
    code: contractName,
    scope: contractName,
    table: 'articles'
  }).then(result => {
    console.log(result);
  }).catch(err => {
    console.log(JSON.stringify(err, null, 2));
  })
}

// publish article to contract table
function publish(title, author, content) {
  api.transact({
    actions: [{
      account: contractName,
      name: 'publish',
      authorization: [{
        actor: sender,
        permission: permission
      }],
      data: {
        title: title,
        author: author,
        content: content
      }
    }]
  }, {
      blocksBehind: 3,
      expireSeconds: 60
  }).then(result => {
    console.log(result)
  }).catch(err => {
    console.log(JSON.stringify(err, null, 2))
  })
}

// edit article
function edit(id, title, author, content) {
  api.transact({
    actions: [{
      account: contractName,
      name: 'edit',
      authorization: [{
        actor: sender,
        permission: permission
      }],
      data: {
        id: id,
        title: title,
        author: author,
        content: content
      }
    }]
  }, {
      blocksBehind: 3,
      expireSeconds: 60
  }).then(result => {
    console.log(result)
  }).catch(err => {
    console.log(JSON.stringify(err, null, 2))
  })
}

// delete article
function del(id) {
  api.transact({
    actions: [{
      account: contractName,
      name: 'delarticle',
      authorization: [{
        actor: sender,
        permission: permission
      }],
      data: {
        id: id
      }
    }] 
  }, {
      blocksBehind: 3,
      expireSeconds: 60
  }).then(result => {
    console.log(result)
  }).catch(err => {
    console.log(JSON.stringify(err, null, 2))
  })
}

query();
publish('Hello World', 'testnetaaa.m', 'Across the Great Wall, we can reach every corner in the world.');
edit(0, 'Hello World', 'testnetaaa.m', 'Across the Great Wall, we can reach every corner in the world.');
del(0)

api.transact({
  actions: [{
    account: 'icbs.token',
    name: 'transfer',
    authorization: [{
      actor: 'xiaobaiyang2',
      permission: 'active'
    }],
    data: {
      from: 'xiaobaiyang2',
      to: 'icbs',
      quantity: '1.0000 YLZ',
      memo: 'hh'
    }
  }] 
}, {
    blocksBehind: 3,
    expireSeconds: 60
}).then(result => {
  console.log(result)
}).catch(err => {
  console.log(JSON.stringify(err, null, 2))
})