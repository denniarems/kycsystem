/*
module to deal with writing data to store , address generation ,hashing etc
*/
const { TextEncoder } = require('text-encoding/lib/encoding')
const crypto = require('crypto')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const fetch = require('node-fetch')
const iv = Buffer.alloc(16, 0)
NAMESPACE = 'Kyc Chain'

// function to hash data
hash = data => {
	return crypto
		.createHash('sha512')
		.update(data)
		.digest('hex')
}
getUserAddress = PublicKey => {
	let keyHash = hash(PublicKey)
	let nameHash = hash(NAMESPACE)
	return nameHash.slice(0, 12) + keyHash.slice(0, 58)
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
encrypt = (data, enKey) => {
	let cipher = crypto.createCipher('aes-256-ctr', enKey, iv)
	let crypted = cipher.update(data, 'utf8', 'hex')
	crypted += cipher.final('hex')
	return crypted
}

decrypt = (data, deKey) => {
	let decipher = crypto.createDecipher('aes-256-ctr', deKey, iv)
	let dec = decipher.update(data, 'hex', 'utf8')
	dec += decipher.final('utf8')
	return dec
}
module.exports = {
	getUserPublicKey,
	getUserAddress,
	hash,
	getState,
	encrypt,
	decrypt,
}
