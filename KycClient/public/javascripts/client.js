checkClient = pKey => {
  console.log("inside check client");
  
  return new Promise(function(resolve, reject) {
    $.post(
      "/getKeyAndAddress",
      { privateKey:pKey },
      (data, textStatus, jqXHR) => {
        console.log("inside get address");
        $.ajax({
          type: "GET",
          url: "/statedata?address=" + data.address,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          success: function(result) {
            console.log("suc",result);
            $.post(
              "/VerifyData",
              { result },
              (data, textStatus, jqXHR) => {
                console.log("Verfy data",data);
                
                resolve(data.status[0]);
              },
              "json"
            ).fail(() => {
              reject();
            });
          },
          error: () => {
            reject();
          }
        });
      },
      "json"
    );
  });
};

loginClient = async event => {
  event.preventDefault();
  sessionStorage.clear();
  const pKey = $("#priv_key").val();
  sessionStorage.setItem("priv_key", pKey);
  if (!pKey) {
    sessionStorage.clear();
    alert("Input is empty");
  } else {
    checkClient(pKey)
      .then(status => {
        console.log("status get from chechclie",status);
        if (status == 1) {
          window.location.href = "/ClientUi";
        } else {
          sessionStorage.clear();
          alert("Needs Police Verification ");
        }
      })
      .catch(() => {
        sessionStorage.clear();
        alert("invalid user");
      });
  }
};

clientData = event => {
  event.preventDefault();
  pub_key = $("#pub_key").val();
  deKey = $("#deKey").val();
  $.post(
    "/getAddressFromPubKey",
    { pub_key },
    (data, textStatus, jqXHR) => {
      $.ajax({
        type: "GET",
        url: "/statedata?address=" + data.address,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        success: function(result) {
          $.post(
            "/decryptData",
            { result, deKey },
            (data, textStatus, jqXHR) => {
              $("#name").text(data.user[0]);
              $("#email").text(data.user[1]);
              $("#dob").text(data.user[2]);
              $("#address").text(data.user[3]);
              $("#mobile").text(data.user[4]);
              $("#pincode").text(data.user[5]);
              $("#aadhar").text(data.user[6]);
              $('#voter').text(data.user[8])
			  if (data.status[0]==1) {
          // console.log("STATS INSDE CLIE ",data.status[0] ,data.status[1])
				  $("#status").text("Verifed account ");
				} else {
					$("#status").text(" Not Verifed");
			  }
              $("#public_key").text(data.user[7]);
			  $("#moreData").modal("show");
            },
            "json"
          );
        }
      });
    },
    "json"
  );
};
