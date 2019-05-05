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
  // let receipt =  user_detail[1][0]
  // console.log("rece",receipt)
  context.addReceiptData(Buffer.from('change in state is'+ user_detail,'utf8'))
  return tp.writeToState(context, user_Address, user_detail)
}

changeEnckey = (context, userPublicKey, Payload) => {
  let user_Address = tp.getUserAddress(userPublicKey)
  // console.log("PYLOD RECICE ENC ",Payload)
  let user_detail = Payload
  return tp.writeToState(context, user_Address, user_detail)
}
function verifyUser  (context, action, userPublicKey)  {
  let address = tp.getUserAddress(userPublicKey)
  return context.getState([address]).then((data)=> {
    console.log('data inside verifyuser', data)
    if (action == 0) {
      console.log('action', action)
      context.addEvent('Kyc Chain/PoliceReject', [
        ['policerejection ', address]
      ])
      return tp.deleteFromState(context, address)
    } 
    else if (action == 1)
    {
      try{
        let stateData = decoder.decode(data[address])
        // console.log('data[address]', data[address])
        // console.log('data', data)
        console.log('stateData decode is ', stateData)
        let Payload = JSON.parse(stateData)
        console.log('parse Payload', Payload)
        let D = new Date()
        let date = Date.parse(D)
        action = [action, date]
        // console.log("ACTION INSIDE ACCEPT",action)
        let newData = [Payload[0], action]
        console.log('newData is ', newData)
        context.addEvent('Kyc Chain/Policeverified', [['policeverified', address]])
        // context.addReceiptData(Buffer.from("Verified",newData,'utf8'));
        return tp.writeToState(context, address, newData)
       
      }catch(err){
        console.log("err is ",err)
      }
    }
      else {
        throw new InvalidTransaction('Action must be 1 or 0')
      }
  }).catch((err)=>
  {
    console.error(err)
  })
}

class KnowYourCustomer extends TransactionHandler {
  constructor() {
    super(FAMILY_NAME, ['1.0'], [NAMESPACE])
  }

  apply(transactionProcessRequest, context) {
    console.log('inside apply tp')
    let PayloadBytes = decoder.decode(transactionProcessRequest.payload)
    let userPublicKey = transactionProcessRequest.header.signerPublicKey
    let Payload = JSON.parse(PayloadBytes)
    let action = parseInt(Payload[0])
    console.log("ACTION TP APPLY ",action)
    switch (action) {
      case -1:
        return addUserData(context, userPublicKey, Payload[1])
        break
      case 0:
      // console.log("case verfiy ",Payload[0]+"&"+Payload[1])
        return verifyUser(context, Payload[0], Payload[1])
        break ;
      case 1:
        // console.log("case verfiy ",Payload[0],"&",Payload[1])
        return verifyUser(context, Payload[0], Payload[1])
        break;
      case 2:
        // console.log("ENC PAY IS ",Payload[1])
        return changeEnckey(context, userPublicKey, Payload[1])
        break;
      default:
        throw new InternalError(' Error! in TP')
        break
    }
  }
}

const transactionProcessor = new TransactionProcessor(URL)
transactionProcessor.addHandler(new KnowYourCustomer())
transactionProcessor.start()
