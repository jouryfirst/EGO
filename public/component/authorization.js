//作品上传页面作品授权组件
(function(window, undefined) {

	var html = '<div><label class = "c-title">作品授权</label>\
               	</div>';

	function Authorization(option) {
		_.extend(this, option);
		//创建DOM
		this.authorization = _.html2node(html);
		this.parent = document.getElementsByClassName('m-authorization')[0];

		this.init();
	}
		// 返回选择的值
		Authorization.prototype.getValue = function() {
			return {
				authorization: this.select.getValue()
			}
		};

		// 初始函数，并利用select组件渲染下拉列表
		Authorization.prototype.init = function() {
			this.select = new Select({parent: this.authorization});
			this.select.render([
                    {name:'不限制作品用途', value:0},
                    {name:'限制作品用途', value:1}
                ]);
			this.parent.appendChild(this.authorization);
		};

	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = Authorization;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return Authorization;
		});
	} else {
		// 直接暴露到全局
		window.Authorization = Authorization;
	}
})(window, undefined);