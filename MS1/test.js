var request = require('request');
//const { v4: uuidv4 } = require('uuid');


var url = "http://localhost:3000/api/writeData";
var i=0;
setInterval(function(){
    var body = {
        "id": i++,
        "serviceName"   : "S1",
        "logMessage"    : "this is a error",
        "logType"       : "ERROR",
        "date"      : new Date()
    }
    request.post({url:url, form:body}, function (e, r, body) {

        console.log("api completed",body)
    });

},200)