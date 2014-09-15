var webApp = webApp || {};
webApp.Dialog = function(params,parent){
	this.size = [100,25];
	this.autoSize = false;
	this.pos = [0,0];
	this.fill = false;
	this.line = false;
	this.align = "center";
	this.text = false;
	this.radius = 5;
	this.color = "#BB3531";
	this.dir = "T";
	this.arrowSize = 5;
	this.fontColor = "white";
	this.fontSize = 13;
	this.font = "Arial";
	this.attachedIsMoving = false;
	this.refresh = false;
	this.attachments = false

	this.Dialog(params,parent);
}

webApp.Dialog.prototype = new webApp.Group();
webApp.Dialog.prototype.extend({
	Dialog: function(p,parent){
		var p = p || {},
			coords = [],
			i = 0,
			len = 0,
			elements = {},
			tmp,arrow;
		this.fill        = p.fill || this.fill;
		this.line        = p.line || this.line;
		this.radius      = p.radius || this.radius;
		this.autoSize    = p.autoSize || this.autoSize;
		this.text        = p.text || this.text;
		this.align       = p.align || this.align;
		this.font        = "'" + p.font + "'" || this.font;
		this.fontColor   = p.fontColor || this.fontColor;
		this.fontSize    = p.fontSize || this.fontSize;
		this.image       = p.image || this.image;
		this.dir = "T";
		p.pos            = p.pos || this.pos;
		p.color          = p.color || this.color;
		p.size           = p.size || this.size;

		arrow = this.getArrowCoords(p.pos);
		elements = {
			vector: [
				{
					type:    "rectangle",
					line: 	 this.line,
					radius:  this.radius,
					color:   p.color,
					size:    p.size,
					pos:     p.pos,
					fill:    true
				},
				{
					type:    "polygon",
					line: 	 this.line,
					coords:  arrow.coords,
					color:   p.color,
					pos:     arrow.pos,
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
				color:        this.fontColor,
				align:        this.align,
				spacing:      this.arrowSize / 2,
				text:         this.text
			}
			elements.text.push(tmp);
		}
		this.Group(elements,p,parent);
		if(this.autoSize){
			this.getAutoSize();
		}
		this.refresh = true;
	},
	getArrowCoords: function(){
		var s = this.arrowSize,
			s2 = s * 2,
			thisPos = thisPos || this.pos,
			center = [this.pos[0] + (this.size[0] / 2), this.pos[1] + (this.size[1] / 2)],
			coords = {
				B: [[s,s],[s2,s2],[0,s2]],
				T: [[s,s],[0,0],[s2,0]],
				R: [[s,s],[s2,s2],[s2,0]],
				L: [[s,s],[0,0],[0,s2]]
			},
			sel,pos;
		sel = coords[this.dir] || coords["B"];
		switch(this.dir){
			case "R":
				pos = [this.pos[0] - s2, center[1] - s];
			break;
			case "L":
				pos = [this.pos[0] + this.size[0], center[1] - s];
			break;
			case "B":
				pos = [center[0] - s, this.pos[1] - s2];
			break;
			default:
				pos = [center[0] - s, this.pos[1] + this.size[1]];
		}
		return {coords : sel, pos : pos};
	},
	getAutoSize: function(){
		var text = (typeof this.text == "string") ? [this.text] : this.text,
			width = 0,
			lineHeight = this.fontSize + (this.arrowSize / 2),
			res = [],
			i = 0,
			len, measure;
		this.canvas.save();
		this.canvas.font = this.fontSize + "px " + this.font + ", Arial";
		for(len = text.length; i < len; i++){
			measure = this.canvas.measureText(text[i]);
			width = Math.max(measure.width,width);
		}
		this.canvas.restore();
		res = [Math.round(width) + (this.arrowSize * 4), (lineHeight * len) + (this.arrowSize * 2)];
		this.size = res;
	},
	getTextPos: function(){
		var lineHeight = this.fontSize + this.arrowSize - 1,
			res;
		switch(this.align){
			case "center":
				res = [this.pos[0] + (this.size[0] / 2), this.pos[1] + lineHeight];
			break;
			case "right":
				res = [this.pos[0] + this.size[0] - (this.arrowSize * 2), this.pos[1] + lineHeight];
			break;
			default:
				res = [this.pos[0] + (this.arrowSize * 2), this.pos[1] + lineHeight];
		}
		return res;
	},
	updateText: function(newText){
		this.text = newText;
		if(this.autoSize){
			this.getAutoSize();
		}
		this.refresh = true;
	},
	beforeRedraw:function(){
		var followMouse = this.attachments == "mouse";
		if(this.isMoving || this.attachedIsMoving || this.refresh || followMouse){
			this.checkAttachments();
			this.refreshItems();
			this.refresh = false;
			this.attachedIsMoving = false;
		}
	},
	refreshItems: function(){
		var arrow = this.getArrowCoords(),
			lineHeight, itm;
		
		for(itm in this.items){
			if(this.items[itm].type == "rectangle"){
				this.items[itm].pos = this.pos.slice();
				this.items[itm].size = this.size.slice();
			}
			if(this.items[itm].type == "polygon"){
				this.items[itm].pos = arrow.pos;
				this.items[itm].coords = arrow.coords;
			}
			if(this.items[itm].type == "text"){
				this.items[itm].text = this.text;
				this.items[itm].pos = this.getTextPos();
			}
		}
	},
	checkAttachments: function(){
		var t = this.arrowSize * 3,
			newPos = [],
			center = [],
			itm, type;
		itm = (this.attachments != "mouse") ? this.attachments : {pos:this.app.mousePos,size:[0,0]};
		if(!itm)
			return false;
		type = itm.type || false;
		if(!type){
			center[0] = itm.pos[0] + (itm.size[0] / 2);
			center[1] = itm.pos[1] + (itm.size[1] / 2);
		}
		switch(this.dir){
			case "L":
				newPos = [itm.pos[0] - this.size[0] - t, center[1] - (this.size[1] / 2)];
				//newPos = [itm.pos[0] - this.size[0] - t, itm.pos[1]];
			break;
			case "R":
				newPos = [itm.pos[0] + itm.size[0] + t, center[1] - (this.size[1] / 2)];
				//newPos = [itm.pos[0] + itm.size[0] + t,  itm.pos[1]];
			break;
			case "B":
				newPos = [center[0] - (this.size[0] / 2), itm.pos[1] + itm.size[1] + t];
			break;
			default:
				newPos = [center[0] - (this.size[0] / 2), itm.pos[1] - this.size[1] - t];
		}
		this.pos = newPos;
	},
	attach: function(itm,dir){
		var i = itm || false,
			p = p || "T",
			self = this;
		if(!i)
			return false;
		this.refresh = true;
		this.dir = dir;
		if(itm instanceof webApp.Object){
			this.attachments = itm;
			this.attachments.links[this.UID] = self;
			this.attachments.onMove = function(item){
				var itm;
				for(itm in item.links){
					if(item.links[itm]){
						item.links[itm].attachedIsMoving = true;
					}else{
						item.links[itm].attachedIsMoving = false;
					}
				}
			}
		}else if(itm == "mouse"){
			this.attachments = "mouse";
		}else{
			return false;
		}
	},
	detach: function(s){
		if(this.attachments != "mouse"){
			this.attachments.links[this.UID] = false;
		}
		this.attachments = false;
	}
})
