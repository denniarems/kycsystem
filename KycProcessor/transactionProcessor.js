/* Transaction Processor */
const { TextDecoder } = require('text-encoding/lib/encoding')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { TransactionProcessor } = require('sawtooth-sdk/processor')
const tpFun = require('./lib/transaction')

const FAMILY_NAME = 'Kyc Chain'
const tp = new tpFun()
const NAMESPACE = tp.hash(FAMILY_NAME).substring(0, 6)
const URL = 'tcp://validator:4004'
var decoder = new TextDecoder('utf8')
addUserData = (
	context,
	userPublicKey,
	name,
	email,
	dob,
	address,
	mobile,
	pincode,
	aadhar,
) => {
	let user_Address = tp.getUserAddress(pincode, userPublicKey)
	let user_detail = [
		name,
		email,
		dob,
		address,
		mobile,
		pincode,
		aadhar,
		userPublicKey,
	]
	return tp.writeToState(context, user_Address, user_detail)
}
verifyUser = (context, action, userPublicKey, pincode) => {
	let address = tp.getUserAddress(pincode, userPublicKey)
	return context.getState([address]).then(function(data) {
		console.log('data', data)

		if (action == 0) {
			console.log('action', action)

			return tp.deleteFromState(context, address)
		} else {
			let stateJSON = decoder.decode(data[address])
			let newData = stateJSON + ',' + [action].join(',')
			return tp.writeToState(context, address, newData)
		}
	})
}

//transaction handler class

class KnowYourCustomer extends TransactionHandler {
	constructor() {
		super(FAMILY_NAME, ['1.0'], [NAMESPACE])
	}
	//apply function
	apply(transactionProcessRequest, context) {
		let PayloadBytes = decoder.decode(transactionProcessRequest.payload)
		let userPublicKey = transactionProcessRequest.header.signerPublicKey
		let Payload = PayloadBytes.toString().split(',')
		let action = parseInt(Payload[0])
		if (action == -1) {
			return addUserData(
				context,
				userPublicKey,
				Payload[1],
				Payload[2],
				Payload[3],
				Payload[4],
				Payload[5],
				Payload[6],
				Payload[7],
			)
		} else {
			return verifyUser(context, Payload[0], Payload[1], Payload[2])
		}
	}
}

const transactionProcessor = new TransactionProcessor(URL)
transactionProcessor.addHandler(new KnowYourCustomer())
transactionProcessor.start()
