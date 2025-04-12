// Valid invite code hashes (replace these with MD5 hashes of actual invite codes)
const validHashes = [
    // '5d41402abc4b2a76b9719d911017c592', // Example hash for "hello"
    // '098f6bcd4621d373cade4e832627b4f6',  // Example hash for "test"
    '20d5461a6abf0a9fed2cc3d2ea106080',
    'e10adc3949ba59abbe56e057f20f883e',
    '0649da1a8d95c452067cccd8a046b793',
    '1e97fe1dc44100469eb2e91b3dba7b76',
    'c3e109f833f540298eb3d2629d0ba27d',
    '5347ffec74fbd2f6b8b2928304cf22c9',
    '2040316e990814c79fbf262fed7312a1',
    '5f3b9ea25e2570a5d8dc2942d6e376a1',
    '5f49072249e558992cff7ba8ed1d997e',
    '29e56673f1adaae93eff7e65171309b7',
    '96bb83ea44207149a01c72c27eba1be4',
    'f7b746c5f3d07468fcbc283f2cf53f70',
    '61eac705d9d60674c7fe625ed115f3d4',
    '7e53d38432bd60297d933a008630f396',
    '889d58a2589a1bb98a9e7f04c9b200d0',
    'd78ee9d469078ad941cf0a0db58e0c7c',
    'ca535a8a39ab16532e8a17f51f852e13',
    'ad65dd2980c916723fda51d6123ae6e7',
    'c197db31c5fbfd49fd80748c1e4cc841',
    'b29a2a3c60be46649d171b5c2962b0fc',
    '258f60ff9a736cbec0f553d4ab3dd2c1',
    '31de309a83373e043ed8d067430efa1b',
    '382f70b705ac174e3f3a38c813e6ed95',
    'e607ab3a7c551effca521c09b8b50e45',
    '269b98a598036d48ca6c2bd7f18b287d',
    '996ef461dd6c09f1747f1508278076a5',
    'bfe67cf2e2349bc5ae0b802f37d70305',
    '6f88440bbf4c1f684f6883f623cd6ea4',
    '2505c2449554d7dbbdf76cbf51a2ec96',
    '50ab128b29580cf9c5ad718c7181664a',
    '3d4c982b7c9eac940875e2ac101f6125',
    'f9941680c2a483a4df6cd11b845086d4',
    'f0977c9c8736b90d764a19f8d57cc1fa',
    'e3dfcf760e1e3c0bdebcc9775265c15f',
    'a061f2a93b1d3c6d52f2a33813d9872f',
    '31165517951d2714c8dbccaa8408b476',
    'a6b7f92169be71e7728741911390fee6',
    '551ed2c20937885b2dcb409fde1b4b50',
    '7dabaa6e2a2a3eb81ef742a8df0cab59',
    'aea9b328a222092e30163f678ebe4d29',
    'cde96b85179d99718f4a8e2b729a9408',
    'd0583f8267534ab35e65527140dcb0e6',
    '39c9d87c27d8bd16ec4ded67f505c183',
    '8bcfbc26d831529e09043d0b0e0c46d8',
    '35793632bb32471b397a85226d7ca9b0',
    'ddfeea385b89a72fff0e177662bbe746',
    '273ff30af54cac51ba17a84f78567e01',
    '9e721679a24d6f2aca8dbff87d3f2a53',
    '3d423efc6558173d7ff8bb5f31232980',
    'c5d6dc3e388699233cb4d6e0582b3bf7',
    '720533e08903cad49bfec0d88925b624'
];
const baseURL = "https://script.google.com/macros/s/AKfycbx9WA8r0hZhOtelVODzHbtMl41xtQyPukvolPbiTIhWkr56rRpxTmezAYYxce9WNEhiGg/exec";

async function verifyCode(event) {
    event.preventDefault();

    const inviteCodeInput = document.getElementById('invite_code').value.trim();
    const hashedCode = CryptoJS.MD5(inviteCodeInput).toString();

    document.getElementById('rsvp_yes_calendar').style.display = 'none';

    if (validHashes.includes(hashedCode)) {
        // Show the additional details form if the invite code is correct
        document.getElementById('response_message').innerHTML = "<strong>Validating...</strong> One moment, please.";
        await getSheetsApi(inviteCodeInput);
        document.getElementById('rsvpDetailsForm').style.display = 'block';
        document.getElementById('response_message').innerHTML = "<strong>Code validated!</strong> Please provide additional details below.";
        document.getElementById('retrieve_invite').style.display = 'none';
    } else {
        // Display an error message if the invite code is incorrect
        document.getElementById('response_message').innerHTML = "<strong>Sorry!</strong> Your invite code is incorrect.";
    }
}


async function submitRsvp(event) {
    event.preventDefault();
    
    if (!document.getElementById('rsvp').value) {
        document.getElementById('submit_message').innerHTML = '<strong>Error!</strong> Please make an RSVP selection using the buttons above.';
        document.getElementById('rsvp_yes').style.border = "2px solid red";
        document.getElementById('rsvp_no').style.border = "2px solid red";
        return;
    }

    document.getElementById('submit_message').innerHTML = "";

    const inviteCodeInput = document.getElementById('invite_code').value.trim();
    const hashedCode = CryptoJS.MD5(inviteCodeInput).toString();
    
    const form = new FormData(document.getElementById('rsvpDetailsForm'));
    var data = Object.fromEntries(form.entries());
    // form = $('#rsvpDetailsForm');
    // data = data + "&" + form.serialize();
    data.invite_code = inviteCodeInput;
    // console.log(data);


    if (validHashes.includes(hashedCode)) {
        document.getElementById('rsvpDetailsForm').style.display = 'none';
        document.getElementById("fh5co-rsvp").scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("fh5co-rsvp").focus();
        document.getElementById('response_message').innerHTML = "<strong>Submitting...</strong> Please don't leave this page.";
        document.getElementById('retrieve_invite').style.display = 'inline';
            
        var response = await postSheetsApi(inviteCodeInput, data);
        // console.log( );
        if (response.result = "success") {
            // window.onload = function() {
            // };
            document.getElementById('response_message').innerHTML = '<strong>Submitted!</strong> Your response has been recorded.';
            if (document.getElementById('rsvp_yes').className.includes('active')) {
                document.getElementById('rsvp_yes_calendar').style.display = 'inline';
            }
            document.getElementById('rsvpDetailsForm').reset();
            document.getElementById('rsvp-form').reset();
            document.querySelectorAll('.toggle-button').forEach(btn => btn.classList.remove('active'));
        }
        else {
            document.getElementById('submit_message').innerHTML = '<strong>Error!</strong> Your response has not been recorded. Try again soon.';
        }
    } else {
        // Display an error message if the invite code is incorrect
        document.getElementById('submit_message').innerHTML = "<strong>Error.</strong> Your invite code is incorrect.";
        document.getElementById('retrieve_invite').style.display = 'inline';
    }

    
    
}


async function getSheetsApi(inviteCodeInput) {

    // const url = ("https://script.google.com/macros/s/AKfycbx4wUFuSqk3XYt86SHcD-VhbGrg8_doZRBro9f0bolxYFmB2Ks7ZAyN_pI6DjXFmLAgWw/exec?invite_code=", inviteCodeInput.toString());

    var jsonData = await getData(inviteCodeInput);
    // console.log(jsonData);
    // let response2;
    // fetch(url)
    //     .then(response => {response.json(); response2 = response;})
    //     .then(data => jsonData = data);
    // document.getElementById('information_message').innerHTML = jsonData;
    if (jsonData.formal_name.toString() !== "") {
        document.getElementById('information_message').innerHTML = 
        `<h2>${jsonData.formal_name.toString()},<br></h2>` +
        `<h3>Welcome to Our Wedding<br></h3>` + 
        `<div class="col-md-8 col-md-offset-2"><p>It is our honor to invite you, along with the esteemed guest(s) listed below, to share in this special day with us. Select your RSVP response below.<br>&#8212;<br>` +
        `Kindly indicate the guest(s) for whom you are responding. If desired, enter their contact information to receive event updates.<br></p>&#8595</div>`;
        document.getElementById('information_message').style.display = 'inline';
        document.getElementById('full_name').style.display = 'inline-flex';
        document.getElementById('email').style.display = 'inline-flex';
        document.getElementById('phone').style.display = 'inline-flex';
        document.getElementById('rsvp_yes').style.display = 'inline-flex';
        document.getElementById('rsvp_no').style.display = 'inline-flex';
        document.getElementById('radio_buttons').style.display = 'inline-flex';
    } 
    // document.getElementById('response_message').innerHTML = `<strong>Success!</strong> Please provide additional details below.`;
    var invites = [jsonData.invited_0.toString(),jsonData.invited_1.toString(),jsonData.invited_2.toString(),jsonData.invited_3.toString(),jsonData.invited_4.toString(),jsonData.invited_5.toString(),jsonData.invited_6.toString()];
    for (var i = 0; i < parseInt(jsonData.number_invited); i++) {
        if (invites[i] !== "" && invites[i] !== undefined) {
            // document.getElementById('guests').innerHTML = document.getElementById('guests').innerHTML +
            //                         `<div id="checkbox${i}" class="row">` +
			// 							`<input type="checkbox" id="invited_${i}" name="invited_${i}" class="bottom_margin animate-box" value="invited_${i}" onclick="showForm(this)">` +
			// 							`<label for="invited_${i}" class="bottom_margin animate-box" >${invites[i]}</label>` +
			// 							`<div id="checkbox${i}-1" class="animate-box" >` +
			// 								`<input type="email${i}" id="email${i}" name="email${i}" placeholder="Email (optional)" class="bottom_margin">` +
			// 								`<input type="phone${i}" id="phone${i}" name="phone${i}" placeholder="Phone (optional)" class="bottom_margin"><br>` +
			// 							`</div>` +
			// 						`</div>`;
            
            document.getElementById(`checkbox${i}`).style.display = 'inline';
            document.querySelector(`label[for="invited_${i}"]`).innerText = invites[i];
            // if(invites[i] == "+1") {
            //     document.getElementById(`name${i}`).style.display = 'inline';
            //     document.getElementById(`name${i}`).required = true;
            // }
        }
    }


}

async function getData(inviteCodeInput) {
    try {
      const response = await fetch(`${baseURL}?invite_code=${inviteCodeInput.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
    //   console.log(data);
      return data;
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }


async function toggleRequiredField(button) {
    // Prevent form from submitting on click
    event.preventDefault();

    // Toggle selection
    let buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Update rsvp input value
    document.getElementById('rsvp').value = button.getAttribute('value');
    
    var rsvp_yes = document.getElementById('rsvp_yes');
    // var inputField1 = document.getElementById('full_name');
    var inputField = document.getElementById('phone');
    var inputField2 = document.getElementById('email');

    // If "Yes" is selected, make the input field required
    if (rsvp_yes.className.includes('active')) {
        inputField.required = true;
        inputField2.required = true;
    } else {
        inputField.required = false;
        inputField2.required = false;
    }
}


function showForm(checkbox) {
    var checkboxFormId = document.getElementById(checkbox.parentElement.id + "-1")
    var id = checkbox.id.substring(checkbox.id.length-1);
    if (document.getElementById(checkbox.id).checked) {
        checkboxFormId.style.display = 'block';
        if (document.querySelector(`label[for="invited_${id}"]`).innerText == "+1 guest") {
            document.getElementById("name" + id).required = true;
            document.getElementById("name" + id).style.display = 'inline';
        }
    }
    else {
        checkboxFormId.style.display = 'none';
        if (document.querySelector(`label[for="invited_${id}"]`).innerText == "+1 guest") {
            document.getElementById("name" + id).required = false;
            document.getElementById("name" + id).style.display = 'none';
        }
    }
}


async function postSheetsApi(inviteCodeInput, data) {
    const queryString = new URLSearchParams(data).toString();
    try {
        const response = await fetch(`${baseURL}?${queryString}`, {
            method: 'POST',
        });

        // Check if the response status is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }


        // Parse the JSON response
        const result = await response.json();
        return result; // Return the result
    } catch (error) {
        console.error('Error posting data:', error);
        throw error; // Rethrow the error to be handled by the caller if needed
    }
}


// /********************** RSVP **********************/
// $(document).ready(function () {
// 	$('#rsvp-form').on('submit', function (e) {
//     e.preventDefault();
//     var data = $(this).serialize();

//     $('#alert-wrapper').html(alert_markup('info', '<strong>Just a sec!</strong> We are saving your details.'));

//     if (MD5($('#invite_code').val()) !== 'c4ca4238a0b923820dcc509a6f75849b'
//         && MD5($('#invite_code').val()) !== 'c4ca4238a0b923820dcc509a6f75849b') {
//         $('#alert-wrapper').html(alert_markup('danger', '<strong>Sorry!</strong> Your invite code is incorrect.'));
//     } else {
//         $.post('https://script.google.com/macros/s/AKfycbzUqz44wOat0DiGjRV1gUnRf4HRqlRARWggjvHKWvqniP7eVDG-/exec', data)
//             .done(function (data) {
//                 console.log(data);
//                 if (data.result === "error") {
//                     $('#alert-wrapper').html(alert_markup('danger', data.message));
//                 } else {
//                     $('#alert-wrapper').html('');
//                     $('#rsvp-modal').modal('show');
//                 }
//             })
//             .fail(function (data) {
//                 console.log(data);
//                 $('#alert-wrapper').html(alert_markup('danger', '<strong>Sorry!</strong> There is some issue with the server. '));
//             });
//     }
// });
// });
