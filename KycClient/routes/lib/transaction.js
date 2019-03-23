/*
module to deal with writing data to store , address generation ,hashing etc
*/

const crypto = require('crypto')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')

var encoder = new TextEncoder('utf8')

NAMESPACE = 'Kyc Chain'

// function to hash data
hash = data => {
	return crypto
		.createHash('sha512')
		.update(data)
		.digest('hex')
}

/* function to write data to state 
    parameter : 
    context -  validator context object
    address - address to which data should be written to
    data - the data tto be written
    */
writeToStore = (context, address, data) => {
	this.dataBytes = encoder.encode(data)
	let entries = {
		[address]: dataBytes,
	}
	return context.setState(entries)
}
deleteFromStore = (context, address) => {
	return context.deleteState([address])
}

/* function to retrive the address of a particular vehicle based on its vin number */
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

module.exports = {
	getUserPublicKey,
	getUserAddress,
	deleteFromStore,
	writeToStore,
	hash,
}
