const { CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fetch = require('node-fetch')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { TextEncoder } = require('text-encoding/lib/encoding')
const { hash } = require('./transaction')
FAMILY_VERSION = '1.0'
const encoder = new TextEncoder('utf8')
async function sendTransaction(batchListBytes) {
	let resp = await fetch('http://rest-api:8008/batches', {
		method: 'POST',
		headers: { 'Content-Type': 'application/octet-stream' },
		body: batchListBytes,
	})
	console.log('response', resp)
}
createTransaction = (
	familyName,
	inputList,
	outputList,
	Privkey,
	payload,
	familyVersion = FAMILY_VERSION,
) => {
	console.log('inside ct')

	const context = createContext('secp256k1')
	const secp256k1pk = Secp256k1PrivateKey.fromHex(Privkey.trim())
	signer = new CryptoFactory(context).newSigner(secp256k1pk)

	const payloadBytes = encoder.encode(payload)
	//create transaction header
	const transactionHeaderBytes = protobuf.TransactionHeader.encode({
		familyName: familyName,
		familyVersion: familyVersion,
		inputs: inputList,
		outputs: outputList,
		signerPublicKey: signer.getPublicKey().asHex(),
		nonce: '' + Math.random(),
		batcherPublicKey: signer.getPublicKey().asHex(),
		dependencies: [],
		payloadSha512: hash(payloadBytes),
	}).finish()
	// create transaction
	const transaction = protobuf.Transaction.create({
		header: transactionHeaderBytes,
		headerSignature: signer.sign(transactionHeaderBytes),
		payload: payloadBytes,
	})
	//create batch header
	const batchHeaderBytes = protobuf.BatchHeader.encode({
		signerPublicKey: signer.getPublicKey().asHex(),
		transactionIds: [transaction].map(txn => txn.headerSignature),
	}).finish()
	//create batch
	const batch = protobuf.Batch.create({
		header: batchHeaderBytes,
		headerSignature: signer.sign(batchHeaderBytes),
		transactions: [transaction],
	})
	//create batchlist
	const batchListBytes = protobuf.BatchList.encode({
		batches: [batch],
	}).finish()
	sendTransaction(batchListBytes)
}
module.exports = {
	createTransaction,
}
