const {
	getUserPublicKey,
	getState,
	encrypt,
	decrypt,
} = require('./lib/transaction')
const { createTransaction } = require('./lib/processor')
FAMILY_NAME = 'Kyc Chain'

USERKEY = '66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c66'
CLIENTKEY = '8f99bb8b1dc799fd1ed9b7e370330f9378c78f7c332ac3e2233bf559ce21ea8b'
POLICEKEY = '4206848f09f0953370fc3e4a131faeab07e239d451190294e5049cfcf05a107e'

function addUserData(
	Key,
	enKey,
	name,
	email,
	dob,
	location,
	mobile,
	pincode,
	aadhar,
) {
	let address = getUserAddress(getUserPublicKey(Key))
	console.log('inside adduserdata on client')
	let payload = [name, email, dob, location, mobile, pincode, aadhar]
	payload = JSON.stringify(payload)
	//encryption
	encryptedPayload = encrypt(payload, enKey)
	let appendedPayload = [-1, [encryptedPayload, [name, mobile, location]]]
	appendedPayload = JSON.stringify(appendedPayload)
	console.log('add user data client', appendedPayload)

	createTransaction(FAMILY_NAME, [address], [address], Key, appendedPayload)
}
function verifyUser(key, userPublicKey, action) {
	console.log('verifyuser on client')
	const address = getUserAddress(userPublicKey)
	let payload = [action, userPublicKey]
	payload = JSON.stringify(payload)
	if (key == POLICEKEY) {
		createTransaction(FAMILY_NAME, [address], [address], key, payload)
	} else {
		console.log('not a police , invalid PrivateKey')
	}
}
function checkPoliceKey(key) {
	return key === POLICEKEY ? 0 : 1
}

async function getUsersData() {
	let UserAddress = hash(FAMILY_NAME).substr(0, 6)
	return getState(UserAddress, true)
}
async function getData() {
	try {
		let usersList = []
		let stateData = await getUsersData()
		// console.log('listings', stateData)
		stateData.data.forEach(users => {
			if (!users.data) return
			let decodedData = Buffer.from(users.data, 'base64').toString()
			let data = JSON.parse(decodedData)
			console.log('Data in getData', data[1])
			if (data[1].length == 3) {
				console.log('hi')

				usersList.push({
					name: data[1][0],
					mobile: data[1][1],
					address: data[1][2],
					stateAddress: users.address,
				})
				console.log(usersList)
			}
		})
		return usersList
	} catch (error) {
		console.log(error)
	}
}
module.exports = {
	addUserData,
	verifyUser,
	checkPoliceKey,
	getData,
}
