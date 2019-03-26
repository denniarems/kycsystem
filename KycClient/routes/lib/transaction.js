/*
module to deal with writing data to store , address generation ,hashing etc
*/
const { TextEncoder } = require('text-encoding/lib/encoding')
const crypto = require('crypto')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const fetch = require('node-fetch')
var encoder = new TextEncoder('utf8')

NAMESPACE = 'Kyc Chain'

// function to hash data
hash = data => {
	return crypto
		.createHash('sha512')
		.update(data)
		.digest('hex')
}
getUserAddress = (pincode, pKey) => {
	let keyHash = hash(pKey)
	let nameHash = hash(NAMESPACE)
	let pinHash = hash(pincode)
	return nameHash.slice(0, 6) + pinHash.slice(0, 6) + keyHash.slice(0, 58)
}
getUserPublicKey = Key => {
	const context = createContext('secp256k1')
	let key = Secp256k1PrivateKey.fromHex(Key)
	let signer = new CryptoFactory(context).newSigner(key)
	return signer.getPublicKey().asHex()
}
async function getState(address, isQuery) {
	let stateRequest = 'http://rest-api:8008/state'
	if (address) {
		if (isQuery) {
			stateRequest += '?address='
		} else {
			stateRequest += '/address/'
		}
		stateRequest += address
	}
	let stateResponse = await fetch(stateRequest)
	let stateJSON = await stateResponse.json()
	return stateJSON
}

module.exports = {
	getUserPublicKey,
	getUserAddress,
	hash,
	getState,
}
