
  loginUser = event => {
    event.preventDefault();
    sessionStorage.clear();
    const privateKey = document.getElementById("priv_key").value;
    sessionStorage.setItem("privatekey", privateKey);
    if (!privateKey) {
      alert("Input is empty");
    } else {
      sessionStorage.setItem("pub_key", privateKey);
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
    const pincode = document.getElementById("pincode").value;
    const aadhar = document.getElementById("aadhar").value;
    const privateKey = sessionStorage.getItem("pub_key");
    sessionStorage.clear();
    $.post('/userData',{
      privateKey: privateKey,
      name:name,
      email:email,
      dob:dob,
      address:address,
      mobile:mobile,
      pincode:pincode,
      aadhar:aadhar
    } ,'json');
  };


document.getElementById("publicKeyOnUserForm").value = sessionStorage.getItem(
  "pub_key"
);



