var webApp = webApp || {};
webApp.Draggable = function (params,parent){
	p = params || false;
	
	this.drag = false;
	this.dragging = false;
	this.initial = [0,0];
	this.mInitial = [0,0];
	
	if(p){
		this.Draggable(p,parent);
	}
}
webApp.Draggable.prototype = new webApp.Drawable();
webApp.Draggable.prototype.extend({
	Draggable:function(p,parent){
		var p = p || {};
		this.drag = p.drag || false;
		
		this.Drawable(p,parent);
	},
	dragOn: function(){
		if(this.app){
			if(this.drag){
				this.drag = false;
				this.app.clickableItems[this.UID] = false;
			}else{
				this.drag = true;
				this.app.clickableItems[this.UID] = this;
			}
		}
	},
	dragStart: function(){
		if(!this.app || this.isMoving || this.dragging)
			return false;
		this.app.cnv.style.cursor = "move";
		this.initial = this.pos.slice();
		this.mInitial = this.app.mousePos;
		this.dragging = true;
		
	},
	dragEnd: function(){
		if(!this.app || !this.dragging)
			return false;
		this.app.cnv.style.cursor = "default";
		this.dragging = false;
	},
	clickDown:function(pos){
		if(pos[0] >= this.pos[0] && pos[0] <= this.pos[0] + this.size[0]){
			if(pos[1] >= this.pos[1] && pos[1] <= this.pos[1] + this.size[1]){
				this.dragStart();
			}
		}
	},
	clickUp:function(pos){
		this.dragEnd();
	},
	calcDrag: function(){
		var displacement = [],
			newPos = [];
		if(!this.app)
			return false;
		displacement[0] = this.app.mousePos[0] - this.mInitial[0];
		displacement[1] = this.app.mousePos[1] - this.mInitial[1];
		
		newPos[0] = this.initial[0] + displacement[0];
		newPos[1] = this.initial[1] + displacement[1];
		this.moveTo(newPos[0],newPos[1]);
	},
	eachFrame: function(){
		if(this.dragging){
			this.calcDrag();
		}
	}
});
