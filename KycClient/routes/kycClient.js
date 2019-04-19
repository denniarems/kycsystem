const {
  getUserPublicKey,
  getState,
  encrypt,
  getUserAddress,
  decrypt
} = require("./lib/transaction");
const { createTransaction } = require("./lib/processor");
FAMILY_NAME = "Kyc Chain";

USERKEY = "66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c66";
CLIENTKEY = "8f99bb8b1dc799fd1ed9b7e370330f9378c78f7c332ac3e2233bf559ce21ea8b";
POLICEKEY = "4206848f09f0953370fc3e4a131faeab07e239d451190294e5049cfcf05a107e";

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
  aadhar
) {
  let address = getUserAddress(pub_key);
  let payload = [
    name,
    email,
    dob,
    location,
    mobile,
    pincode,
    aadhar,
    getUserPublicKey(Key)
  ];
  payload = JSON.stringify(payload);
  //encryption
  encryptedPayload = encrypt(payload, enKey);
  console.log("Encrypted Payload", encryptedPayload);
  let appendedPayload = [-1, [encryptedPayload, [name, mobile, location]]];
  appendedPayload = JSON.stringify(appendedPayload);

  createTransaction(FAMILY_NAME, [address], [address], Key, appendedPayload);
}
function verifyUser(key, userPublicKey, action) {
  const address = getUserAddress(userPublicKey);
  let payload = [action, userPublicKey];
  payload = JSON.stringify(payload);
  if (key == POLICEKEY) {
    createTransaction(FAMILY_NAME, [address], [address], key, payload);
  } else {
    console.log("not a police , invalid PrivateKey");
  }
}

function checkPoliceKey(key) {
  return key === POLICEKEY ? 0 : 1;
}

async function getUsersData() {
  let UserAddress = hash(FAMILY_NAME).substr(0, 6);
  return getState(UserAddress, true);
}
async function getData() {
  try {
    let usersList = [];
    let stateData = await getUsersData();
    // console.log('listings', stateData)
    stateData.data.forEach(users => {
      if (!users.data) return;
      let decodedData = Buffer.from(users.data, "base64").toString();
      let data = JSON.parse(decodedData);
      if (data[1].length == 3) {
        usersList.push({
          name: data[1][0],
          mobile: data[1][1],
          address: data[1][2],
          stateAddress: users.address
        });
      }
    });
    return usersList;
  } catch (error) {
    console.log(error);
  }
}
async function getUserData(UserAddress) {
  return getState(UserAddress, true);
}
async function changeUserKey(PrivateKey, OldKey, NewKey) {
  const userPublicKey = getUserPublicKey(PrivateKey);
  const userAddress = getUserAddress(userPublicKey);
  let stateData = await getUserData(userAddress);
  let decodedData = Buffer.from(stateData.data[0].data, "base64").toString();
  const payload = JSON.parse(decodedData);
  encryptedPayload = payload[0];
  console.log("encryptedPayload", encryptedPayload);
  extraPayload = payload[1];
  console.log("extraPayload", extraPayload);
  try {
    decryptedPayload = decrypt(encryptedPayload, OldKey);
    console.log(JSON.parse(decryptedPayload).length);
    // password check cheyyanam oru try catch cheyithal mathi
    console.log("decryptedPayload", decryptedPayload);
    // decryptedPayload = JSON.stringify(decryptedPayload);
    console.log(" Stringify decryptedPayload", decryptedPayload);
    newEncryptedPayload = encrypt(decryptedPayload, NewKey);
  console.log("NewEncryptedPayload", newEncryptedPayload);
  let appendedPayload = [2,[newEncryptedPayload,extraPayload]];
  appendedPayload = JSON.stringify(appendedPayload);

  createTransaction(FAMILY_NAME, [userAddress], [userAddress], PrivateKey, appendedPayload);
	return 1
  } catch (error) {
	  console.log(error);
	  return 0
	  
  }

  return 0;
}

module.exports = {
  addUserData,
  verifyUser,
  checkPoliceKey,
  getData,
  changeUserKey
};
