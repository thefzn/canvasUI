var webApp = webApp || {};
webApp.Text = function (params,parent){
	p = params || false;
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
		this.tile     = params.tile || false;
		this.size     = params.size || 12;
		this.align    = params.align || "center";
		this.font     = params.font || "Arial";
		this.text     = params.text || "";
		this.spacing  = params.spacing || 2;
	},
	redraw: function(){
		var i = 0,
			s = this.size + this.spacing,
			text, len;
		if(!this.canvas)
			return false;
		this.canvas.save();
		if(this.opacity != 1){
			this.canvas.globalAlpha = (this.parent) ? this.opacity * this.parent.opacity : this.opacity;
		}
		this.canvas.fillStyle = this.color;
		this.canvas.font = this.size + "px " + this.font + ", Arial";
		this.canvas.textAlign = this.align;
		text = (typeof this.text == "string") ? [this.text] : this.text;
		for(len = text.length; i < len; i++){
			this.canvas.fillText(text[i], this.pos[0], this.pos[1] + (s * i));
		}
		this.canvas.restore();
	}
});