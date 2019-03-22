/* Transaction Processor */
const {TextDecoder} = require('text-encoding/lib/encoding')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const {*} = require('./lib/transaction')
const { TransactionProcessor } = require('sawtooth-sdk/processor');



const FAMILY_NAME = "Kyc Chain"
const NAMESPACE = hash(FAMILY_NAME).substring(0, 6);
const URL = 'tcp://validator:4004';
var decoder = new TextDecoder('utf8')


function addUserData (context, name , email , dob , address , mobile,pincode, aadhar ) {
    let user_Address = getUserAddress(pincode)
    let user_detail =[name , email , dob , address , mobile,pincode, aadhar]
    return writeToStore(context,user_Address,user_detail)
}
function verifyUser(context,action,aadhar,pincode){
    let address = getUserAddress(aadhar,pincode)
    return context.getState([address]).then(function(data){
    console.log("data",data)
    if(action == 0 ){
        return deleteFromStore(context,address)
    }else{
    let stateJSON = decoder.decode(data[address])
    let newData = stateJSON + "," + [action].join(',')
    return writeToStore(context,address,newData)
    
    })