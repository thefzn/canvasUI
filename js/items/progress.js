"use strict";
var webApp = webApp || {};
webApp.ProgressItem = function(params,parent){
	this.style = "circle";
	this.width = 100;
	this.pos = [0,0];
	this.fill = false;
	this.color = "#AAA8A2";
	this.progressColor = "#BB3531";
	this.progress = 0;
	this.image = false;
	this.progressValues = false;
	this.imageValues = false;
	this.refresh = false;
	this.aData = {};
	this.isAnimated = false;
	
	this.ProgressItem(params,parent);
}

webApp.ProgressItem.prototype = new webApp.Interactive();
webApp.ProgressItem.prototype.extend({
	ProgressItem: function(p,parent){
		var p = p || {},
			coords = [],
			i = 0,
			len = 0,
			elements = {},
			initP = 0,
			tmp,imgData;
		this.style          = p.style || this.style;
		this.width          = p.width || this.width;
		this.progress       = Math.abs(parseInt(p.progress)) || this.progress;
		this.progressColor  = p.progressColor || this.progressColor;
		this.image          = p.image || this.image;
		p.pos            = p.pos || this.pos;
		p.color          = p.color || this.color;
		p.size          = [this.width,this.width];
		
		coords = [this.pos[0] + (this.width / 2),this.pos[1] + (this.width / 2)];
		
		elements = {
			vector: [
				{
					type:         this.style,
					line: 	      {
									  size: Math.round(this.width/8)
								  },
					radius:       this.width / 2,
					color:        this.color,
					coords:       coords,
					vertical:     this.vertical
				}
			],
			drawable: []
		};
		if(this.progress){
			initP = this.progress;
			this.progress = 0.1;
			tmp = {
				type:         this.style,
				line: 	      {
								  size: Math.round(this.width/8)
							  },
				radius:       this.width / 2,
				color:        this.progressColor,
				coords:       coords,
				circle:       this.getProgress()
			}
			elements.vector.push(tmp);
		}
		if(this.image){
			tmp = {
				type:         "image",
				pos:          coords,
				image:        this.image
			}
			elements.drawable.push(tmp);
		}
		this.Interactive(elements,p,parent);
		this.image = this.validateImage(p.image);
		this.refreshItems();
		if(initP){
			this.changeProgress(initP);
		}
	},
	beforeRedraw: function(){
		if(this.isMoving || this.isFadeing || !this.loaded || this.refresh || this.isAnimated){
			if(this.isAnimated){
				this.calcProgress();
				this.progressValues = false;
			}
			this.refreshItems();
			this.refresh = false;
		}
	},
	changeProgress: function(val,c){
		var validated = parseInt(val) || 0.1;
		validated = Math.max(0,validated);
		validated = Math.min(100,validated);
		this.isAnimated = true;
		this.aData.callback = c || function(){}; 
		this.aData.finalP = validated;
	},
	calcProgress: function(){
		var res = 0,
			ease = 8,
			x,y;
		if(!this.isAnimated)
			return false;
		this.aData.finalP = this.aData.finalP || this.progress;
		if(this.progress == this.aData.finalP){
			this.isAnimated = false;
			return false;
		}
		res = Math.round(this.progress + ((this.aData.finalP - this.progress) / ease));
		if(res == this.progress){
			this.progress = this.aData.finalP;
			this.aData.callback(this);
		}else{
			this.progress = res;
		}
	},
	getImageData: function(){
		var coords = [(this.width / 2),(this.width / 2)],
			res = {
				pos: coords,
				size: [10,10]
			},
			w = this.image.width || false,
			h = this.image.height || false;
		if(!w || !h){
			return res;
			this.loaded = false;
		}else{
			this.loaded = true;
		}
			
		res.pos[0] = coords[0] - (w / 2);
		res.pos[1] = coords[1] - (h / 2);
		res.size = [w,h];
		this.imageValues = res;
		return res;
	},
	getProgress: function(){
		var circle = {},
			rads = Math.PI * 2,
			p = Math.min(this.progress,100) || 0,
			rotation = Math.PI / 2;
		if(this.progressValues && this.progressValues.percentage == p)
			return this.progressValues;
		circle.start = 0 - rotation;
		circle.dir = true;
		circle.end = ((rads / 100) * (100.01 - p)) - rotation;
		circle.percentage = p;
		this.progressValues = circle;
		return circle;
	},
	refreshItems: function(){
		var count = 0,
			coords = [this.pos[0] + (this.width / 2),this.pos[1] + (this.width / 2)],
			itm,item,imgData;
		for(itm in this.items){
			item = this.items[itm]
			if(item.type == "line"){}
			if(item.type == "image"){
				imgData = this.getImageData();
				item.pos = imgData.pos;
				item.size = imgData.size;
			}
			if(item.type == "circle"){
				item.coords = coords;
				if(!this.progressValues){
					if(count == 1){
						item.circle = this.getProgress();
					}
					count++
				}
			}
		}
	}
})
