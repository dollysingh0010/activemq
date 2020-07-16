var express     = require('express')
var app         = express();
var bodyParser  = require('body-parser')
const stompit   = require('stompit')
var activeMQConnect = null;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Creating Node JS Server and Connecting to Active MQ
app.listen(3000, function() {
	connectActiveMQ(function(connecResp) {
		if(!connecResp.success) {
			console.log("Connection Failed to Active MQ");
		} else {
			activeMQConnect = connecResp.connec;
		}
	})
})

// Creating Connection To Active MQ
function connectActiveMQ(cb) {
	const connectOptions = {
		'host': 'localhost',
		'port': 61613,
		
	};
	  
	stompit.connect(connectOptions, function(error, client) {
		if (error) {
			console.log('connect error ' + error.message);
		  	return cb({success: true});
		} else {
			return cb({success: true, connec: client})
		}
	})
}

// Writing Messages To Active MQ
function writeOnMessageQueue(msg) {
	console.log("msg is - ",msg)
	return new Promise(function(resolve, reject) {
		const sendHeaders = {
			'destination': '/queue/test',
			'content-type': 'application/json',
			'persistent': true //To make message persistent
		};
		
		msg.time = Number(new Date());

		console.log("msg is - ",msg)

		if(!activeMQConnect) {
			console.log("Active MQ not Connected")
			return reject("Active MQ not Connected");
		}
		
		const frame = activeMQConnect.send(sendHeaders);
		frame.write(JSON.stringify(msg));
		frame.end();
		return resolve("Success");
	})
}


app.post("/api/writeData", function(req, res) {
	console.log("res.body is - ",req.body);

	writeOnMessageQueue(req.body).then(function(msgRes) {
		return res.send(msgRes)
	}).catch(function(err) {
		return res.send(err)
	})
})

