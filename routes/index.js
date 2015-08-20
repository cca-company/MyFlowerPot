var express = require('express');
var router = express.Router();

// johnny-five module setting
var five = require("johnny-five");
var board = new five.Board();


// arduino data setting
var light = 0;
var moist = 0;
var lightState = "good";
var moistState = "good";
var freq = 3000;

board.on("ready", function(){
	var moistSensor = new five.Sensor({pin:"A0", freq:freq});
	var lightSensor = new five.Sensor({pin:"A1", freq:freq});

	lightSensor.scale(0,1024).on("data",function(){
		light = Math.floor(this.value/500 * 100);

    	if(light > 70){
    		lightState = "good";
    	}else if(light > 40){
    		lightState = "notbad";
    	}else{
    		lightState = "bad";
    	}

		console.log('light :'+ light + ' [' + lightState + ']');
	});

	moistSensor.scale(0,1024).on("data",function(){
		moist = Math.floor(this.value/200 * 100);

    	if(moist > 100){
    		moistState = "overdose";
    	}else if(moist > 70){
    		moistState = "good";
    	}else if(moist > 40){
    		moistState = "notbad";
    	}else{
    		moistState = "bad";
    	}
    	

		console.log('moist :'+ moist + ' [' + moistState + ']');
	});

});

/* GET home page. */
router.get('/', function(req, res, next) {
 	res.render('index', {
 		title : "Express",
 		light : light,
 		moist : moist
 	});
});

router.get('/data', function(req, res, next){
	console.log('request...');
	res.writeHead(200,{'Content-type':'application/json'});
	res.write('{"light":'+light+',"moist":'+moist+',"lightState":"'+lightState+'","moistState":"'+moistState+'"}');
	res.end();
});

module.exports = router;
