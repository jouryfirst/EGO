//搜索框组件
(function(window,undefined){
	function Search(){
		this.nForm = document.getElementById('search');
		this.nKeyword = document.getElementById('keyword');
		//初始化
		this.init();
	};
	//初始函数
	Search.prototype.init = function(){
		//添加时间
		this.nForm.addEventListener('submit',this.search.bind(this));
	};
	Search.prototype.search = function(event){
		//验证非空
		this.nKeyword.value = this.nKeyword.value.trim();
		if(!this.nKeyword.value){
			event.preventDefault();
		}
	};
		// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = Search;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return Search;
		});
	} else {
		// 直接暴露到全局
		window.Search = Search;
	}
	
})(window,undefined)
