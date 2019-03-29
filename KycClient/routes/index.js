const express = require('express')
const router = express.Router()
const {
	addUserData,
	verifyUser,
	checkPoliceKey,
	getData,
} = require('./kycClient')
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
		const enKey = req.body.enKey
		console.log('Data sent to REST API')
		addUserData(
			Key,
			enKey,
			name,
			email,
			dob,
			location,
			mobile,
			pincode,
			aadhar,
		)
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
router.get('/policeUi', async (req, res) => {
	let usersList = await getData()
	let users = []
	for (let index = 0; index < usersList.length; index++) {
		const user = usersList[index]
		// if (user['action'] == -1) {
		console.log(index, user)

		users.push(user)
		// }
	}
	res.render('policeUi', { listings: users })
})
router.post('/checkPoliceKey', (req, res) => {
	key = req.body.privateKey
	status = checkPoliceKey(key)
	res.send({ status: status })
})
router.post('/putStatus', (req, res) => {
	const pub_key = req.body.pub_key
	const status = req.body.status
	const privateKey = req.body.privateKey
	verifyUser(privateKey, pub_key, status)
})
router.post('/getKey', (req, res, next) => {
	key = req.body.privateKey
	key = getUserPublicKey(key)
	res.send({ publicKey: key })
})

module.exports = router
