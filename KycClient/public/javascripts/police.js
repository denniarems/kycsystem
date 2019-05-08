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
	console.log("Button click performed")
	var CONFIRM = prompt("Please Confirm By Entering 'CONFIRM'", "");
	if (CONFIRM == "CONFIRM") {
		const privateKey = sessionStorage.getItem('priv_key')
		$.post('/putStatus', { privateKey, pub_key, status }, (data, textStatus, jqXHR) => {
			if (data.alert==1) {
				alert("User Verifed")
				window.location.reload()
			}
			else {
				alert("Not Autorised ")
			}
		},'json')
	} else {
		alert("Try Again")
		window.location.reload()

	}
	
	
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
						$('#name').text(data.user[0])
						$('#email').text(data.user[1])
						$('#dob').text(data.user[2])
						$('#address').text(data.user[3])
						$('#mobile').text(data.user[4])
						$('#pincode').text(data.user[5])
						$('#aadhar').text(data.user[6])
						$('#voter').text(data.user[8])
						$('#pub_key').text(data.user[7])
						$('#moreData').modal('show')
						$('#ModalAccept').attr(
							'onclick',
							'putStatus(event,"' + data.user[7] + '",1)',
						)
						$('#ModalReject').attr(
							'onclick',
							'putStatus(event,"' + data.user[7] + '",0)',
						)
					},
					'json',
				)
			},
		})
	}
}

$('#decryptKey').on('show.bs.modal', event => {
	const button = $(event.relatedTarget)
	const state = button[0].dataset.state
	$('#decrypt').attr('data-state', state)
})
