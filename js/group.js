"use strict";
var webApp = webApp || {};
webApp.Group = function (){
	this.items = {};
}
webApp.Group.prototype = new webApp.Object();
webApp.Group.prototype.extend({
	Group: function(items,p,parent){
		var params = p || {};
		var parent   = parent || false;

		// Basic data
		this.canvas   = params.canvas || this.canvas;
		this.name     = params.name || this.name || "item" + Math.random();
		this.UID      = params.UID || "INVALID";
		this.type     = params.type || false;
		this.setParent(parent);

		// Drawing data
		this.pos      = this.validateCoords(params.pos);
		this.size     = this.validateCoords(params.size,[10,10]);
		this.opacity  = (typeof params.opacity != "undefined") ? params.opacity : 1;
		this.color    = params.color || false;
		this.image    = params.image || false;
		this.imagePos = this.validateCoords(params.imagePos);
		this.tile     = params.tile || false;
		
		this.items = {};
		
		for(var itm in items){
			this.generateItems(items[itm],itm);
		}
	},
	generateItems: function(items,type){
		var type = this.getClassName(type),
			i = 0,
			len = items.length || 0,
			cons = webApp[type] || false,
			parent = this,
			i,len,params,className,def,type,cons,item;
		if(!type || !(items instanceof Array))
			return false;
		for(; i < len; i++){
			params = items[i];
			className = this.getClassName(type);
			
			if(!type || !className || !cons)
				return false;
			
			params.name = params.name || type + this.app.instances;
			params.UID = type + "_" + params.name + "_" + this.app.instances;
			item = new cons(params,this);
			item.setParent(parent);
			this.items[item.UID] = item;
			this.app.instances++;
		}
		return item;
	},
	afterRedraw: function(){
		var itm,target;
		for(itm in this.items){
			target = this.items[itm]
			target.go();
		}
	},
	redraw: function(){}
});
