
  loginUser = event => {
    event.preventDefault();
    privateKey = document.getElementById("priv_key").value;
    if (!privateKey) {
      alert("Input is empty");
    } else {
      sessionStorage.clear();
      sessionStorage.setItem("privatekey", privateKey);
      window.location.href = "/userform";
    }
  };
  userData = event => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const address = document.getElementById("adderss").value;
    const mobile = document.getElementById("mobile").value;
    const aadhar = document.getElementById("aadhar").value;
    console.log("key",privateKey);
    $.post('/userData',{
      privateKey: privateKey,
      name:name,
      email:email,
      dob:dob,
      address:address,
      mobile:mobile,
      aadhar:aadhar
    } ,'json');
  };


document.getElementById("publicKeyOnUserForm").value = sessionStorage.getItem(
  "privatekey"
);



