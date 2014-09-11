var webApp = webApp || {};
webApp.Dialog = function(params,parent){
	this.size = [100,25];
	this.pos = [0,0];
	this.fill = false;
	this.line = false;
	this.text = false;
	this.radius = 0;
	this.color = "#BB3531";
	this.dir = "T";
	this.arrowSize = 5;
	this.fontColor = "#BB3531";
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
		this.textColor   = p.textColor || this.textColor;
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
		};
		/*
		if(this.image){
			tmp = {
				type:         "image",
				pos:          coords,
				image:        this.image
			}
			elements.drawable.push(tmp);
		}
		*/
		this.Group(elements,p,parent);
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
	beforeRedraw:function(){
		var followMouse = this.attachments == "mouse";
		if(this.isMoving || this.attachedIsMoving || this.refresh || followMouse){
			this.checkAttachments();
			this.refreshItems();
			this.refresh = false;
		}
	},
	refreshItems: function(){
		var arrow = this.getArrowCoords(),
			itm;
		for(itm in this.items){
			if(this.items[itm].type == "polygon"){
				this.items[itm].pos = arrow.pos;
				this.items[itm].coords = arrow.coords;
			}
			if(this.items[itm].type == "rectangle"){
				this.items[itm].pos = this.pos.slice();
			}
			//if(this.items[itm].type == "text"){}
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
