// Valid invite code hashes (replace these with MD5 hashes of actual invite codes)
const validHashes = [
    // '5d41402abc4b2a76b9719d911017c592', // Example hash for "hello"
    // '098f6bcd4621d373cade4e832627b4f6',  // Example hash for "test"
    'c4ca4238a0b923820dcc509a6f75849b'
];

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
    var invites = [jsonData.invited_0.toString(),jsonData.invited_1.toString(),jsonData.invited_2.toString(),jsonData.invited_3.toString(),jsonData.invited_4.toString(),jsonData.invited_5.toString()];
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
      const response = await fetch(`https://script.google.com/macros/s/AKfycbyIxbUTQmaqFIRzTCkpBYBkGYSLNPjLxxcb0z-rzGaDiTc3nK_v_aMSqdH_gUbd24pQ/exec?invite_code=${inviteCodeInput.toString()}`);
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

    // If "Yes" is selected, make the input field required
    if (rsvp_yes.className.includes('active')) {
        inputField.required = true;
        // inputField2.required = true;
    } else {
        inputField.required = false;
        // inputField2.required = false;
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
        const response = await fetch(`https://script.google.com/macros/s/AKfycbyIxbUTQmaqFIRzTCkpBYBkGYSLNPjLxxcb0z-rzGaDiTc3nK_v_aMSqdH_gUbd24pQ/exec?${queryString}`, {
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
