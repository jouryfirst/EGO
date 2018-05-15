//导航tabs组件
(function(window, undefined) {
	function Tabs() {
		this.index = this.index || 0;
		//index中有多个tabs，利用父级id调用
		this.settings = {
			id: 'hdtabs'
		};

		//this.container = document.getElementsByClassName('m-tabs')[0];
		//初始化
		this.init();
	};
	//初始函数
	Tabs.prototype.init = function(options) {
		var options = options || this.settings;
		for(var attr in options) {
			this.settings[attr] = options[attr];
		};
		this.createDom();
		
		for(var i = 0; i < this.nTabs.length; i++) {
			this.nTabs[i].addEventListener('mouseenter', function(index) {
				this.highlight(index);
			}.bind(this, i))
			this.nTabs[i].addEventListener('click', function(index) {
				this.setCurrent(index);
			}.bind(this, i))
		};
		this.nTab.addEventListener('mouseleave', function() {
			this.highlight(this.index);
		}.bind(this));
		//this.parent.appendChild(this.container);
		this.setCurrent(this.index);
	};
	//创建DOM
	Tabs.prototype.createDom = function(){
		//console.log(this.settings.id);
		//var That = this;
		this.container = document.getElementById(this.settings.id);
		//console.log(this.container);
		this.nTab = this.container.getElementsByTagName('ul')[0];
		this.nTabs = this.nTab.children;
		this.nThumb = this.container.getElementsByClassName('tabs_thumb')[0];
	};
	//高亮状态
	Tabs.prototype.highlight = function(index) {
		var tab = this.nTabs[index];
		this.nThumb.style.width = tab.offsetWidth + 'px';
		this.nThumb.style.left = tab.offsetLeft + 'px';
	};
	//选中状态
	Tabs.prototype.setCurrent = function(index) {
		this.nTabs[this.index].className = '';
		this.index = index;
		this.nTabs[this.index].className = 'z-active';
		this.highlight(index);
	};
	
	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = Tabs;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return Tabs;
		});
	} else {
		// 直接暴露到全局
		window.Tabs = Tabs;
	}
	
})(window, undefined)