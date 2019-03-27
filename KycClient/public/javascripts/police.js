loginPolice = event => {
	event.preventDefault()
	sessionStorage.clear()
	const privateKey = document.getElementById('priv_key').value
	sessionStorage.setItem('priv_key', privateKey)
	if (!privateKey) {
		alert('Input is empty')
	} else {
		$.post(
			'/checkPoliceKey',
			{ privateKey },
			(data, textStatus, jqXHR) => {
				if (data.status === 0) {
					window.location.href = '/PoliceUi'
				} else {
					alert('Not Authorised ')
				}
			},
			'json',
		)
	}
}
// modelOpen = (event, index) => {}
putStatus = (event, pincode, pub_key, status) => {
	event.preventDefault()
	const privateKey = sessionStorage.getItem('priv_key')
	$.post('/putStatus', { privateKey, pincode, pub_key, status }, 'json')
	window.location.href = '/'
}
