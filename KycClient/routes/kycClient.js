const { CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { createHash } = require('crypto')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
// const fetch = require('node-fetch')
// const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')

FAMILY_NAME = 'Kyc Chain'

USERKEY = '66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c66'
// CLIENTKEY = "8f99bb8b1dc799fd1ed9b7e370330f9378c78f7c332ac3e2233bf559ce21ea8b";
POLICEKEY = '4206848f09f0953370fc3e4a131faeab07e239d451190294e5049cfcf05a107e'

class KnowYourCustomer {
	addUserData(publicKey, name, email, dob, address, mobile, pincode, aadhar) {
		let address = getUserAddress(pincode, publicKey)
		let action = null
		let payload = [
			action,
			name,
			email,
			dob,
			address,
			mobile,
			pincode,
			aadhar,
		].join(',')
		if (key == USERKEY) {
			createTransaction(FAMILY_NAME, [address], [address], key, payload)
		} else {
			console.log('not a user, invalid privateKey')
		}
	}
	verifyUser(key, userPublicKey, pincode, action) {
		const address = getUserAddress(pincode, userPublicKey)
		let payload = [action, userPublicKey, pincode].join(',')
		if (key == POLICEKEY) {
			createTransaction(FAMILY_NAME, [address], [address], key, payload)
		} else {
			console.log('not a police , invalid PrivateKey')
		}
	}
}
module.exports = { KnowYourCustomer }
