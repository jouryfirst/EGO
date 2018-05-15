//banner组件（最早写这个组件尚未写好root，有些事件直接用的复杂方法）
(function(window, undefined) {
	function Slider() {
		//创建DOM
		this.slider = document.getElementsByClassName('m-slider')[0];
		this.sliders = this.slider.getElementsByClassName('banner_img');
		this.imgLength = this.sliders.length;
		this.interval = 5000;
		this.cursors = this.buildCursors();
		//给指示器添加事件
		this.slider.addEventListener('mouseenter', this.stop.bind(this));
		this.slider.addEventListener('mouseleave', this.autoPlay.bind(this));
		//初始化
		this.nav(this.initIndex || 0);
		this.autoPlay();
	}

	// 构建指示器节点
	Slider.prototype.buildCursors = function() {
		var cursor = html2node('<ul class="m-cursor"></ul>');

		function html2node(str) {
			var container = document.createElement('div');
			container.innerHTML = str;
			return container.children[0];
		}
		var html = '';
		// 添加指示器按钮
		for(var i = 0; i < this.imgLength; i++) {
			html += '<li data-index='+ i +'></li>';
		}
		cursor.innerHTML = html;
		// 将指示器添加到banner中
		this.slider.appendChild(cursor);
		//		console.log(circle[2].getAttribute('data-index'));
		cursor.addEventListener('click', function(event) {
			//console.log(event);
			var data_index = event.target.dataset.index;
			//console.log(event.target.getAttribute);
			if(typeof data_index !== 'undefined') {
				// 点击对应点指向对应图片
				this.nav(data_index);
			}
		}.bind(this));

		return cursor.children;
	}
	//下一页
	Slider.prototype.next = function() {
		var index = (this.index + 1) % this.imgLength;
		this.nav(index);
	}
	//跳到指定页
	Slider.prototype.nav = function(index) {
		if(this.index === index) return;
		this.last = this.index;
		//console.log(this.last);
		this.index = index;
		this.fade();
		this.setCurrent();
	}
	//设置当前选中状态
	Slider.prototype.setCurrent = function() {
		if(typeof this.last !== 'undefined') {
			//去除之前选中节点的选中状态
			this.sliders[this.last].className = 'banner_img';
			this.cursors[this.last].className = '';
		}
		//添加当前选中节点的选中状态
		this.sliders[this.index].className = 'banner_img z-active';
		this.cursors[this.index].className = 'z-active';
	}
	//自动播放
	Slider.prototype.autoPlay = function() {
		clearInterval(this.timer);
		this.timer = setInterval(
			this.next.bind(this), this.interval);
	}
	//停止自动播放
	Slider.prototype.stop = function() {
		clearInterval(this.timer);
	}
	//切换效果
	Slider.prototype.fade = function() {
		if(typeof this.last !== 'undefined') {
			this.sliders[this.last].style.opacity = 0;
			//console.log(this.last);
		}
		this.sliders[this.index].style.opacity = 1;
		//console.log(this.index);
	}
		// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = Slider;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return Slider;
		});
	} else {
		// 直接暴露到全局
		window.Slider = Slider;
	}
	
})(window, undefined)