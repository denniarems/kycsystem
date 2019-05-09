const {
  getUserPublicKey,
  getState,
  encrypt,
  getUserAddress,
  decrypt
} = require('./lib/transaction')
const { createTransaction } = require('./lib/processor')
FAMILY_NAME = 'Kyc Chain'

let POLICEKEY = [
  '027f3250f50c1257f0314d4d3b7f21af937c4d8b2c1e020f4d2692d0b6c0562f2d',
  '03ce24d7bdb7f31e5c1233affd0faef5e6f62c968b6e1465122bc1ed939b466028'
]

function addUserData(
  Key,
  pub_key,
  enKey,
  name,
  email,
  dob,
  location,
  mobile,
  pincode,
  aadhar,
  Voter
) {
  let address = getUserAddress(pub_key)
  let payload = [
    name,
    email,
    dob,
    location,
    mobile,
    pincode,
    aadhar,
    getUserPublicKey(Key),
    Voter
  ]
  payload = JSON.stringify(payload)
  //encryption
  encryptedPayload = encrypt(payload, enKey)
  console.log('Encrypted Payload', encryptedPayload)
  let appendedPayload = [-1, [encryptedPayload, [name, mobile, location]]]
  appendedPayload = JSON.stringify(appendedPayload)
  createTransaction(FAMILY_NAME, [address], [address], Key, appendedPayload)
}

function verifyUser(key, userPublicKey, action) {
  console.log('inisde verfiy user')
  const address = getUserAddress(userPublicKey)
  let payload = [action, userPublicKey]
  payload = JSON.stringify(payload)
  if (POLICEKEY.indexOf(key) >= 0) {
    createTransaction(FAMILY_NAME, [address], [address], key, payload)
    return 1
  } else {
    return 0
  }
}

function checkPoliceKey(key) {
  if (POLICEKEY.indexOf(key) >= 0) {
    return 0
  }
}

async function getUsersData() {
  console.log('IN getUsersData')
  let UserAddress = hash(FAMILY_NAME).substr(0, 6)
  return getState(UserAddress, true)
}
async function getData() {
  try {
    let usersList = []
    let stateData = await getUsersData()
    console.log('listings getData ', stateData)
    stateData.data.forEach(users => {
      if (!users.data) return
      let decodedData = Buffer.from(users.data, 'base64').toString()
      let data = JSON.parse(decodedData)
      if (data[1].length == 3) {
        usersList.push({
          name: data[1][0],
          mobile: data[1][1],
          address: data[1][2],
          stateAddress: users.address
        })
      }
    })
    console.log('usersList getData ', usersList)
    return usersList
  } catch (error) {
    console.log(error)
  }
}
async function getUserData(UserAddress) {
  return getState(UserAddress, true)
}
async function changeUserKey(PrivateKey, OldKey, NewKey) {
  const userPublicKey = getUserPublicKey(PrivateKey)
  const userAddress = getUserAddress(userPublicKey)
  let stateData = await getUserData(userAddress)
  let decodedData = Buffer.from(stateData.data[0].data, 'base64').toString()
  const payload = JSON.parse(decodedData)
  encryptedPayload = payload[0]
  console.log('encryptedPayload', encryptedPayload)
  extraPayload = payload[1]
  console.log('extraPayload', extraPayload)
  try {
    decryptedPayload = decrypt(encryptedPayload, OldKey)
    console.log(JSON.parse(decryptedPayload).length)
    console.log('decryptedPayload', decryptedPayload)
    // decryptedPayload = JSON.stringify(decryptedPayload);
    console.log(' Stringify decryptedPayload', decryptedPayload)
    newEncryptedPayload = encrypt(decryptedPayload, NewKey)
    console.log('NewEncryptedPayload', newEncryptedPayload)
    let appendedPayload = [2, [newEncryptedPayload, extraPayload]]
    appendedPayload = JSON.stringify(appendedPayload)

    createTransaction(
      FAMILY_NAME,
      [userAddress],
      [userAddress],
      PrivateKey,
      appendedPayload
    )
    return 1
  } catch (error) {
    console.log(error)
    return 0
  }
}

module.exports = {
  addUserData,
  verifyUser,
  checkPoliceKey,
  getData,
  changeUserKey
}
