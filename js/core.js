window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
	  window.setTimeout(callback, 1000/24);
	};
})();
var webApp = webApp || {};
webApp.App = function(canvasID){
	var canvasID = canvasID || false;
	this.cnv = (typeof canvasID == "string") ? document.getElementById(canvasID) : canvasID;
	if(!canvasID || !this.cnv)
		return false;
	
	this.pos = [0,0];
	this.size = [300,300];
	this.drawItems = {};
	this.start = true;
	this.clickableItems = {};
	this.turn = 0;
	this.mousePos = [];
	this.canvas = (typeof this.cnv.getContext != "undefined" ) ? this.cnv.getContext('2d'): false;
	this.init();
}
webApp.App.prototype = new webApp.Collection("app");
webApp.App.prototype.extend({
	init: function(){
		var self = this;
		if(!this.canvas){
			console.log("Canvas not supported or error loading")
			return false;
		}
		
		this.canvas.setLineDash = this.canvas.setLineDash || function(){};
		
		this.goFullScreen();
		this.setListeners();
	},
	onLoad: function(){
		this.go();
	},
	go: function(){
		var self = this,
			key,len,menu;
		if(!this.start || this.loadQueue == 0){
			return false;
		}
		this.clear();
		this.refresh(this.drawItems);
		
		window.requestAnimFrame(function() {
			self.go();
        });
		this.turn++;
	},
	clear: function(){
		this.canvas.clearRect(0,0,this.cnv.width,this.cnv.height);
		if(typeof this.level != "undefined" && this.level){
			this.canvas.save();
			this.canvas.fillStyle = this.level.color;
			this.canvas.fillRect(0,0,this.cnv.width,this.cnv.height);
			this.canvas.restore();
		}
		
	},
	refresh: function(target){
		var t = (typeof target == "object") ? target : {},
			i,itm;
		for(i in t){
			itm = t[i];
			if(itm instanceof webApp.Drawable){
				itm.go();
			}
		}
	},
	create: function(id,params){
		var id = id || false,
			newP = params || {},
			className,def,type,cons,item;
		type = (id instanceof Array) ? id[0] : id;
		className = this.getClassName(type);
		cons = webApp[className] || false;
		if(!id || !className || !cons)
			return false;
		this.instances++;
		
		
		newP.name = newP.name || className + "_" + this.instances;
		newP.UID = type + "_" + newP.name + "_" + this.instances;
		item = new cons(newP,this);
		this.drawItems[newP.UID] = item;
		this.instances++;
		return item;
	},
	goFullScreen: function(){
		var b = document.body,
			h = document.getElementsByTagName("html")[0],
			self = this;
		
		h.style.height = "100%";
		h.style.width = "100%";
		h.style.padding = "0";
		h.style.margin = "0";
		b.style.height = "100%";
		b.style.width = "100%";
		b.style.padding = "0";
		b.style.margin = "0";
		this.cnv.style.position = "fixed";
		this.cnv.style.zIndex = "100";
		this.resize();
	},
	resources: function(config){
		var conf = config || false,
			self = this,
			itm;
		if(!conf)
			return;
		for(itm in config){
			this.addItem(itm,config[itm]);
		}
	},
	setListeners: function(){
		var self = this;
		window.onresize = function(){self.resize()};
		document.onmousemove = function(event){self.handleMouseMove(event)};
		document.onmousedown = function(event){self.handleClick(event,true)};
		document.onmouseup = function(event){self.handleClick(event,false)};
	},
	handleMouseMove:function(event) {
		event = event || window.event; // IE-ism
		this.mousePos = [Math.round(event.clientX),Math.round(event.clientY)];
	},
	handleClick: function(event,down){
		var pos = [event.clientX,event.clientY],
			down = down || false,
			itm;
		for(itm in this.clickableItems){
			if(down){
				this.clickableItems[itm].clickDown(pos);
			}else{
				this.clickableItems[itm].clickUp(pos);
			}
		} 
	},
	resize: function(){
		var w = document.body.offsetWidth,
			h = document.body.offsetHeight
		this.cnv.width = w;
		this.cnv.height = h;
		this.size = [w,h];
	}
});
