var webApp = webApp || {};
webApp.Collection = function(type,game,onLoad){
	this.type         = type || "other";
	this.items        = {};
	this.game         = game || false;
	this.onLoad       = (typeof onLoad == "function") ? onLoad : this.onLoad;
	this.instances    = 0;
	this.length       = 0;
	this.resources    = {
		images: true,
		audios: true,
		fonts: true
	};
}
webApp.Collection.prototype = new webApp.Resource();
webApp.Collection.prototype.extend({
	add: function(id,item){
		var theItem = item || false,
			theID = id || false,
			i = 0,
			isResource = this.resources[this.type] || false,
			len,itm;
		if(!theItem)
			return;
		if(theItem instanceof Array){
			for(len = theItem.length; i < len; i++){
				itm = theItem[i];
				if(typeof itm == "object"){
					this.addItem(itm.name,itm);
				}else{
					this.addItem(itm);
				}
			}
		}else{
			this.addItem(theID,theItem);
		}
		if(!isResource){
			this.onLoad();
		}
	},
	addItem: function(id,item){
		var item = item || false,
			id = id || item.name || this.type + "_" + this.length,
			parent = (this.type == "app") ? this : this.parent,
			isResource = this.resources[this.type] || false,
			src;
		if(typeof this.items[id] != "undefined")
			return;
		switch(this.type){
			case "images":
				src = (item) ? item.src : id;
				this.items[id] = new Image();
				this.items[id].name = id;
				this.loadResource(this.items[id]);
				this.items[id].src = src;
			break;
			case "fonts":
				this.items[id] = new webApp.Font(id,this.canvas);
				this.loadResource(this.items[id]);
				this.items[id].test();
			break;
			case "collections": case "app":
				this.items[id] = new webApp.Collection(id);
				this.loadResource(this.items[id]);
				this.items[id].setParent(parent);
				this.items[id].add(false,item);
			break
			default:
				this.items[id] = item;
				if(typeof item == "object"){
					this.items[id].name = item.name || id;
				}
		}
		this.length++;
	},
	get: function(){
		var i=0,
			args = (!arguments.length) ? [] : (arguments[0] instanceof Array) ? arguments[0] : arguments,
			len = args.length || 0,
			sel = false,
			current = this,
			index,items;
		for (; i < len; i++){
			index = args[i];
			if(current){
				sel = current.items[index] || false;
				current = (sel instanceof webApp.Collection) ? sel : false;
			}else{
				sel = false;
				break;
			}
		}
		return sel;
	},
	onLoad: function(){
		console.log("Collection Loaded");
	},
	generate: function(id,params){
		var id = id || false,
			newP = params || {},
			parent = (this.type == "app") ? this : this.parent,
			className,def,p,type,cons,item;
		p = this.get(id);
		type = (id instanceof Array) ? id[0] : id;
		className = this.getClassName(type);
		cons = webApp[className] || false;
		if(!p || !id || !className || !cons)
			return false;
		this.instances++;
		for(def in newP){
			p[def] = newP[def];
		}
		p.name = p.name || this.type + this.instances;
		item = new cons(p);
		item.UID = type + "_" + item.name + "_" + this.instances;
		item.setParent(parent);
		return item;
	},
	remove: function(){
		
	}
})
