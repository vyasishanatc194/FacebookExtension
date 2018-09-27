/*
 * send_message.js - send message to facebook friend using API
 * ===============================================
 *
 * By Ishan Vyas, ishan@qbix.com
 *
 * Version 1.0, Thu Sep 27 2018
 *
 */
class sendMessage {
  constructor(uid, msg) {
    this.uid = uid;
    this.msg =  msg;
  }
  /*
  * sendingMessage is methos of API which call the Facebook's Messages/thread page with friend's profile id
  * And as response it will get the HTML of page and needed elements, that elements are used as an argument in next ajax call,
  * which is call to send meesage.
  * The Parameters are as below:
  * tids: [user profile id with friend's profile id]
  * wwwupp: [C3]
  * ids[100000563094539]:  [friend's profile id]
  * body: [message which user typed]
  * waterfall_source:  [type: message]
  * action_time: 1537883845421
  * m_sess: [in hidden field]
  * fb_dtsg: [in hidden field]
  * jazoest: [in hidden field]
  */
  sendingMessage() {
  	var msg = this.msg;
    var xhr = new XMLHttpRequest();
	xhr.onloadend = function() {
	  	var dataString = "tids="+this.responseXML.getElementsByTagName('input')[2].value+"&wwwupp="+this.responseXML.getElementsByTagName('input')[3].value+"&ids%5B"+this.responseXML.getElementsByTagName('input')[4].value+"%5D="+this.responseXML.getElementsByTagName('input')[4].value+"&body="+msg+"&waterfall_source=message&action_time=1537874300585&m_sess=&fb_dtsg=AQEMGs9htH9y%3AAQHfUAzojIdi&jazoest="+this.responseXML.getElementsByTagName('input')[1].value+"&__dyn=1KQdAmmcwgVU-4UpwDF3FQ8xPKl3onxG6UO3m6EC5UfQE6C7UW1DxW1qw824o5K0JUe8hwem0JoeoK2O1gCwSxu0BU3JxO1ZxObwOwWwt8OE5m0hyeKdwbK&__req=7h&__ajax__=AYllYsv7OhR4NjQ90AfxawepFIc7DWmSNAQXj8OW5aMPtbn_Az0e5hQOkeHmAgOsVXfWzhx4jb5CpSSEYT7p_SRyq-xtL7oniiiOhqqTXJu1cA";
 	 	$.ajax({
		    type: "POST",
		    url: "https://mobile.facebook.com/messages/send/?icm=1&refid=12",
		    data: dataString,
		    cache: false,
		    success: function(html) {
		    	alert("Message sent successfully");
				$("#dataMsg")[0].value = '';
		    },
		    error: function (error) {
			    console.log('error; ' + eval(error));
			}
	  	});
	}
	xhr.open("GET", "https://mobile.facebook.com/messages/thread/"+ this.uid);
	xhr.responseType = "document";
	xhr.send();
  }
}


