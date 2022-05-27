// ***************** Update these Properties ***************** //

const sourceDomain = process.env.APP_URL;
const socketioUrl = process.env.SOCKET_SERVER_URL;
const socketioLib = process.env.SOCKET_LIB_URL;

// *********************************************************** //

const localStorageName = 'reachapp_clientid';
const lurl = sourceDomain + 'widget/style.css';
const jurl = sourceDomain + 'widget/vendor.js';

const sendMessageApi = sourceDomain + "api/message/message";
const validateClientApi = sourceDomain + "api/client/validate";


// ***************** Services ***************** //


// Emit message
var sendMessage = (msg) => {
	$.ajax({
		type: "POST",
		url: sendMessageApi,
		contentType: "application/json",
		dataType: 'json',
		data: msg,
		success: function(result) {

			// Do something
			console.log(result);
		}
	});
}


// Checks the website and client id to proceed
var validateClientAndGetWidget = (cid) => {
	return $.ajax({
		type: "POST",
		url: validateClientApi,
		dataType: 'json',
		data: { clientId: cid },
		success: function(data) {
			return data.data;
		},
		fail: function(xhr, textStatus, errorThrown) {
			console.log(errorThrown);
			return null;
		}
	});
}


// Get client id from stored cookies. Geenerate a new one if non existent
var getLocalClientData = () => {
	return localStorage.getItem(localStorageName) ?? 0;
}

// Save client id generated from the server
var setLocalClientData = (cid = null) => {
	localStorage.setItem(localStorageName, cid);
}


// ***************** Chat Widget ***************** //


var generateComponent = (widget, clientName, messages) => {
	var INDEX = 0;
	document.body.innerHTML += widget;

	const socket = io(socketioUrl);
	const room = getLocalClientData();

	socket.emit('join-room', {
		"room": room,
		"username": clientName
	});

	// Message from server. If messaged is whispered, do not generate the line (2nd validation)
	socket.on('message', (msg) => {
        if(!msg.isWhispher){
            generateMessage(msg.body, !msg.isAgent, msg.created_at);
        }	
	});


    // Generate message history
    messages.forEach(msg => {
        generateMessage(msg.body, !msg.isAgent, msg.created_at, true);
    });


	// Trigger click when user pressed enter
	$('#chat-input').keydown(function(e) {
		if (e.keyCode === 13) {
			$("#chat-submit").trigger('click');
		}
	});


	// Send message
	$("#chat-submit").click((e) => {
		e.preventDefault();
		var msg = $("#chat-input").val();

		if (msg.trim() == '') {
			return false;
		}

        var message = {
            'body': msg,
            'isWhispher': false,
            'isAgent': false,
            'senderId': room,
            'clientId': room,
            'createddtm': Date.now()
        }

        sendMessage(message);
		socket.emit('send-message', message);

		generateMessage(msg);
		setTimeout(() => {}, 1000)
	});


	// User opened the widget
	$("#chat-circle").click(() => {
		$("#chat-circle").toggle('scale');
		$(".chat-box").toggle('scale');
	});


	// User closed the widget
	$(".chat-box-toggle").click(() => {
		$("#chat-circle").toggle('scale');
		$(".chat-box").toggle('scale');
	});


	// Render chat message
	function generateMessage(msg, isSelf = true, sentDate = new Date(), isChatHistory=false) {
		INDEX++;
		let dtm = sentDate.toLocaleString();
		let type = isSelf ? 'self' : 'user';
		let sender = isSelf ? `You sent this on ${dtm}` : `Sent by an agent on ${dtm}`
		var str = `<div id='cm-msg-${INDEX}' class="chat-msg ${type}"><div class="cm-msg-text"> ${msg} </div><small>${sender}</small></div>`;

		$(".chat-logs").append(str);
		$("#cm-msg-" + INDEX).hide().fadeIn(isChatHistory ? 0 : 300);

		if (isSelf) {
			$("#chat-input").val('');
		}

		$(".chat-logs").stop().animate({
			scrollTop: $(".chat-logs")[0].scrollHeight
		}, isChatHistory ? 0 : 1000);
	}
};


// ***************** App Setup ***************** //


// Run app upon page load
(function() {

    // Add css style dependency
	var c = document.createElement('link');
	c.rel = 'stylesheet';
	c.type = 'text/css';
	c.href = lurl;
	c.media = 'all';
	document.head.appendChild(c);

	// Add socket.io js dependency
	var socketio = document.createElement("script");
	socketio.src = socketioLib;
	document.head.appendChild(socketio);

	// Add jquery and other dependencies
	if (!window.jQuery) {
		var s = document.createElement("script");
		s.src = jurl;
		document.head.appendChild(s);
	}

    // Send client id from local storage.

    let domainName = document?.title ?? "Unknown Site";
    ;

	setTimeout(() => {	 
        let params = {
            "clientId": getLocalClientData(),
            "domain": domainName
        }

		validateClientAndGetWidget(params).then((result) => {

			// If widget is empty, widget may be unavailable or the client is banned
			if (result && result?.widget && result?.clientId != 0) {
                if(result.isNew) {
                    setLocalClientData(result.clientId);
                }

                let clientName = `${domainName} - ${result.ipAddress}`
                generateComponent(result.widget, clientName, result.messages);
			}
		});
	}, 1000)
})();