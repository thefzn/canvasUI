var webApp = webApp || {};
webApp.TextBlock = function(params,parent){
	this.size = [100,100];
	this.autoSize = false;
	this.pos = [0,0];
	this.title = false;
	this.text = false;
	this.behind = false;
	this.id = false;
	this.color = false;
	this.box = false;

	this.TextBlock(params,parent);
}

webApp.TextBlock.prototype = new webApp.Interactive();
webApp.TextBlock.prototype.extend({
	TextBlock: function(p,parent){
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
		p.pos            = p.pos || this.pos.slice();
		p.color          = p.color || this.color;
		p.size           = p.size || this.size.slice();

		elements = {
			vector: [],
			HTML: [{
				size:     p.size,
				content:  this.generateContent(this.text,this.title),
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
		this.Group(elements,p,parent);
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
	generateContent: function(text,title){
		var	content = "<div class='htmlBlock'>",
			title = title || false,
			text = text || false,
			t = [],
			i,len;
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
		content += "</div>";
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
		if(this.isMoving || this.refresh){
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
