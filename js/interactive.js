"use strict";
var webApp = webApp || {};
webApp.Interactive = function (items,params,parent){
	var p = params || false;
	
	this.dragEnabled = false;
	this.dragging = false;
	this.initial = [0,0];
	this.mInitial = [0,0];
	if(p){
		this.Interactive(items,p,parent);
	}
}
webApp.Interactive.prototype = new webApp.Group();
webApp.Interactive.prototype.extend({
	Interactive:function(items,p,parent){
		var p = p || false;
		this.dragEnabled = p.dragEnabled || false;
		
		this.Group(items,p,parent);
		
		if(this.app){
			this.app.clickableItems[this.UID] = true;
		}
	},
	drag: function(){
		if(this.dragEnabled){
			this.dragEnabled = false;
		}else{
			this.dragEnabled = true;
		}
	},
	click: function(){
		if( typeof this.onClick == "function"){
			this.onClick(this);
		}
	},
	clickDown:function(pos){
		if(this.checkClick(pos)){
			if(this.dragEnabled){
				this.initializeDrag();
			}
		}
	},
	clickUp:function(pos){
		this.terminateDrag();
		if(this.checkClick(pos)){
			this.onClick(this);
		}
	},
	initializeDrag: function(){
		if(!this.app || this.isMoving || this.dragging)
			return false;
		this.app.cnv.style.cursor = "move";
		this.initial = this.pos.slice();
		this.mInitial = this.app.mousePos;
		this.dragging = true;
		
	},
	terminateDrag: function(){
		if(!this.app || !this.dragging)
			return false;
		this.app.cnv.style.cursor = "default";
		this.dragging = false;
	},
	calcDrag: function(){
		var displacement = [],
			newPos = [];
		if(!this.app)
			return false;
		displacement[0] = this.app.mousePos[0] - this.mInitial[0];
		displacement[1] = this.app.mousePos[1] - this.mInitial[1];
		
		newPos[0] = this.initial[0] + displacement[0];
		newPos[1] = this.initial[1] + displacement[1];
		this.moveTo(newPos[0],newPos[1]);
	},
	checkClick: function(pos){
		var res = false
		if(pos[0] >= this.pos[0] && pos[0] <= this.pos[0] + this.size[0]){
			if(pos[1] >= this.pos[1] && pos[1] <= this.pos[1] + this.size[1]){
				res = true;
			}
		}
		return res;
	},
	eachFrame: function(){
		if(this.dragging){
			this.calcDrag();
		}
	},
	// Placeholder
	onClick: function(){}
});
