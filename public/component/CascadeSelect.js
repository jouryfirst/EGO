// 级联选择器组件
(function(window,undefined){
	function CascadeSelect(options){
		_.extend(this, options);
		// 缓存 各级选择器节点 列表
		this.selectList = [];
		// 初始化
		this.init();
	}

	// 设置初始函数
	CascadeSelect.prototype.init = function(){
		for(var i=0;i<3;i++){
			// 创建 选择级组件
			var select = new window.Select({
				parent: this.parent
			});
			// 订阅 select事件，用于触发级联关系
			select.on('select',this.onChange.bind(this, i));
			// 缓存选择器节点
			this.selectList[i] = select;
		}
		// 1级下拉菜单,初始化数据
		this.selectList[0].render(this.data);
	}
    //选择器级联关系
	CascadeSelect.prototype.onChange = function(index, data){
		// 无关的选择器直接退出。
		if(this.selectList[index] !== data.target){return;}
		// 下级选择器，若是最后一个选择器，则退出
		var next = index + 1;
		if(next === this.selectList.length){return;}
		// else更新渲染下级 选择菜单;
		this.selectList[next].render(this.getList(next, data.index));
	}
	// 获取第n个Select的下拉列表数据
	CascadeSelect.prototype.getList = function(n, index){
		return this.selectList[n-1].options[index].list;
	}
	CascadeSelect.prototype.getValue = function(){
		var value = [];
		for(var i=0;i<3;i++){
			value.push(this.selectList[i].getValue());
		}
		return value;
	}
// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = CascadeSelect;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return CascadeSelect;
		});
	} else {
		// 直接暴露到全局
		window.CascadeSelect = CascadeSelect;
	}
	
})(window,undefined);