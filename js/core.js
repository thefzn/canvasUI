"use strict";
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
	  window.setTimeout(callback, 1000/24);
	};
})();
var webApp = webApp || {};
webApp.App = function(containerID,size){
	var self = this;
	this.containerID = containerID || false;
	if(!containerID){
		return false;
	}
	
	window.onload = function(){
		self.domLoaded();
	}
	this.preloadQueue = {};
	this.pos = [0,0];
	if(size && size instanceof Array && size.length == 2){
		this.size = size;
		this.fullScreen = false; 
	}else{
		this.size = [300,300];
		this.fullScreen = true;
	}
	this.drawItems = {};
	this.start = true;
	this.clickableItems = {};
	this.resizing = false;
	this.turn = 0;
	this.mousePos = [];
}
webApp.App.prototype = new webApp.Collection("app");
webApp.App.prototype.extend({
	onLoad: function(){
		this.onReady();
		this.go();
	},
	domLoaded: function(){
		var itm, count = 0;
		this.container = (typeof this.containerID == "string") ? document.getElementById(this.containerID) : this.containerID;
		this.container.style.position = "relative";
		this.cnv = document.createElement("canvas");
		this.container.appendChild(this.cnv);
		this.canvas = (typeof this.cnv.getContext != "undefined" ) ? this.cnv.getContext('2d'): false;
		if(!this.canvas){
			return false;
		}
		this.canvas.setLineDash = this.canvas.setLineDash || function(){};
		
		this.goFullScreen();
		this.setListeners();
		
		for(itm in this.preloadQueue){
			count++;
			this.addItem(itm,this.preloadQueue[itm]);
		}
		if(!count){
			this.onLoad();
		}
		
	},
	go: function(){
		var self = this,
			key,len,menu;
		if(!this.start || this.loadQueue == 0){
			return false;
		}
		this.clear();
		this.refresh();
		
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
		var t = this.drawItems || {},
			i,itm;
		for(i in t){
			itm = t[i];
			if(this.resizing){
				itm.appResizing = true;
			}
			itm.go();
		}
		this.resizing = false;
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
		
		if(item instanceof webApp.Object){
			this.drawItems[newP.UID] = item;
		}
		this.instances++;
		return item;
	},
	goFullScreen: function(){
		var b = document.body,
			h = document.getElementsByTagName("html")[0],
			self = this;
		if(!this.fullScreen){
			this.resize();
			return false;
		}
		
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
	preload: function(config){
		var conf = config || false,
			self = this,
			itm;
		if(!conf)
			return;
		this.preloadQueue = conf;
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
		event = event || window.event;
		this.mousePos = [Math.round(event.clientX),Math.round(event.clientY)];
	},
	handleClick: function(event,down){
		var pos = [event.clientX,event.clientY],
			down = down || false,
			itm;
		for(itm in this.clickableItems){
			if(this.clickableItems[itm]){
				if(down){
					this.drawItems[itm].clickDown(pos);
				}else{
					this.drawItems[itm].clickUp(pos);
				}
			}
		} 
	},
	resize: function(){
		var w = document.body.offsetWidth,
			h = document.body.offsetHeight;
		if(!this.fullScreen){
			console.log(this.size);
			this.cnv.width = this.size[0];
			this.cnv.height = this.size[1];
			this.resizing = true;
		}else{
			this.cnv.width = w;
			this.cnv.height = h;
			this.size = [w,h];
			this.resizing = true;
		}
	}
});
