loginUser = event => {
	event.preventDefault();
	sessionStorage.clear();
	const privateKey = document.getElementById("priv_key").value;
	sessionStorage.setItem("privatekey", privateKey);
	if (!privateKey) {
		alert("Input is empty");
	} else {
		$.post(
			"/getKey",
			{ privateKey },
			(data, textStatus, jqXHR) => {
				sessionStorage.setItem("pub_key", data.publicKey);
			},
			"json",
		);
		window.location.href = "/userPage";
	}
};

postUserData = event => {
	event.preventDefault();
	const name = document.getElementById("name").value;
	const email = document.getElementById("email").value;
	const dob = document.getElementById("dob").value;
	const address = document.getElementById("adderss").value;
	const mobile = document.getElementById("mobile").value;
	const pincode = document.getElementById("pincode").value;
	const aadhar = document.getElementById("aadhar").value;
	const enKey = document.getElementById("enKey").value;
	const privateKey = sessionStorage.getItem("privatekey");
	const pub_key = sessionStorage.getItem("pub_key");
	$.post(
		"/userData",
		{
			privateKey: privateKey,
			pub_key:pub_key,
			name: name,
			email: email,
			dob: dob,
			location: address,
			mobile: mobile,
			pincode: pincode,
			aadhar: aadhar,
			enKey: enKey,
		},
		"json",
	);
};

getUserData = event => {
	event.preventDefault();
	pub_key = sessionStorage.getItem("pub_key");
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
					"Content-Type": "application/json",
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
							$("#pub_key").text(data.user[7]);
							$("#moreData").modal("show");
						},
						"json",
					);
				},
			});
		},
		"json",
	);
};
changePassword = event => {
	event.preventDefault();
	priv_key = sessionStorage.getItem("privatekey");
	oldKey = $("#oldKey").val();
	newKey = $("#newKey").val();
	$.post(
		"/changePassword",
		{ priv_key, oldKey, newKey },
		(data, textStatus, jqXHR) => {
			if (data.msg == 1) {
				alert("Password Changed Successfully");
			} else {
				alert("Password Not Changed");
			}
		},
		"json",
	);
};

$("#decryptKey").on("show.bs.modal", event => {
	const button = $(event.relatedTarget);
	const pub_key = sessionStorage.getItem("pub_key");
	$("#decrypt").attr("data-state", pub_key);
});

document.getElementById("publicKeyOnUserForm").value = sessionStorage.getItem(
	"pub_key",
);
document.getElementById("name").value = "Dennis";
document.getElementById("email").value = "hehe@hihi.in";
let day = new Date();
document.getElementById("dob").value = day.getDay()
console.log(Date.now());

document.getElementById("adderss").value = "it doesnt matter";
document.getElementById("mobile").value = 2255;
document.getElementById("pincode").value = 300303003;
document.getElementById("aadhar").value = 12345678;
var date1 = new Date("4/11/2019");
var date2 = new Date();
var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)); 

alert(diffDays )