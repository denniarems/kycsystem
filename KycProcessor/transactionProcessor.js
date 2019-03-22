/* Transaction Processor */
const {TextDecoder} = require('text-encoding/lib/encoding')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const {hash , writeToStore ,getUserAddress } = require('./lib/transaction')
const { TransactionProcessor } = require('sawtooth-sdk/processor');



const FAMILY_NAME = "Kyc Chain"
const NAMESPACE = hash(FAMILY_NAME).substring(0, 6);
const URL = 'tcp://validator:4004';
var decoder = new TextDecoder('utf8')


function addUserData (context, name , email , dob , address , mobile, aadhar ) {
    let user_Address = getUserAddress(aadhar)
    let user_detail =[name , email , dob , address , mobile, aadhar]
    return writeToStore(context,user_Address,user_detail)
}
/* function to add  vehicle registration data to chain
parameter :
context - validator context object
Registrar - Registering authority      
vinNumber - vehicle vinNumber
dor - date of registration
owner - owner of  the car 
platenumber - platenumber of car 
*/

function verifyUser(context,vinNumber,dor,owner,plateNumber,Register,OwnerAddress){
    console.log("registrering vehicle")
    let address = getVehicleAddress(vinNumber)
    return context.getState([address]).then(function(data){
    console.log("data",data)
    if(data[address] == null || data[address] == "" || data[address] == []){
        console.log("Invalid vin number!")
    }else{
    let stateJSON = decoder.decode(data[address])
    let newData = stateJSON + "," + [dor,owner,plateNumber,Register,OwnerAddress].join(',')
    return writeToStore(context,address,newData)
    }
    })