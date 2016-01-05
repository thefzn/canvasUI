"use strict";
var webApp = webApp || {};
webApp.VCard = function(params,parent){
	this.size = [100,100];
	this.autoSize = false;
	this.pos = [0,0];
	this.title = false;
	this.text = false;
	this.image = false;
	this.behind = false;
	this.id = false;
	this.color = false;
	this.box = false;

	this.VCard(params,parent);
}

webApp.VCard.prototype = new webApp.Interactive();
webApp.VCard.prototype.extend({
	VCard: function(p,parent){
		var p = p || {},
			coords = [],
			i = 0,
			len = 0,
			elements = {},
			tmp;
		this.text        = p.text || this.text;
		this.title       = p.title || this.title;
		this.behind      = p.behind || this.behind;
		this.autoSize    = p.autoSize || this.autoSize;
		this.box         = p.box || this.box;
		this.id          = p.id || this.id;
		this.image       = p.image || this.image;
		p.pos            = p.pos || this.pos.slice();
		p.color          = p.color || this.color;
		p.size           = p.size || this.size.slice();

		elements = {
			vector: [],
			HTML: [{
				size:     p.size,
				content:  this.generateContent(this.text,this.title,this.image),
				autoSize: this.autoSize,
				behind:   this.behind,
				id:       this.id,
				pos:      p.pos
			}]
		};
		if(this.box){
			tmp = {
					type:    "rectangle",
					line: 	 {size:2},
					radius:  1,
					color:   p.color,
					size:    p.size,
					pos:     p.pos,
					fill:    false
				}
			elements.vector.push(tmp);
		}
		this.Interactive(elements,p,parent);
		if(this.autoSize){
			this.setSizeListener();
		}
		this.refresh = true;
	},
	setSizeListener: function(){
		var html = false,
			self = this,
			itm;
		for(itm in this.items){
			if(this.items[itm].type == "html"){
				html = this.items[itm];
			}
		}
		if(html){
			html.onResize = function(size){
				self.size = size;
				self.refresh = true;
			};
		}
	},
	generateContent: function(text,title,image){
		var	content = "<article class='block business'><div class='htmlBlock vcard'>",
			title = title || false,
			text = text || false,
			t = [],
			i,len;
		if(image){
			content += '<div class="image-profile no-width"><img src="' + image + '"></div>';
		}
		if(title){
			content += "<h2>" + title + "</h2>";
		}
		if(typeof text == "string"){
			t = [text];
		}else if (text instanceof Array){
			t = text;
		}
		for(i = 0, len = t.length; i < len; i++){
			content += "<p>" + t[i] + "</p>";
		}
		content += "</div></article>";
		return content;
	},
	updateText: function(text,title){
		var html = false,
			itm;
		for(itm in this.items){
			if(this.items[itm].type == "html"){
				html = this.items[itm];
			}
		}
		if(html){
			html.content = this.generateContent(text,title);
		}
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
			if(this.items[itm].type == "rectangle" || this.items[itm].type == "html"){
				this.items[itm].pos = this.pos.slice();
				this.items[itm].size = this.size.slice();
			}
		}
	}
})
