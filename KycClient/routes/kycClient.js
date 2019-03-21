const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')	
const {createHash} = require('crypto')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const fetch = require('node-fetch');
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')


FAMILY_NAME='kyc'


privateKeyHex = "66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c66";

function hash(v) {
  return createHash('sha512').update(v).digest('hex');
}
