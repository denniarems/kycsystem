/*
module to deal with writing data to store , address generation ,hashing etc
*/


const crypto = require('crypto');
const {TextEncoder} = require('text-encoding/lib/encoding')
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')
const {createContext,CryptoFactory} = require('sawtooth-sdk/signing');

var encoder = new TextEncoder('utf8')

//Manufacturer private key 
USERKEY = '8f99bb8b1dc799fd1ed9b7e370330f9378c78f7c332ac3e2233bf559ce21ea8b'
NAMESPACE="Kyc Chain"
// function to hash data
function hash(data) {
    return crypto.createHash('sha512').update(data).digest('hex');
}

/* function to write data to state 
parameter : 
    context -  validator context object
    address - address to which data should be written to
    data - the data tto be written
*/
function writeToStore(context, address, data){
        dataBytes = encoder.encode(data)
        let entries = {
        [address]: dataBytes
      }
    return context.setState(entries);  
}
function deleteFromStore(context, address){
    return context.deleteState([address]);  
}

/* function to retrive the address of a particular vehicle based on its vin number */
function getUserAddress(aadhar,pincode){
    const context = createContext('secp256k1')
    let key = Secp256k1PrivateKey.fromHex(USERKEY)
    let signer = new CryptoFactory(context).newSigner(key)
    let publicKeyHex = signer.getPublicKey().asHex()
    let keyHash  = hash(publicKeyHex)
    let nameHash = hash(NAMESPACE)
    let pinHash = hash(pincode)
    return nameHash.slice(0,6) +pinHash.slice(0,6)+keyHash.slice(0,58)
}

module.exports = {
hash,
writeToStore,
getUserAddress,
deleteFromStore
}

// function getVehicleDataAddress(){
//     const context = createContext('secp256k1');
//     let key = Secp256k1PrivateKey.fromHex(MANUFACTURERKEY)
//     let signer = new CryptoFactory(context).newSigner(key);
//     let publicKeyHex = signer.getPublicKey().asHex()    
//     let keyHash  = hash(publicKeyHex)
//     let nameHash = hash("Vehicle Chain")
//     let vinHash = hash(vinNumber)
//     return nameHash.slice(0,6) +vinHash.slice(0,6)+keyHash.slice(0,58)
// }

