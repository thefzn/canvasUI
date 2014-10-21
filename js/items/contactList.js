"use strict";
var webApp = webApp || {};
webApp.ContactList = function(params,parent){
	this.size = [300,300];
	this.pos = [0,0];
	this.contacts = false;
	this.behind = false;
	this.id = false;
	this.color = false;
	this.box = false;
	this.padding = 15;
	this.attachments = {
		x: false,
		y: false
	};

	this.ContactList(params,parent);
}

webApp.ContactList.prototype = new webApp.Interactive();
webApp.ContactList.prototype.extend({
	ContactList: function(p,parent){
		var p = p || {},
			coords = [],
			i = 0,
			len = 0,
			elements = {},
			tmp;
		this.contacts    = p.contacts || this.contacts;
		this.behind      = p.behind || this.behind;
		this.box         = p.box || this.box;
		this.id          = p.id || this.id;
		this.padding     = p.padding || this.padding;
		p.pos            = p.pos || this.pos.slice();
		p.color          = p.color || this.color;
		p.size           = p.size || this.size.slice();

		elements = {
			vector: [],
			HTML: [{
				size:     p.size,
				content:  "",
				autoSize: true,
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
		this.setSizeListener();
		this.updateContacts(this.contacts);
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
	generateContent: function(){
		var	content = "<ul class='htmlContacts'>",
			tmp = "",
			c = this.contacts,
			i = 0,
			len = c.length,
			emailValidate = /.+@.+\..+/g,
			isMail = false,
			itm,val,text,img,target;

		for(; i < len; i++){
			itm = c[i];
			tmp = "<li>";
			val = itm.image || false;
			if(val){
				img = this.app.get(["images",val]);
				tmp += (img) ? "<span class='contactImage'><img src='" + img.src +"' /></span>" : "";
			}
			val = itm.link || false;
			isMail = emailValidate.test(val);
			val = (isMail) ? "mailto:" + val : val;
			target = (isMail) ? "" : "target='_blank'";
			
			text = itm.text || "Open";
			tmp += (val) ? "<a href='" + val + "' " + target + ">" + text +"</a>" : "<p>" + text + "</p>";
			tmp += "</li>";
			content += tmp;
		}
		content += "</ul>";
		return content;
	},
	updateContacts: function(contacts){
		var html = false,
			itm;
		for(itm in this.items){
			if(this.items[itm].type == "html"){
				html = this.items[itm];
			}
		}
		if(html && contacts instanceof Array){
			this.contacts = contacts;
			html.content = this.generateContent();
		}
	},
	beforeRedraw:function(){
		if(this.appResizing){
			this.checkAttachments();
		}
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
	},
	checkAttachments: function(bypass){
		var b = bypass || false,
			newPos = this.pos.slice();
		if(this.attachments.x == "L"){
			newPos[0] = this.app.pos[0] + this.padding;
		}else if(this.attachments.x == "R"){
			newPos[0] = this.app.pos[0] + this.app.size[0] - (this.padding + this.size[0]);
		}
		if(this.attachments.y == "T"){
			newPos[1] = this.app.pos[1] + this.padding;
		}else if(this.attachments.y == "B"){
			newPos[1] = this.app.pos[1] + this.app.size[1] - (this.padding + this.size[1]);
		}
		if(!b){
			this.pos = newPos;
			this.refresh = true;
			this.onMove(this);
		}
		this.appResizing = false;
		return newPos;
	},
	attach: function(dir1,dir2){
		var i = 0,
			dir = "",
			len = arguments.length,
			newPos = [];
		
		for(; i < len; i++){
			if(typeof arguments[i] == "string"){
				dir = arguments[i].toUpperCase();
				switch(dir){
					case "T": case "B":
						this.attachments.y = dir;
					break;
					case "L": case "R":
						this.attachments.x = dir;
					break;
				}
			}
		}
		newPos = this.checkAttachments(true);
		this.moveTo(newPos[0],newPos[1]);
	},
	detach: function(s){
		var dir;
		s = s || "ALL";
		dir = s.toUpperCase()
		switch(dir){
			case "T": case "B":
				this.attachments.y = false;
			break;
			case "L": case "R":
				this.attachments.x = false;
			break;
			default:
				this.attachments.x = false;
				this.attachments.y = false;
		}
	}
})
