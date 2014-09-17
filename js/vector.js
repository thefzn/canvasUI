"use strict";
var webApp = webApp || {};
webApp.Vector = function (params,parent){
	var p = params || false;
	if(p){
		this.Vector(p,parent);
	}
}
webApp.Vector.prototype = new webApp.Object();
webApp.Vector.prototype.extend({
	Vector:function(params,parent){
		var params = params || {};
		var parent   = parent || false;
		this.setParent(parent);

		// Basic data
		this.canvas   = parent.canvas || this.canvas;
		this.name     = params.name || "item" + Math.random();
		this.UID      = params.UID || "INVALID";
		this.pos      = params.pos || [0,0];

		// Drawing data
		this.opacity  = (typeof params.opacity != "undefined") ? params.opacity : 1;
		this.color    = params.color || false;
		this.tile     = params.tile || false;
		this.size     = params.size || [10,10];
		this.coords   = params.coords || [];
		this.radius   = (typeof params.radius == "number") ? params.radius : 5;
		this.circle   = params.circle || {};
		this.line     = params.line || false;
		this.fill     = params.fill || false;
		this.type     = params.type || "line";
	},
	drawPolygon:function(adjust){
		var adjust = adjust || 0,
			i, len, coord;
		this.canvas.moveTo(this.coords[0][0] + adjust + this.pos[0],this.coords[0][1] + adjust + this.pos[1]);
		for(i = 1, len = this.coords.length; i < len; i++){
			coord = this.coords[i];
			this.canvas.lineTo(coord[0] + adjust + this.pos[0], coord[1] + adjust + this.pos[1]);
		}
	},
	drawCircle: function(){
		var circle = {
				start: this.circle.start || 0,
				end:   this.circle.end || Math.PI * 2,
				dir:   this.circle.dir || false
			}
		this.canvas.arc(this.coords[0], this.coords[1], this.radius, circle.start, circle.end, circle.dir);
	},
	drawRectangle: function() {
		var x = this.pos[0],
			y = this.pos[1],
			width = this.size[0],
			height = this.size[1],
			radius = this.radius;
		this.canvas.beginPath();
		this.canvas.moveTo(x + radius, y);
		this.canvas.lineTo(x + width - radius, y);
		this.canvas.quadraticCurveTo(x + width, y, x + width, y + radius);
		this.canvas.lineTo(x + width, y + height - radius);
		this.canvas.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		this.canvas.lineTo(x + radius, y + height);
		this.canvas.quadraticCurveTo(x, y + height, x, y + height - radius);
		this.canvas.lineTo(x, y + radius);
		this.canvas.quadraticCurveTo(x, y, x + radius, y);
		this.canvas.closePath();
	},
	redraw: function(){
		if(!this.canvas)
			return false;
		var adjust,style,size,offset,map,space,pat;
		this.canvas.save();
		if(this.opacity != 1){
			this.canvas.globalAlpha = (this.parent) ? this.opacity * this.parent.opacity : this.opacity;
		}
		this.canvas.beginPath();
		if(this.line){
			style = this.line.style || "line";
			size = this.line.size || 1;
			space = this.line.space || 2;
			adjust = (this.line.size % 2 == 0) ? 0 : 0.5;
			this.canvas.lineWidth = size;
			if(this.color){
				this.canvas.strokeStyle = this.color;
			}
			if(style == "dashed"){
				this.canvas.setLineDash([size*space]);
			}
		}
		if(this.fill){
			if(this.color || (this.tile && this.image)){
				pat = (this.tile && this.image) ? this.canvas.createPattern(this.image,'repeat') : false;
				this.canvas.fillStyle = pat || this.color;
			}
		}
		switch(this.type){	
			case "circle":
				this.drawCircle(adjust);
			break;
			case "rectangle":
				this.drawRectangle(adjust);
			break;
			default:
				this.drawPolygon(adjust);
		}
		if(this.line){
			this.canvas.stroke();
		}
		if(this.fill){
			this.canvas.fill();
		}
		this.canvas.restore();
	}
});
