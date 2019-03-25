loginUser = event => {
	event.preventDefault()
	sessionStorage.clear()
	const privateKey = document.getElementById('priv_key').value
	sessionStorage.setItem('privatekey', privateKey)
	if (!privateKey) {
		alert('Input is empty')
	} else {
		$.post(
			'/getKey',
			{ privateKey },
			(data, textStatus, jqXHR) => {
				sessionStorage.setItem('pub_key', data.publicKey)
			},
			'json',
		)
		window.location.href = '/userform'
	}
}

userData = event => {
	event.preventDefault()
	const name = document.getElementById('name').value
	const email = document.getElementById('email').value
	const dob = document.getElementById('dob').value
	const address = document.getElementById('adderss').value
	const mobile = document.getElementById('mobile').value
	const pincode = document.getElementById('pincode').value
	const aadhar = document.getElementById('aadhar').value
	const privateKey = sessionStorage.getItem('privatekey')
	sessionStorage.clear()
	$.post(
		'/userData',
		{
			privateKey: privateKey,
			name: name,
			email: email,
			dob: dob,
			location: address,
			mobile: mobile,
			pincode: pincode,
			aadhar: aadhar,
		},
		'json',
	)
}

document.getElementById('publicKeyOnUserForm').value = sessionStorage.getItem(
	'pub_key',
)
document.getElementById('name').value = 'Dennis'
document.getElementById('email').value = 'hehe@hihi.in'
document.getElementById('dob').value
document.getElementById('adderss').value = 'it doesnt matter'
document.getElementById('mobile').value = 2255
document.getElementById('pincode').value = 300303003
document.getElementById('aadhar').value = 12345678
