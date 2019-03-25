loginPolice = event => {
	event.preventDefault()
	sessionStorage.clear()
	const privateKey = document.getElementById('priv_key').value
	sessionStorage.setItem('privatekey', privateKey)
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
