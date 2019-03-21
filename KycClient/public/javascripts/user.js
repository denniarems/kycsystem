
function loginUser(event) {
  event.preventDefault();
  const privateKey = document.getElementById("priv_key").value;
  if (!privateKey) {
    alert("Input is empty");
  } 
  else {
    $.post('/user',{key: privateKey},(data, textStatus, jqXHR)=>{
      console.log("this ",data);
      }, 'json');
  }
  }
