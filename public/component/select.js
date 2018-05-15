// 选择器组件
(function(window,undefined){

	var template = '<div class="m-select">\
		<div class="select_hd">\
			<span class="select_val"></span>\
			<span class="u-icon u-icon-dropdown"></span>\
		</div>\
		<ul class="select_opt f-dn"></ul>\
	</div>';

	function Select(options){
		_.extend(this, options);		
		// 创建DOM
		this.body = _.html2node(template);
		this.nOption = this.body.getElementsByClassName('select_opt')[0];
		this.nValue = this.body.getElementsByClassName('select_val')[0];

		// 初始化
		this.init();
	}
	_.extend(Select.prototype, _.emitter);

	// 渲染下拉列表
	Select.prototype.render = function(data, defaultIndex){ 
		// 更新下拉列表
		var optionsHTML = '';
		data = data || []; 
		for(var i = 0;i < data.length;i++){
			// 格式化数据
			optionsHTML += '<li data-index=' + i + '>' + data[i].name +'</li>'
		}
		this.nOption.innerHTML = optionsHTML;
		this.nOptions = this.nOption.children;
		this.options = data;
		this.selectedIndex = undefined;
		// 默认选中第一项
		this.setSelect(defaultIndex || 0);
	};
	// 设置选中项
	Select.prototype.setSelect = function(index){
		if(this.selectedIndex !== undefined){
			_.delClassName(this.nOptions[this.selectedIndex], 'z-select');
		}
		this.selectedIndex = index;
		// 被选项非空
		if(this.nOptions.length > 0){
			_.addClassName(this.nOptions[this.selectedIndex], 'z-select');
			this.nValue.innerText = this.options[this.selectedIndex].name;
		}
		else{
			this.nValue.innerText = '';
		}
		this.emit('select', {
			value: this.getValue(),  // 数据值（如：地址编码）
			target: this, // 触发事件的选择器 本身，用于辅助判定级联选择器中，哪些选择器响应
			index: this.selectedIndex // 选中选项的序号，用于找出下级选择器 下拉菜单的数据
		});
	};
	// 获取选项值
	Select.prototype.getValue = function(){
		return typeof this.options[this.selectedIndex] !== 'undefined' ? this.options[this.selectedIndex].value : '';
	};

	// 切换展开、关闭下拉列表
	Select.prototype.toggle = function(){
		// 展开、关闭不共存
		_.hasClassName(this.nOption, 'f-dn') ? this.open() : this.close();
	};
	// 展开
	Select.prototype.open = function(){
		_.delClassName(this.nOption, 'f-dn');
	};
	// 关闭
	Select.prototype.close = function(){
		_.addClassName(this.nOption, 'f-dn');
	};

	// 与选择器的交互
	Select.prototype.clickHandler = function(evt){
		evt.target.dataset.index !== undefined ? this.setSelect(evt.target.dataset.index) : null;
		this.toggle();
	};

	// 初始事件
	Select.prototype.initEvent = function(){
		// 添加事件
		this.body.addEventListener('click', this.clickHandler.bind(this));
		document.addEventListener('click', function(evt){
			try{
				for(var i=0;i<evt.path.length;i++){
					if(evt.path[i] === this.body){
						return;
					}
				};
			}
			catch(e){
				if(evt.target.parentNode === this.body || evt.target.parentNode.parentNode === this.body){
					return;
				}
			}
			this.close();
		}.bind(this));
	};
	// 初始函数
	Select.prototype.init = function(){
		this.initEvent();
		this.parent.appendChild(this.body);
	}
		// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = Select;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return Select;
		});
	} else {
		// 直接暴露到全局
		window.Select = Select;
	}
	

})(window,undefined);