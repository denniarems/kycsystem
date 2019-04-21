/* Transaction Processor */
const { TextDecoder } = require('text-encoding/lib/encoding')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { TransactionProcessor } = require('sawtooth-sdk/processor')
const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')

const tpFun = require('./lib/transaction')

const FAMILY_NAME = 'Kyc Chain'
const tp = new tpFun()
const NAMESPACE = tp.hash(FAMILY_NAME).substring(0, 6)
const URL = 'tcp://validator:4004'
var decoder = new TextDecoder('utf8')
addUserData = (context, userPublicKey, Payload) => {
  let user_Address = tp.getUserAddress(userPublicKey)
  let user_detail = Payload
  return tp.writeToState(context, user_Address, user_detail)
}
changePassword = (context, userPublicKey, Payload) => {
  let user_Address = tp.getUserAddress(userPublicKey)
  let user_detail = Payload
  return tp.writeToState(context, user_Address, user_detail)
}
verifyUser = (context, action, userPublicKey) => {
  let address = tp.getUserAddress(userPublicKey)
  return context.getState([address]).then(function(data) {
    console.log('data', data)
    if (action == 0) {
      console.log('action', action)
      context.addEvent('Kyc Chain/PoliceReject', [
        ['policerejection ', address]
      ])
      return tp.deleteFromState(context, address)
    } else if (action == 1) {
      let stateData = decoder.decode(data[address])
      console.log('data[address]', data[address])
      console.log('data', data)
      console.log('stateData', stateData)
      let Payload = JSON.parse(stateData)
      console.log('Payload', Payload)
      let D = new Date()
      let date = Date.parse(D)
      action = [action, date]
      console.log(action)
      let newData = [Payload[0], action]
      console.log('newData ', newData)
      context.addEvent('Kyc Chain/Policeverified', [
        ['policeverified', address]
      ])
      // context.addReceiptData(Buffer.from("Verified",newData,'utf8'));
      context.addReceiptData('Verified', newData)
      return tp.writeToState(context, address, newData)
    } else {
      throw new InvalidTransaction('Action must be accept or reje')
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
    console.log('inside apply')

    let PayloadBytes = decoder.decode(transactionProcessRequest.payload)
    let userPublicKey = transactionProcessRequest.header.signerPublicKey
    let Payload = JSON.parse(PayloadBytes)
    let action = parseInt(Payload[0])
    switch (action) {
      case -1:
        return addUserData(context, userPublicKey, Payload[1])
        break
      case 0:
        return verifyUser(context, Payload[0], Payload[1])
        break
      case 1:
        return verifyUser(context, Payload[0], Payload[1])
        break
      case 2:
        return changePassword(context, userPublicKey, Payload[1])
        break
      default:
        console.log('this log will not came')
        break
    }
  }
}

const transactionProcessor = new TransactionProcessor(URL)
transactionProcessor.addHandler(new KnowYourCustomer())
transactionProcessor.start()
