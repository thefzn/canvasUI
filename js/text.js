"use strict";
var webApp = webApp || {};
webApp.Text = function (params,parent){
	var p = params || false;
	if(p){
		this.Text(p,parent);
	}
}
webApp.Text.prototype = new webApp.Object();
webApp.Text.prototype.extend({
	Text:function(params,parent){
		var params = params || {};
		var parent   = parent || false;
		this.setParent(parent);

		// Basic data
		this.canvas   = parent.canvas || this.canvas;
		this.name     = params.name || "item" + Math.random();
		this.UID      = params.UID || "INVALID";
		this.type     = params.type || false;
		this.pos      = params.pos || [0,0];

		// Drawing data
		this.opacity  = (typeof params.opacity != "undefined") ? params.opacity : 1;
		this.color    = params.color || "black";
		this.line     = params.line || false;
		this.tile     = params.tile || false;
		this.size     = params.size || 12;
		this.align    = params.align || "center";
		this.font     = params.font || "Arial";
		this.style    = params.style || false;
		this.text     = params.text || "";
		this.spacing  = params.spacing || 2;
	},
	redraw: function(){
		var i = 0,
			s = this.size + this.spacing,
			parentOp = (this.parent && typeof this.parent.opacity) ? this.parent.opacity : 1,
			text, len, w, c, style;
		if(!this.canvas)
			return false;
		this.canvas.save();
		if(this.opacity != 1 || parentOp != 1){
			this.canvas.globalAlpha = (this.parent) ? this.opacity * this.parent.opacity : this.opacity;
		}
		style = (this.style) ? this.style + " " : "";
		this.canvas.fillStyle = this.color;
		this.canvas.font = style + "" + this.size + "px " + this.font + ", Arial";
		this.canvas.textAlign = this.align;
		text = (typeof this.text == "string") ? [this.text] : this.text;
		for(len = text.length; i < len; i++){
			if(this.line){
				w = this.line.width || 2;
				c = this.line.color || "black";
				this.canvas.strokeStyle = c;
				this.canvas.lineWidth = w;
				this.canvas.strokeText(text[i], this.pos[0], this.pos[1] + (s * i));
			}
			this.canvas.fillText(text[i], this.pos[0], this.pos[1] + (s * i));
		}
		this.canvas.restore();
	}
});
