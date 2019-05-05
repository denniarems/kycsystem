checkUser = address => {
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: 'GET',
      url: '/statedata?address=' + address,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      success: function(result) {
        $.post(
          '/VerifyData',
          { result },
          (data, textStatus, jqXHR) => {
            resolve(data.status[1])
          },
          'json'
        ).fail(() => {
          reject()
        })
      },
      error: () => {
        reject()
      }
    })
  })
}
loginUser = event => {
  event.preventDefault()
  sessionStorage.clear()
  const privateKey = document.getElementById('priv_key').value
  sessionStorage.setItem('privatekey', privateKey)
  if (!privateKey) {
    alert('Input is empty')
  } else {
    $.post(
      '/getKeyAndAddress',
      { privateKey },
      (data, textStatus, jqXHR) => {
        sessionStorage.setItem('pub_key', data.pub_key)
        checkUser(data.address)
          .then(status => {
            var date2 = new Date()
            let minute = parseInt((date2 - status) / (1000 * 60))// 1000*60*60*24 for one day
            if (5 <= minute) {
              window.location.href = '/userPageAllowEdit'
            } else {
              $('#s').text('You Need ' + (5-minute) + '  minutes to Edit Data')// not working 
              window.location.href = '/userPageDenyEdit'
            }
          })
          .catch(() => {
            window.location.href = '/userPageAllowEdit'
          })
      },
      'json'
    )
  }
}

postUserData = event => {
  event.preventDefault()
  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const dob = document.getElementById('dob').value
  const address = document.getElementById('adderss').value
  const mobile = document.getElementById('mobile').value
  const pincode = document.getElementById('pincode').value
  const aadhar = document.getElementById('aadhar').value
  const enKey = document.getElementById('enKey').value
  const Voter = document.getElementById('voter').value ;
  const privateKey = sessionStorage.getItem('privatekey')
  const pub_key = sessionStorage.getItem('pub_key')
 
  try
  {
    console.log(Voter)
    if(aadhar.length == 12 && Voter.length == 10 && pincode.length ==6)
    {
  $.post(
    '/userData',
    {
      privateKey: privateKey,
      pub_key: pub_key,
      name: name,
      email: email,
      dob: dob,
      location: address,
      mobile: mobile,
      pincode: pincode,
      aadhar: aadhar,
      enKey: enKey ,
      voter : Voter
    },
    'json'
  )
  console.log("VALIDATIOmn")
  alert("Data successfully send to police")
}else{
  alert("Please enter valid aadhar , voter id ,pincode details")
}
  }catch(err){
    console.log("ERR IS ",err)
  }
 
}
getUserData = event => {
  event.preventDefault()
  pub_key = sessionStorage.getItem('pub_key')
  deKey = $('#deKey').val()
  $.post(
    '/getAddressFromPubKey',
    { pub_key },
    (data, textStatus, jqXHR) => {
      $.ajax({
        type: 'GET',
        url: '/statedata?address=' + data.address,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
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
              console.log(data.status)
              if (data.status[0] == 1) {
                var date2 = new Date()
                let minute = parseInt(
                  (date2-data.status[1]) / (1000 * 60)// 1000*60*60*24 for one day
                )
                console.log(minute)
                // date add cheyithathu ini edit cheyyumobol check cheyyanam
                $('#status').text('Verifed  :' + minute + '  minutes Old')
              } else {
                $('#status').text(' Not Verifed')
              }
              $('#pub_key').text(data.user[7])
              $('#moreData').modal('show')
            },
            'json'
          )
        }
      })
    },
    'json'
  )
}
updateEncKey = event => {
  event.preventDefault()
  priv_key = sessionStorage.getItem('privatekey')
  oldKey = $('#oldKey').val()
  newKey = $('#newKey').val()
  console.log("Changin key")
  $.post(
    '/changeEnckey',
    { priv_key, oldKey, newKey },
    (data, textStatus, jqXHR) => {
      if (data.msg == 1) {
        alert('Encryption key Changed Successfully')
      } else {
        alert('key Not Changed')
      }
    },
    'json'
  )
}
$('#decryptKey').on('show.bs.modal', event => {
  const button = $(event.relatedTarget)
  const pub_key = sessionStorage.getItem('pub_key')
  $('#decrypt').attr('data-state', pub_key)
})

document.getElementById('publicKeyOnUserForm').value = sessionStorage.getItem(
  'pub_key'
)
document.getElementById('name').value = 'Dennis'
document.getElementById('email').value = 'hehe@hihi.in'
document.getElementById('adderss').value = 'it doesnt matter'
document.getElementById('mobile').value = 2255
document.getElementById('pincode').value = 673007
document.getElementById('aadhar').value = 123456789012
document.getElementById('voter').value = 1234567890

