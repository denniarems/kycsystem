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
putStatus = (event, pub_key, status) => {
	event.preventDefault()
	const privateKey = sessionStorage.getItem('priv_key')
	$.post('/putStatus', { privateKey, pub_key, status }, 'json')
	window.location.href = '/'
}

checkDeKey = event => {
	event.preventDefault()
	const address = $('#decrypt').attr('data-state')
	const deKey = $('#deKey').val()
	if (!deKey) {
		alert('Input is empty')
	} else {
		$.ajax({
			type: 'GET',
			url: '/statedata?address=' + address,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
			},
			success: function(result) {
				$.post(
					'/decryptData',
					{ result, deKey },
					(data, textStatus, jqXHR) => {
						console.log(data.user)
						console.log(data.user.length)
					},
					'json',
				)
				$('#moreData').modal('show')
			},
		})
	}
}

$('#decryptKey').on('show.bs.modal', event => {
	const button = $(event.relatedTarget)
	const state = button[0].dataset.state
	$('#decrypt').attr('data-state', state)
})
