var webApp = webApp || {};
webApp.ProgressItm = function(params,parent){
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
	
	this.ProgressItm(params,parent);
}

webApp.ProgressItm.prototype = new webApp.Group();
webApp.ProgressItm.prototype.extend({
	ProgressItm: function(p,parent){
		var p = p || {},
			coords = [],
			i = 0,
			len = 0,
			elements = {},
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
		this.Group(elements,p,parent);
		this.image = this.validateImage(p.image);
		this.refreshItems();
	},
	beforeRedraw: function(){
		if(this.isMoving || !this.loaded){
			this.refreshItems();
		}
	},
	changeProgress: function(val){
		this.progress = parseInt(val) || this.progress;
		this.progressValues = false;
		this.imageValues = false;
	},
	getImageData: function(){
		var coords = [this.pos[0] + (this.width / 2),this.pos[1] + (this.width / 2)],
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
			itm,imgData;
		for(itm in this.items){
			if(this.items[itm].type == "line"){}
			if(this.items[itm].type == "image"){
				imgData = this.getImageData();
				this.items[itm].pos = imgData.pos;
				this.items[itm].size = imgData.size;
			}
			if(this.items[itm].type == "circle"){
				this.items[itm].coords = coords;
				if(!this.progressValues){
					if(count == 1){
						this.items[itm].circle = this.getProgress();
					}
					count++
				}
			}
		}
	}
})
