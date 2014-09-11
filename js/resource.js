var webApp = webApp || {};
webApp.Resource = function (canvas,parent,params){
	this.loadingQueue = 0;
	this.pos = [0,0];
}
webApp.Resource.prototype = new webApp.Object();
webApp.Resource.prototype.extend({
	resourceLoaded: function(){
		this.loadingQueue--;
		if(this.loadingQueue <= 0){
			this.loadingQueue = 0;
			this.onLoad(this);
		}
	},
	onLoad: function(){
		"Load Completed";
	},
	loadResource: function(res){
		var self = this;
		this.loadingQueue++;
		if(res instanceof webApp.Resource){
			res.onLoad = function(){
				self.resourceLoaded();
			}
		}else{
			res.addEventListener("load", function() {
				self.resourceLoaded();
			}, false);
		}
		
	}
});
