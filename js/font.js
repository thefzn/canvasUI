var webApp = webApp || {};
webApp.Font = function (font,canvas){
	this.canvas = canvas;
	this.type = "font";
	this.font = font;
	this.tries = 10;
	this.interval = 100;
	this.triesLeft = this.tries;
	this.timeObjt = null;
	this.initial = false;
	this.testText = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
}
webApp.Font.prototype = {
	test: function(){
		var measure = 0,
			self = this,
			loaded = false;
		this.canvas.font = "12px '" + this.font + "', Courier New, serif";
		if(this.tries == this.triesLeft){
			this.initial = this.canvas.measureText(this.testText);
			measure = this.initial;
		}else{
			measure = this.canvas.measureText(this.testText);
		}
		if(this.initial.width == measure.width && this.triesLeft >= 0){
			this.timeObjt = setTimeout(function(){self.test();},this.interval)
		}else{
			if(this.triesLeft <= 0){
				console.log("Error loading " + this.font + " font");
			}
			this.onLoad();
		}
		this.triesLeft--;
	},
	onLoad: function(){
		"Load Completed";
	}
};
