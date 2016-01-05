"use strict";
var webApp = webApp || {};
webApp.Object = function (){
	this.app = false;
	this.aData = {};
	this.isMoving = false;
	this.isFadeing = false;
	this.appResizing = false;
	this.links = {};
};
webApp.Object.prototype = {
	go: function(){
		this.calcPosition();
		this.calcFadeing();
		this.beforeRedraw();
		this.eachFrame();
		this.redraw();
		this.afterRedraw();
	},
	validateCoords: function(arr,def){
		var arr = arr || false,
			def = def || [0,0],
			res = false,
			val = true,
			i = 0,
			len;
		if(arr && arr instanceof Array){
			for(len = arr.length; i < len; i++){
				if(typeof arr[i] !== "number"){
					val = false;
					break;
				}
			}
			res = true;
		}
		return (val && res) ? arr : def;
	},
	getClassName: function(rawName){
		var name,fLetter;
		if(typeof rawName != "string" || rawName.length <= 0)
			return false;
		name = (rawName.charAt(rawName.length-1) == "s") ? rawName.substr(1,rawName.length-2) || "" : rawName.substr(1,rawName.length-1);
		fLetter = rawName[0].toUpperCase();
		return fLetter + name;
	},
	validateImage: function(image){
		var img = image || false,
			res;
		return (!img) ? false : (img instanceof Image) ? img : (this.app) ? this.app.get("images",image) : false;
	},
	setParent: function(parent){
		var p = parent || false,
			app;
		if(p instanceof webApp.Object){
			this.parent = p;
			this.container = p.container;
			this.canvas = (parent.canvas && parent.canvas instanceof CanvasRenderingContext2D) ? parent.canvas : false;
			app = (p instanceof webApp.App) ? p : (p.app && p.app instanceof webApp.App) ? p.app : false;
			this.app = app;
		}else{
			this.app = false;
			this.parent = false;
			this.canvas = false;
		}
		if(this.image && !(this.image instanceof Image)){
			this.image = this.validateImage(this.image);
		}
	},
	moveTo: function(x,y,callback){
		var x = (typeof x == "number") ? x : this.pos[0],
			y = (typeof y == "number") ? y : this.pos[1],
			c = callback || function(){};
		this.isMoving = true;
		this.aData.callback = c; 
		this.aData.pos = [x,y];
	},
	fadeIn: function(callback){
		this.isFadeing = true;
		this.aData.fadeCallback = callback || function(){};
		this.aData.opacity = 1;
	},
	fadeOut: function(callback){
		this.isFadeing = true;
		this.aData.fadeCallback = callback || function(){};
		this.aData.opacity = 0;
	},
	calcPosition: function(){
		var res = [],
			ease = 4,
			x,y;
		if(!this.isMoving)
			return false;
		this.aData.pos = this.aData.pos || this.pos;
		if(this.pos[0] == this.aData.pos[0] && this.pos[1] == this.aData.pos[1]){
			this.isMoving = false;
			this.onMove(this);
			return false;
		}
		res[0] = Math.round(this.pos[0] + (this.aData.pos[0]-this.pos[0]) / ease);
		res[1] = Math.round(this.pos[1] + (this.aData.pos[1]-this.pos[1]) / ease);
		if(res[0] == this.pos[0] && res[1] == this.pos[1]){
			this.pos = this.aData.pos;
			this.aData.callback(this);
		}else{
			this.pos = res;
			this.onMove(this);
		}
	},
	calcFadeing: function(){
		var res = 0,
			ease = 5,
			x,y;
		if(!this.isFadeing)
			return false;
		if(this.opacity == this.aData.opacity){
			this.isFadeing = false;
			return false;
		}
		res = this.opacity + (this.aData.opacity - this.opacity) / ease;
		res = Math.round(res * 100) / 100;
		if(res == this.opacity){
			this.opacity = this.aData.opacity;
			this.aData.fadeCallback(this);
		}else{
			this.opacity = res;
		}
	},
	extend: function(obj){
		var self = this,
			meth;
		for(meth in obj){
			self[meth] = obj[meth];
		}
		self = null;
		obj = null
	},
	// Placeholders
	onMove: function(){},
	eachFrame: function(){},
	beforeRedraw: function(){},
	redraw: function(){},
	afterRedraw: function(){}
}
