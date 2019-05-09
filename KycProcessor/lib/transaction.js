/*
module to deal with writing data to State , address generation ,hashing etc
*/

const crypto = require('crypto')
const { TextEncoder } = require('text-encoding/lib/encoding')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')

var encoder = new TextEncoder('utf8')

NAMESPACE = 'Kyc Chain'
class tpFun {
	// function to hash data
	hash(data) {
		return crypto
			.createHash('sha512')
			.update(data)
			.digest('hex')
	}
	writeToState(context, address, data) {
		this.dataBytes = encoder.encode(JSON.stringify(data))
		let entries = {
			[address]: this.dataBytes,
		}
		return context.setState(entries)
	}
	deleteFromState(context, address) {
		return context.deleteState([address])
	}
	/* function to retrive the address of a particular vehicle based on its vin number */
	getUserAddress(pKey) {
		let keyHash = this.hash(pKey)
		let nameHash = this.hash(NAMESPACE)
		return nameHash.slice(0, 12) + keyHash.slice(0, 58)
	}
	getUserPublicKey(Key) {
		const context = createContext('secp256k1')
		let key = Secp256k1PrivateKey.fromHex(Key)
		let signer = new CryptoFactory(context).newSigner(key)
		return (publicKeyHex = signer.getPublicKey().asHex())
	}
	encrypt(data, enKey) {
		let cipher = crypto.createCipher('aes-256-ctr', enKey, iv)
		let crypted = cipher.update(data, 'utf8', 'hex')
		crypted += cipher.final('hex')
		return crypted
	}

	decrypt(data, enKey) {
		let decipher = crypto.createDecipher('aes-256-ctr', enKey, iv)
		let dec = decipher.update(data, 'hex', 'utf8')
		dec += decipher.final('utf8')
		return dec
	}
}

module.exports = tpFun
