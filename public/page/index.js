window.onload = function(){
	//new Tabs();
	new Search();
	new Slider();
};
(function(window,undefined){
	function html2node(str) {
		var container = document.createElement('div');
		container.innerHTML = str;
		return container.children[0];
	}
})(window,undefined);
(function(window,undefined){
	function extend(o1, o2) {
		for(var i in o2)
			if(typeof o1[i] === 'undefined') {
				o1[i] = o2[i]
			};
		return o1;
	}
})(window,undefined);
