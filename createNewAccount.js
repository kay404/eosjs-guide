const { Api, JsonRpc } = require('eosjs');
const ecc = require('eosjs-ecc');
const fetch = require('node-fetch');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder

const defaultPrivateKey = '5KQhMkrKQCdRz3n5UVXB7PxUf5r6LBNwqvMQQHcyHgSMMPJ61z8', // This is test only keys and should never be used for the production blockchain.
signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const rpc = new JsonRpc('http://sidechain-test.meet.one:8888', { fetch });
const chainId = '7136e3e32a458bb99cf6973ab5055869d25830607b9e78593769e1be52fb6f20';
const api = new Api({ rpc, signatureProvider, chainId, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
var payer = 'testnetaaa.m';

var PrivateKey = ecc.PrivateKey;
PrivateKey.randomKey().then(function (d) {
  var privkey = d.toWif();
  var publicKey = d.toPublic().toString();

  console.log('public key:' + publicKey);
  console.log('private key:' + privkey);

  var newAccountName = 'eosjsguide.m';
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
});


