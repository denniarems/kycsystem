/* Transaction Processor */
const { TextDecoder } = require('text-encoding/lib/encoding')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { TransactionProcessor } = require('sawtooth-sdk/processor')
import tpFun from './lib/transaction'

const FAMILY_NAME = 'Kyc Chain'
const NAMESPACE = hash(FAMILY_NAME).substring(0, 6)
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
	let user_Address = tpFun.getUserAddress(pincode, userPublicKey)
	let user_detail = [name, email, dob, address, mobile, pincode, aadhar]
	return tpFun.writeToState(context, user_Address, user_detail)
}
verifyUser = (context, action, userPublicKey, pincode) => {
	let address = tpFun.getUserAddress(pincode, userPublicKey)
	return context.getState([address]).then(function(data) {
		console.log('data', data)
		if (action == 0) {
			return tpFun.deleteFromState(context, address)
		} else {
			let stateJSON = decoder.decode(data[address])
			let newData = stateJSON + ',' + [action].join(',')
			return tpFun.writeToState(context, address, newData)
		}
	})
}

//transaction handler class

class KnowYourCustomer extends TransactionHandler {
	constructor() {
		super(FAMILY_NAME, ['1.0'], [NAMESPACE])
	}
	//apply function
	apply = (transactionProcessRequest, context) => {
		let PayloadBytes = decoder.decode(transactionProcessRequest.payload)
		let Payload = PayloadBytes.toString().split(',')
		let action = Payload[0]
		if (!action) {
			return addUserData(
				context,
				Payload[1],
				Payload[2],
				Payload[3],
				Payload[4],
				Payload[5],
				Payload[6],
			)
		} else {
			return verifyUser(context, Payload[0], Payload[1], Payload[2])
		}
	}
}

const transactionProcessor = new TransactionProcessor(URL)
transactionProcessor.addHandler(new KnowYourCustomer())
transactionProcessor.start()
