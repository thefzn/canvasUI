"use strict";
var webApp = webApp || {};
webApp.Header = function(params,parent){
	this.width = 15;
	this.size = [10,10];
	this.autoSize = false;
	this.pos = [0,0];
	this.align = "left";
	this.text = "Header";
	this.color = "#BB3531";
	this.fontColor = "#282626";
	this.fontSize = 22;
	this.font = "Arial";
	this.box = false;
	this.padding = 3;

	this.Header(params,parent);
}

webApp.Header.prototype = new webApp.Interactive();
webApp.Header.prototype.extend({
	Header: function(p,parent){
		var p = p || {},
			coords = [],
			i = 0,
			len = 0,
			elements = {},
			tmp,width;
		this.text        = p.text || this.text;
		this.font        = "'" + p.font + "'" || this.font;
		this.fontColor   = p.fontColor || this.fontColor;
		this.fontSize    = p.fontSize || this.fontSize;
		p.pos            = p.pos || this.pos;
		p.color          = p.color || this.color;
		width = p.width || this.width;
		p.pos            = (p.pos instanceof Array) ? [p.pos[0],-5] : [p.pos,-5];
		p.size           = [width,100];
		
		this.text = (typeof this.text == "string") ? [this.text] : this.text;

		elements = {
			vector: [
				{
					type:    "rectangle",
					line: 	 false,
					radius:  5,
					color:   p.color,
					size:    [p.size[0],p.size[1]+5],
					pos:     p.pos,
					fill:    true
				},
				{
					type:    "rectangle",
					line: 	 false,
					radius:  0,
					color:   this.fontColor,
					size:    p.size,
					pos:     p.pos,
					fill:    true
				}
			
			],
			text: []
		};
		if(this.text){
			tmp = {
				type:         "text",
				pos:          p.pos.slice(),
				font:         this.font,
				size:         this.fontSize,
				style:        "bold",
				color:        this.fontColor,
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
		var text = this.text,
			lineHeight = (this.fontSize + 3) * text.length,
			width = 10,
			res = [];
		res = [width, lineHeight + 50];
		this.size = res;
	},
	getTextPos: function(){
		var t = this.text,
			lineHeight = (this.fontSize + 3) * t.length,
			res;
		lineHeight -= 10;
		return [this.pos[0] + 20, this.size[1] - lineHeight];
	},
	updateText: function(newText){
		this.text = newText;
		this.getAutoSize();
		this.refresh = true;
	},
	beforeRedraw:function(){
		if(this.isMoving || this.refresh){
			this.refreshItems();
			this.refresh = false;
		}
	},
	refreshItems: function(){
		var count = 0,
			itm;
		for(itm in this.items){
			if(this.items[itm].type == "rectangle"){
				if(count == 0){
					this.items[itm].pos = this.pos.slice();
					this.items[itm].size = [this.size[0],this.size[1]+5];
				}else{
					this.items[itm].pos = this.pos.slice();
					this.items[itm].size = this.size.slice();
				}
				count++;
			}
			if(this.items[itm].type == "text"){
				this.items[itm].text = this.text;
				this.items[itm].pos = this.getTextPos();
			}
		}
	}
})
