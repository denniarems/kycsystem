const express = require('express')
const router = express.Router()
const { addUserData, verifyUser } = require('./kycClient')
const { getUserPublicKey } = require('./lib/transaction')

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('home')
})

/* GET user page. */
router.get('/user', (req, res, next) => {
	res.render('user', { name: 'User' })
})
router.get('/userform', (req, res, next) => {
	res.render('userform')
})
router.post('/userData', (req, res, next) => {
	try {
		const Key = req.body.privateKey
		const name = req.body.name
		const email = req.body.email
		const dob = req.body.dob
		const location = req.body.location
		const mobile = req.body.mobile
		const pincode = req.body.pincode
		const aadhar = req.body.aadhar
		console.log('Data sent to REST API')
		addUserData(Key, name, email, dob, location, mobile, pincode, aadhar)
		res.send({ message: 'Data successfully added' })
	} catch (error) {
		console.log(error)
	}
})

/* GET client page. */
router.get('/client', (req, res, next) => {
	res.render('client', { name: 'Client' })
})

/* GET police page. */
router.get('/police', (req, res, next) => {
	res.render('police', { name: 'Police' })
})
router.get('/policeUi', (req, res, next) => {
	res.render('policeUi')
})
router.get('/listUserData', async (req, res) => {
	let stateData = await addUserData()
	//console.log("listings", stateData);
	let usersList = []
	stateData.data.forEach(users => {
		if (!users.data) return
		let decodedData = Buffer.from(users.data, 'base64').toString()
		let data = decodedData.split(',')
		console.log(decodedData)
		console.log(Data)

		usersList.push({
			name: data[1],
			email: data[4],
			model: data[3],
			dob: data[2],
			location: data[6],
			address: data[9],
			mobile: data[5],
			aadhar: data[7],
		})
	})

	res.render('policeUi', { listings: usersList })
})

router.post('/getKey', (req, res, next) => {
	key = req.body.privateKey
	console.log('key', key)
	key = getUserPublicKey(key)
	console.log('key', key)
	res.send({ publicKey: key })
})

module.exports = router
