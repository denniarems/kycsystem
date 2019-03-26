const { getUserPublicKey, getState } = require('./lib/transaction')
const { createTransaction } = require('./lib/processor')
FAMILY_NAME = 'Kyc Chain'

USERKEY = '66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c66'
CLIENTKEY = '8f99bb8b1dc799fd1ed9b7e370330f9378c78f7c332ac3e2233bf559ce21ea8b'
POLICEKEY = '4206848f09f0953370fc3e4a131faeab07e239d451190294e5049cfcf05a107e'

function addUserData(Key, name, email, dob, location, mobile, pincode, aadhar) {
	let address = getUserAddress(pincode, getUserPublicKey(Key))
	console.log(address)
	let action = -1
	let payload = [
		action,
		name,
		email,
		dob,
		location,
		mobile,
		pincode,
		aadhar,
	].join(',')
	createTransaction(FAMILY_NAME, [address], [address], Key, payload)
}
function verifyUser(key, userPublicKey, pincode, action) {
	const address = getUserAddress(pincode, userPublicKey)
	let payload = [action, userPublicKey, pincode].join(',')
	if (key == POLICEKEY) {
		createTransaction(FAMILY_NAME, [address], [address], key, payload)
	} else {
		console.log('not a police , invalid PrivateKey')
	}
}
function checkPoliceKey(key) {
	return key === POLICEKEY ? 0 : 1
}
/**
 * Get state from the REST API
 * @param {*} address The state address to get
 * @param {*} isQuery Is this an address space query or full address
 */

async function getUserData() {
	let UserAddress = hash(FAMILY_NAME).substr(0, 6)
	return getState(UserAddress, true)
}
async function getData() {
	let stateData = await getUserData()
	//console.log("listings", stateData);
	let usersList = []
	stateData.data.forEach(users => {
		if (!users.data) return
		let decodedData = Buffer.from(users.data, 'base64').toString()
		let data = decodedData.split(',')
		usersList.push({
			name: data[0],
			email: data[1],
			dob: data[2],
			address: data[3],
			mobile: data[4],
			pincode: data[5],
			aadhar: data[6],
			pub_key: data[7],
		})
	})
	return usersList
}
module.exports = {
	addUserData,
	verifyUser,
	getUserData,
	checkPoliceKey,
	getData,
}
