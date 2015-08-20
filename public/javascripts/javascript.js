var timer;
var freq = 3000;

var MyFlowerPot = {
	moist : 0,
	light : 0,
	moistState : "good",
	lightState : "good",
	init : function(){
		this.getData(this.setData);
		timer = setInterval(this.getData,freq,this.setData);
	},
	getData : function(callback){
		$.ajax({
			url : "/data",
			method : "GET",
			data : null,
			dataType : "json"
		}).done(function(data){
			callback(data);
		}).fail(function( jqXHR, textStatus ) {
		  	console.log( "Request failed: " + textStatus );
		  	clearInterval(timer);
		});
	},
	setData : function(data){
		var moist = data.moist;
		var light = data.light;
		var moistState = data.moistState;
		var lightState = data.lightState;

        if(MyFlowerPot.moist != moist){
        	MyFlowerPot.moist = moist;
        	$("#moist-value").text(moist + "%");
        }

        if(MyFlowerPot.light != light){
        	MyFlowerPot.light = light;
        	$("#light-value").text(light + "%");
        }

        if(MyFlowerPot.moistState != moistState){
        	MyFlowerPot.changeMoist(moistState);
        }

        if(MyFlowerPot.lightState != lightState){
        	MyFlowerPot.changeLight(lightState);
        }
	},
	changeMoist : function(state){
		var set = {
			overdose : {
				text : "화분에 물을 너무 많이 주었습니다",
				gradient : [[137,95,203], [72,127,236]]
			},
			good : {
				text :  "화분에 물을 주었습니다",
				gradient : [[83,226,255], [72,127,236]]
			},
			notbad : {
				text : "수분이 적당합니다",
				gradient : [[83,255,163], [72,127,236]]
			},
			bad : {
				text : "화분에 물을 주세요!",
				gradient : [[83,255,163], [254,94,107]]
			}
		};

		var currentState = MyFlowerPot.moistState;
		MyFlowerPot.moistState = state;

		$("#moist-text").text(set[state].text);
		changeBG.animate(set[currentState].gradient, set[state].gradient);
	},
	changeLight : function(state){
		var set = {
			good : {
				text : "채광량이 적당합니다",
				icon : ""
			},
			notbad : {
				text : "이정도면 나쁘지 않네요",
				icon : ""
			},
			bad : {
				text : "좀 더 빛이 필요합니다",
				icon : ""
			}
		};

		$("#light-text").text(set[state].text);
	},
};

var changeBG = {
	animateTimer : null,
	addColor : [[0,0,0],[0,0,0]],
	gradientFrom : [[0,0,0],[0,0,0]],
	gradientTo : [[0,0,0],[0,0,0]],
	speed : 500,
	freq : 1000/30,
	maxframe : 0,
	currentFrame : 0,
	animate : function(gradientFrom, gradientTo){
		this.frame =  Math.round(this.speed/this.freq);
		this.currentFrame = 0;

		for(var i = 0; i < 2; ++i){
			for(var j=0; j < 3; ++j){
				this.gradientFrom[i][j] = gradientFrom[i][j];
				this.gradientTo[i][j] = gradientTo[i][j];
				this.addColor[i][j] = Math.round((this.gradientTo[i][j] - this.gradientFrom[i][j]) / (this.frame));
			}
		}
		this.animateTimer = setTimeout(this.timeoutAction, this.freq, this.gradientFrom);
	},
	timeoutAction : function(gradient){
		changeBG.animateTimer = clearTimeout();

		for(var i = 0; i < 2; ++i){
			for(var j=0; j < 3; ++j){
				gradient[i][j] += changeBG.addColor[i][j];
			}
		}

		if( changeBG.currentFrame >= changeBG.frame){
			for(var i = 0; i < 2; ++i){
				for(var j=0; j < 3; ++j){
					gradient[i][j] = changeBG.gradientTo[i][j];
				}
			}
		}else{
			changeBG.currentFrame++;
			changeBG.animateTimer = setTimeout(changeBG.timeoutAction, changeBG.freq, gradient);
		}

		var rgbFrom = "rgb("+gradient[0][0]+","+gradient[0][1]+","+gradient[0][2]+")";
		var rgbTo = "rgb("+gradient[1][0]+","+gradient[1][1]+","+gradient[1][2]+")";

		$("body").css({
			"background-image" : "linear-gradient("+ rgbFrom +", "+ rgbTo +")"
		});
	}
}

MyFlowerPot.init();