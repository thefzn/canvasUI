"use strict";
var webApp = webApp || {};
webApp.Link = function(params,parent){
	this.style = "dashed";
	this.dashStyle = 2;
	this.width = 2;
	this.pos = [0,0];
	this.end = [100,100]
	this.squareCoords = [];
	this.fill = false;
	this.color = "#AAA8A2";
	this.refresh = false;
	this.attachedIsMoving = false;
	this.attachments = {
		start : false,
		end :   false
	}
	this.squared = false;
	this.squaredData = {};
	this.vertical = false;
	this.bullet = [];
	
	this.Link(params,parent);
}

webApp.Link.prototype = new webApp.Interactive();
webApp.Link.prototype.extend({
	Link: function(p,parent){
		var p = p || {},
			i = 0,
			len = 0,
			elements = {},
			tmp;
		this.pos = p.pos || [0,0];
		this.end = p.end || [100,100];
		this.name = p.name || false;
		this.fill = p.fill || this.fill;
		this.color = p.color || this.color;
		this.style = p.style || this.style;
		this.dashStyle = p.dashStyle || this.dashStyle;
		this.width = p.width || this.width;
		this.bullet = p.bullet || this.bullet;
		this.squared = p.squared || this.squared;
		this.vertical = p.vertical || this.vertical;
		p.size = [0,0];
		
		elements = {
			vector: [
				{
					type:         "line",
					line: 	      {
						style: this.style,
						size: this.width,
						space: this.width
					},
					color:        this.color,
					coords:       this.squareCoords,
					vertical:     this.vertical
				},
				{
					type:         "circle",
					line: 	      {size: this.width},
					color:        this.color,
					coords:       this.pos,
					radius:       this.width + 1
				},
				{
					type:         "circle",
					line: 	      {size: this.width},
					color:        this.color,
					coords:       this.end,
					radius:       this.width + 1
				}
			]
		};
		if(this.bullet){
			for(i = 0, len = this.bullet.length; i < len ; i++){
				tmp = {
					type:         this.bullet[i].type || "circle",
					line: 	      this.bullet[i].line || this.line,
					fill: 	      this.bullet[i].fill || this.fill,
					color:        this.bullet[i].color || this.color
				};
				if(tmp.type == "circle"){
					tmp.radius = this.width * 5;
					tmp.coords = this.end;
				}else{
					tmp.pos = this.end;
					tmp.coords = this.bullet[i].coords;
				}
				elements.vector.push(tmp);
			}
		}
		this.Interactive(elements,p,parent);
		
		this.checkAttachments();
		if(this.squared){
			this.squarePath();
		}
		this.refreshItems();
	},
	beforeRedraw:function(){
		var followMouse = (this.attachments.start == "mouse" || this.attachments.end == "mouse");
		if(this.isMoving || this.isFadeing || this.attachedIsMoving || this.refresh || followMouse){
			this.checkAttachments();
			if(this.squared){
				this.squarePath();
			}
			this.refreshItems();
			this.refresh = false;
			this.attachedIsMoving = false;
		}
	},
	refreshItems: function(){
		var count = 0,
			itm;
		for(itm in this.items){
			var coEndx = this.end,
				valSpace = this.width*20,
				bullPos = 0,
				space = 0,
				x,y;
			
			if(!this.vertical){
				if(this.pos[1] < coEndx[1]){
					bullPos = coEndx[1] - valSpace;
					bullPos = Math.max(this.pos[1],bullPos);
				}else{
					bullPos = coEndx[1] + valSpace;
					bullPos = Math.min(this.pos[1],bullPos);
				}
				x = this.squaredData.mid;
				y = bullPos;
			}else{
				if(this.pos[0] < coEndx[0]){
					bullPos = coEndx[0] - valSpace;
					bullPos = Math.max(this.pos[0],bullPos);
				}else{
					bullPos = coEndx[0] + valSpace;
					bullPos = Math.min(this.pos[0],bullPos);
				}
				x = bullPos;
				y = this.squaredData.mid;
			}
			if(this.items[itm].type == "line"){
				this.items[itm].coords = (this.squared) ? this.squareCoords : [this.pos,this.end];
			}
			if(this.items[itm].type == "polygon"){
				this.items[itm].pos =  [x,y];
			}
			if(this.items[itm].type == "circle"){
				switch(count){
					case 0:
						this.items[itm].coords = this.pos;
					break;
					case 1:
						this.items[itm].coords = coEndx;
					break;
					default:
						this.items[itm].coords =  [x,y];
					break;
				}
				count++
			}
		}
	},
	checkAttachments: function(){
		var t = this.width * 10,
			newPos = [],
			center = [],
			ext, itm, ref, coord, axis, type;
		for(ext in this.attachments){
			itm = (this.attachments[ext] != "mouse") ? this.attachments[ext] : {pos:this.app.mousePos,size:[0,0]};
			if(!itm)
				continue;
			type = itm.type || false;
			axis = (this.vertical) ? 1 : 0;
			coord = (ext == "start") ? "pos" : "end";
			ref = (ext == "start") ? this.end : this.pos;
			if(!type){
				center[0] = itm.pos[0] + (itm.size[0] / 2);
				center[1] = itm.pos[1] + (itm.size[1] / 2);
			}
			newPos = center.slice();
			newPos[axis] = (center[axis] < ref[axis]) ? center[axis] + (itm.size[axis] / 2) + t : center[axis] - (itm.size[axis] / 2) - t;
			this[coord] = newPos;
		}
	},
	squarePath:function(){
		var s = this.pos.slice(),
			e = this.end.slice(),
			axis = (this.vertical) ? 1 : 0,
			cAxis = (axis == 1) ? 0 : 1,
			padding = 10,
			m = (s[axis] < e[axis]) ? e[axis] - this.width * padding : e[axis] + this.width * padding,
			p1 = [],
			p2 = [],
			bleed = this.width + 1,
			max = Math.max(s[axis],e[axis]),
			min = Math.min(s[axis],e[axis]);
		m = (m <= max && m >= min) ? m : e[axis];
		s[axis] = (s[axis] < m) ? s[axis] + bleed : s[axis] - bleed;
		e[axis] = (e[axis] < m) ? e[axis] + bleed : e[axis] - bleed;
		if(this.vertical){
			p1 = [s[0],m];
			p2 = [e[0],m];
		}else{
			p1 = [m,s[1]];
			p2 = [m,e[1]];
		}
		this.squaredData.mid = m;
		this.squareCoords = [s,p1,p2,e];
	},
	attach: function(itm,s){
		var i = itm || false,
			s = s || false,
			p = p || "T",
			target,
			self = this;
		if(!i)
			return false;
		this.refresh = true;
		target = (s) ? "start" : "end";
		if(itm instanceof webApp.Object){
			this.attachments[target] = itm;
			this.attachments[target].links[this.UID] = self;
			this.attachments[target].onMove = function(item){
				var itm;
				for(itm in item.links){
					if(item.links[itm]){
						item.links[itm].attachedIsMoving = true;
					}
				}
			}
		}else if(itm == "mouse"){
			this.attachments[target] = "mouse";
		}else{
			return false;
		}
	},
	detach: function(s){
		var s = s || false,
			target = (s) ? "start" : "end";
		if(this.attachments[target] != "mouse"){
			this.attachments[target].links[this.UID] = false;
		}
		this.attachments[target] = false;
	}
})
