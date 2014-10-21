"use strict";
var webApp = webApp || {};
webApp.Title = function(params,parent){
	this.size = [10,10];
	this.autoSize = false;
	this.pos = [0,0];
	this.align = "center";
	this.text = false;
	this.color = "#BB3531";
	this.fontColor = "#282626";
	this.dir = "T";
	this.fontSize = 13;
	this.font = "Arial";
	this.box = false;
	this.padding = 3;

	this.Title(params,parent);
}

webApp.Title.prototype = new webApp.Interactive();
webApp.Title.prototype.extend({
	Title: function(p,parent){
		var p = p || {},
			coords = [],
			i = 0,
			len = 0,
			elements = {},
			tmp,arrow;
		this.text        = p.text || this.text;
		this.align       = p.align || this.align;
		this.font        = "'" + p.font + "'" || this.font;
		this.fontColor   = p.fontColor || this.fontColor;
		this.fontSize    = p.fontSize || this.fontSize;
		this.box         = p.box || this.box;
		this.dir         = "T";
		p.pos            = p.pos || this.pos;
		p.color          = p.color || this.color;
		p.size           = p.size || this.size;

		elements = {
			vector: [],
			text: []
		};
		if(this.box){
			tmp = {
					type:    "rectangle",
					line: 	 {size:2},
					radius:  0,
					color:   p.color,
					size:    p.size,
					pos:     p.pos,
					fill:    false
				}
			elements.vector.push(tmp);
		}
		if(this.text){
			tmp = {
				type:         "text",
				pos:          p.pos.slice(),
				font:         this.font,
				size:         this.fontSize,
				style:        "bold",
				color:        this.fontColor,
				line: 	      {color : "white", width : 5},
				align:        this.align,
				text:         this.text,
				fill:         false
			}
			elements.text.push(tmp);
		}
		this.Interactive(elements,p,parent);
		this.getAutoSize();
		this.refresh = true;
	},
	getAutoSize: function(){
		var text = (typeof this.text == "string") ? [this.text] : this.text,
			width = 0,
			s = this.padding / 2,
			res = [],
			i = 0,
			len, measure;
		this.canvas.save();
		this.canvas.font = "bold " + this.fontSize + "px '" + this.font + "'";
		for(len = text.length; i < len; i++){
			measure = this.canvas.measureText(text[i]);
			width = Math.max(measure.width,width);
		}
		this.canvas.restore();
		res = [Math.round(width) + (this.padding * 4), (this.padding * 5) + ((this.fontSize + s) * (len - 1))];
		this.size = res;
	},
	getTextPos: function(){
		var lineHeight = this.fontSize / 3,
			res;
		switch(this.align){
			case "center":
				res = [this.pos[0] + (this.size[0] / 2), this.pos[1] + lineHeight];
			break;
			case "right":
				res = [this.pos[0] + this.size[0] - (this.padding * 2), this.pos[1] + lineHeight];
			break;
			default:
				res = [this.pos[0] + (this.padding * 2), this.pos[1] + lineHeight];
		}
		return res;
	},
	updateText: function(newText){
		this.text = newText;
		this.getAutoSize();
		this.refresh = true;
	},
	beforeRedraw:function(){
		if(this.isMoving || this.isFadeing || this.refresh){
			this.refreshItems();
			this.refresh = false;
		}
	},
	refreshItems: function(){
		var itm;
		for(itm in this.items){
			if(this.items[itm].type == "rectangle"){
				this.items[itm].pos = this.pos.slice();
				this.items[itm].size = this.size.slice();
			}
			if(this.items[itm].type == "text"){
				this.items[itm].text = this.text;
				this.items[itm].pos = this.getTextPos();
			}
		}
	}
})
