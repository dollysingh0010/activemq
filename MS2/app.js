var express     = require('express')
var app         = express();
const stompit   = require('stompit')
var activeMQConnect = null;
var fs = require('fs')

// Creating Node JS Server and Connecting to Active MQ
app.listen(4001, function() {
    //setInterval(function(){
        connectActiveMQ(function(connecResp) {
            if(!connecResp.success) {
                console.log("Connection Failed to Active MQ");
            } else {
                activeMQConnect = connecResp.connec;
                console.log("connection success with activeMQ")
                subscribe('test')
            }
        })
    //},1000)
})

function connectActiveMQ(cb) {
	const connectOptions = {
		'host': 'localhost',
		'port': 61613
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

// Subscribe ActiveMQ
function subscribe(dest) {
    console.log("Inside subscribe method in mS2")
    activeMQConnect.subscribe({ destination: dest , ack: 'client-individual'}, (err, msg) => {
        if(err) {
            console.log("error in msg reading in MS2--->",msg)
        }
        msg.readString('UTF-8', (err, body) => {
            console.log("message",JSON.parse(body))
            fs.appendFile('ms2.txt',body+"\n", function (err) {
                if (err) throw err;
                console.log('added in file');
                console.log("Inside setTimeout")
                activeMQConnect.ack(msg);                
            });
           
            })
        })

    
}


// // send acknowledge after some time after all task done 
// function subscribe(dest) {
//     console.log("Inside subscribe method in mS2")
//     activeMQConnect.subscribe({ destination: dest , ack: 'client-individual'}, (err, msg) => {
//         if(err) {
//             console.log("error in msg reading in MS2--->",msg)
//         }
//         msg.readString('UTF-8', (err, body) => {
//             console.log("message",JSON.parse(body))
//             fs.appendFile('ms2.txt',body+"\n", function (err) {
//                 if (err) throw err;
//                 console.log('added in file');
//                 setTimeout(function(){
//                 console.log("Inside setTimeout")
//                 activeMQConnect.ack(msg);
//                 //activeMQConnect.disconnect();

//                 },25000)
                
//             });
           
//             })
//         })

    
// }
