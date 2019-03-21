
function loginUser(event) {
  event.preventDefault();
  const privateKey = document.getElementById("priv_key").value;
  if (!privateKey) {
    alert("Input is empty");
  } 
  else {
    sessionStorage.clear();
    sessionStorage.setItem("privatekey",privateKey);
    window.location.href='/userform';
  }
  }
  document.getElementById("publicKey").value=sessionStorage.getItem('privatekey');