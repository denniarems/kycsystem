const express = require('express')
const router = express.Router()
const { KnowYourCustomer } = require('./kycClient')
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
	const Key = req.body.privateKey
	const name = req.body.name
	const email = req.body.email
	const dob = req.body.dob
	const address = req.body.address
	const mobile = req.body.mobile
	const pincode = req.body.pincode
	const aadhar = req.body.aadhar
	console.log('Data sent to REST API')
	const addKyc = new KnowYourCustomer()
	addKyc.addUserData(Key, name, email, dob, address, mobile, pincode, aadhar)
	res.send({ message: 'Data successfully added' })
})

/* GET client page. */
router.get('/client', (req, res, next) => {
	res.render('client', { name: 'Client' })
})

/* GET police page. */
router.get('/police', (req, res, next) => {
	res.render('police', { name: 'Police' })
})

router.post('/getKey', (req, res, next) => {
	key = req.body.privateKey
	console.log('key', key)
	key = getUserPublicKey(key)
	console.log('key', key)
	res.send({ publicKey: key })
})

module.exports = router
