"use strict";
var webApp = webApp || {};
webApp.HTML = function (params,parent){
	var p = params || false;
	if(p){
		this.HTML(p,parent);
	}
}
webApp.HTML.prototype = new webApp.Object();
webApp.HTML.prototype.extend({
	HTML:function(params,parent){
		var params = params || {},
			parent   = parent || false,
			z = 0;
		this.setParent(parent);

		// Basic data
		this.canvas   = parent.canvas || this.canvas;
		this.name     = params.name || "item" + Math.random();
		this.UID      = params.UID || "INVALID";
		this.type     = "html";
		this.pos      = params.pos || [0,0];

		// Drawing data
		this.opacity  = (typeof params.opacity != "undefined") ? params.opacity : 1;
		this.size     = params.size || [100,100];
		this.autoSize = params.autoSize || false;
		this.content  = params.content || "<div>Empty HTML</div>";
		this.behind   = params.behind || false;
		this.id       = params.id || params.UID || "INVALID";
		this.rendered = {
			content : "",
			pos :     [0,0],
			size :    [0,0] 
		};
		this.el       = document.createElement("div");
		
		z = (!this.app) ? 101 : (this.behind) ? this.app.cnv.style.zIndex - 1 : this.app.cnv.style.zIndex + 1;
		
		this.el.id = this.id;
		this.el.style.position = "fixed";
		this.el.style.margin = "0";
		this.el.style.padding = "0";
		this.el.style.overflow = "hidden";
		this.el.style.zIndex = z;
		document.body.appendChild(this.el);
		this.updateContent();
		this.updatePos();
		this.updateSize();
	},
	redraw: function(){
		if(this.content != this.rendered.content){
			this.updateContent();
		}
		if(this.pos[0] != this.rendered.pos[0] || this.pos[1] != this.rendered.pos[1]){
			this.updatePos();
		}
		if(this.size[0] != this.rendered.size[0] || this.size[1] != this.rendered.size[1]){
			this.updateSize();
		}
	},
	updateContent: function(){
		this.el.innerHTML = this.content;
		this.rendered.content = this.content;
		this.updateSize();
	},
	updatePos: function(){
		var x = (this.app) ? this.app.cnv.offsetLeft + this.pos[0] : this.pos[0],
			y = (this.app) ? this.app.cnv.offsetTop + this.pos[1] : this.pos[1];
		this.el.style.left = x + "px";
		this.el.style.top = y + "px";
		this.rendered.pos = [x,y];
	},
	updateSize: function(){
		var height = this.getHeight(); 
		this.el.style.width = this.size[0] + "px";
		this.el.style.height = height + "px";
		this.rendered.size = this.size.slice();
		this.onResize(this.size);
	},
	getHeight: function(){
		if(this.autoSize){
			this.el.style.height = "auto";
			this.size[1] = this.el.offsetHeight;
		}
		return this.size[1];
	},
	remove: function(){
		document.body.removeChild(this.el);
	},
	onResize: function(){}
});
