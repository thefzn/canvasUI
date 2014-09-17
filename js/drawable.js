"use strict";
var webApp = webApp || {};
webApp.Drawable = function (params,parent){
	var p = params || false;
	if(p){
		this.Drawable(p,parent);
	}
}
webApp.Drawable.prototype = new webApp.Object();
webApp.Drawable.prototype.extend({
	Drawable:function(params,parent){
		var params = params || {};
		var parent   = parent || false;
		this.setParent(parent);

		// Basic data
		this.canvas   = params.canvas || this.canvas;
		this.name     = params.name || this.name || "item" + Math.random();
		this.UID      = params.UID || "INVALID";
		this.fixed    = params.fixed || false;
		this.type     = params.type || false;

		// Drawing data
		this.pos      = this.validateCoords(params.pos);
		this.size     = this.validateCoords(params.size,[10,10]);
		this.opacity  = (typeof params.opacity != "undefined") ? params.opacity : 1;
		this.color    = params.color || false;
		this.image    = params.image || false;
		this.imagePos = this.validateCoords(params.imagePos);
		this.tile     = params.tile || false;
	},
	redraw: function(){
		if(!this.canvas)
			return false;
		var posX,posY,pat,i,len,coord,style,size,offset,map;
		this.canvas.save();
		if(this.opacity != 1){
			this.canvas.globalAlpha = (this.parent) ? this.opacity * this.parent.opacity : this.opacity;
		}
		if(this.parent && !this.fixed){
			posX = this.pos[0] + this.parent.pos[0];
			posY = this.pos[1] + this.parent.pos[1];
		}else{
			posX = this.pos[0];
			posY = this.pos[1];
		}
		if(this.color || (this.tile && this.image)){
			pat = (this.tile && this.image) ? this.canvas.createPattern(this.image,'repeat') : false;
			this.canvas.fillStyle = pat || this.color;
			this.canvas.fillRect(
				posX,
				posY,
				this.size[0],
				this.size[1]
			);
		}
		if(this.image && !this.tile){
			this.canvas.drawImage(
				this.image,
				this.imagePos[0],
				this.imagePos[1],
				this.size[0],
				this.size[1],
				posX,
				posY,
				this.size[0],
				this.size[1]
			);
		}
		this.canvas.restore();
	}
});
