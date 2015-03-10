// staic module module.m1(); ...
var module = ((function() {
	var f1_private = {};
	return {
		m1 : function() {
			console.log("m1");
		},
		m2 : function() {
			console.log("m2");
		},
		m3 : function() {
			console.log("m3");		
		}
	}
})());

// module 2 (module builder)
var moduleBuilder = function (config) {
	if( window  === this){
		return new moduleBuilder(config); 
	}
	// private method and variables

	// public method
	return {
		method1 : function (){},
		method2 : function (){}
	}
}



// parserBuilder (module builder)
var parserBuilder = function (config) {
	if( window  === this){
		return new parserBuilder(config); 
	}

	// private method and variables

	var _config = {
		isDebugEnabled : true,
		type : "Text",
		content : " ",
		node : document.createElement("div")
	}
	var _allowedTypes = ["Markdown","Html","Image","Text"];

	if(config && typeof(config)){
		if(typeof(config.content) === "string"){
			_config.content = config.content;
		} 
		if(_allowedTypes.indexOf(config.type) != -1){
			_config.type = config.type;
		}	
	}

	if(_config.isDebugEnabled){
		console.info("Constructor is executed");
	}

	// object for private methodes

	var _privateMethodes = {
		isFree : function (){
			return !_config.node.parentElement;
		},
		freeNode : function (){
			if(!this.isFree()){
				_config.node.parentElement.removeChild(_config.node);
				return true;
			}
			return false;
		},
		addTo : function (container){
			this.freeNode();
			if(container instanceof HTMLElement){
				container.appendChild(_config.node);
			}else{
				console.error("container is not element of HTML element", container);
			}
		},
		render : function(){
			switch (_config.type){
				case "Text" :
				_config.node.innerHTML = "";
				_config.node.appendChild(document.createTextNode(_config.content));
				break;
				
				case "Html" :
				_config.node.innerHTML = _config.content;
				break;
				
				case "Image" :
				_config.node.innerHTML = "";
				if(true || _config.content.match(/^data\:[a-z\-\/0-9]+/)){
					var image = document.createElement("img");
					image.src = _config.content;
					_config.node.appendChild(image);
				}else{
					console.warn("Not valid image", _config.content);		
				}
				break;

				default: break;
			}
		}
	}

	// public method
	return {
		setType : function (type){
			if(_allowedTypes.indexOf(type) !== -1){
				_config.type = type;
				_config.content = "";
				_privateMethodes.render();
			}
		},
		setContent : function (content){
			if(typeof(content) === "string"){
				_config.content = content;
				_privateMethodes.render();
			}
		},
		addTo : function (){
			_privateMethodes.render();
			return _privateMethodes.addTo.apply(_privateMethodes,arguments);
		},
		freeNode : function (){
			// apply(_privateMethodes,arguments) _privateMethodes is this on funtion freeNode
			// arguments are arguments of freeNode function 
			// apply call the method freeNode from _privateMethodes with this -> _privateMethodes
			return _privateMethodes.freeNode.apply(_privateMethodes,arguments);}
	}
}

var m1 = parserBuilder(
	{
		type : "Text",
		content : ":)"
});


var m2 = parserBuilder(
	{
		type : "Html",
		content : "<b>:|</b>"
});