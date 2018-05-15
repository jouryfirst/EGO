//作品列表组件
(function(window, undefined) {
   //课程中用的handlebars不是很熟悉，这里用的还是添加内容的方式
	var template = '<div class="g-main">\
	<div class="g-wrap">\
		<ul class="m-works">\
			<li class="item">\
				<a href="#">\
					<img src="" alt=""/>\
					<h3>唯美的</h3>\
				</a>\
				<div class="icons">\
					<i class="u-icon u-icon-edit"></i>\
					<i class="u-icon u-icon-delete"></i>\
				</div>\
			</li>\
		</ul>\
	</div>\
</div>';

	function WorkList(options) {
		_.extend(this, options);
		// 创建DOM
		this.loading = document.querySelector('.u-icon-load');
		this.container = _.html2node(template);
		this.parent = document.getElementsByClassName('m-worklist')[0];
		this.parent.appendChild(this.container);
		//初始化
		this.initWorkList();
	};
	_.extend(WorkList.prototype, _.emitter);

		// 渲染作品列表
		WorkList.prototype.getWorksList = function(options) {
			options = options || {};
			this.workList && _.addClassName(this.workList, 'f-dn');
			//_.delClassName(this.loading, 'f-dn');

			// 更新查询参数
			typeof options.total === 'undefined' || (this.param_total = options.total);
			typeof options.offset === 'undefined' || (this.param_offset = options.offset);
			typeof options.limit === 'undefined' || (this.param_limit = options.limit);

			_.ajax({
				url: '/api/works',
				method: 'GET',
				data: {
					total: this.param_total,
					offset: this.param_offset,
					limit: this.param_limit 
				},
				success: function(data) {
					data = JSON.parse(data);
					if(data.code === 200) {
						_.addClassName(this.loading, 'f-dn');
						console.log(data.result);
						this.render(data.result);
						this.renderPage(data.result);
					}
				}.bind(this),
				fail: function() {}
			});
		};

		WorkList.prototype.renderPage = function(data) {

			this.pagination = new Pagination({ 
				parent: document.getElementsByClassName('d-workstitle')[0],
				total: data.total,
				togglePageNum: this.getWorksList.bind(this)
			});
		};
		//添加内容
		WorkList.prototype.render = function(data) {
			this.ul = this.container.getElementsByClassName('m-works')[0];
			console.log(this.ul);
			console.log(data.data);
			var html = '';
			data.data.forEach(function(obj) {
					html += this.renderList(obj);
			}.bind(this));
			console.log(html);

			this.ul.innerHTML = html;

		};

		WorkList.prototype.renderList = function(item) {
			console.log(item.id);
			this.workbox = document.getElementsByClassName('g-wrap')[0];
			console.log(this.workbox);
			if(item.length == 0) {
				this.workbox.innerHTML = '<span class = "noworks">你还没有创建过作品~</span>';
				return;
			};
			var html = '<li class="item" data-id="'+ item.id +'" data-name="'+ item.name +'">\
				<a href="/works/detail/'+ item.id +'">\
					<img src="'+ item.coverUrl+'" alt=""/>\
					<h3>'+ item.name +'</h3>\
				</a>\
				<div class="icons">\
					<i class="u-icon u-icon-edit"></i>\
					<i class="u-icon u-icon-delete"></i>\
				</div>\
			</li>';
			return html;

		};

		// 点击删除或编辑触发事件进行操作
		WorkList.prototype.clickHandler = function(event) {
			var target = event.target;
			if(_.hasClassName(target, 'u-icon-delete')) {
				console.log('111');
				var modal = new Modal();
				modal.emit('confirm');
				this.delWork(target.parentNode.parentNode.dataset);
			}
			if(_.hasClassName(target, 'u-icon-edit')) {
				this.editWork(target.parentNode.parentNode.dataset, target);
			}
		};
		//接下来的emit事件不能成功在全局触发，于是直接定义了confirm事件
		// 删除作品
		WorkList.prototype.delWork = function(data) {
			// 调用Modal组件对象来触发事件
			var alert = new Modal();
			//alert.on('confirm',{content:'111'})
			alert.on('confirm',function(item){
				console.log('test');
				this.body.innerHTML = item.content;
				this.confirmCallBack = item.confirmCallBack;
				this.container.getElementsByClassName('close_btn')[0].addEventListener('click',alert.hide.bind(this));
				this.container.getElementsByClassName('u-btn-cancel')[0].addEventListener('click',alert.hide.bind(this));
				this.container.getElementsByClassName('u-btn-submit')[0].addEventListener('click',function (event) {this.confirmCallBack(event);this.hide();}.bind(this));
				this.show();
			});
			alert.emit('confirm', {
				content: '<div class="detail-modal">\
								<h3 class="title">提示消息：</h3>\
								<span class="close_btn u-icon cancel"></span>\
								<div class="text">\
									确定要删除作品<span>&nbsp;"&nbsp;'+ data.name +'&nbsp;"&nbsp;</span>吗?\
								</div>\
								<button class="u-btn u-btn-submit">确定</button>\
								<button class="u-btn u-btn-cancel">取消</button>\
							</div>',
				confirmCallBack: function() {
					console.log('1');
					_.ajax({
						url: '/api/works/'+ data.id +'',
						method: 'DELETE',
						success: function() {
							console.log('wawa');
							this.getWorksList();
						}.bind(this),
						fail: function() {}
					});
				}.bind(this)
			});
		};

		// 修改作品名称
		WorkList.prototype.editWork = function(data, work_target) {
			var alert = new Modal();
			alert.on('confirm',function(item){
				this.body.innerHTML = item.content;
				this.confirmCallBack = item.confirmCallBack;
				this.container.getElementsByClassName('close_btn')[0].addEventListener('click',alert.hide.bind(this));
				this.container.getElementsByClassName('u-btn-cancel')[0].addEventListener('click',alert.hide.bind(this));
				this.container.getElementsByClassName('u-btn-submit')[0].addEventListener('click',function (event) {this.confirmCallBack(event);this.hide();}.bind(this));
				this.show();
			});
			alert.emit('confirm', {
				content:'<div class="detail-modal">\
								<h3 class="title">请输入新作品名称：</h3>\
								<span class="close_btn u-icon cancel"></span>\
								<div class="text">\
									<input class="u-ipt new_name" value="'+ data.name +'" />\
								</div>\
								<button class="u-btn u-btn-submit">确定</button>\
								<button class="u-btn u-btn-cancel">取消</button>\
							</div>',
				confirmCallBack: function(event) {
					var confirm_modal = event.target.parentNode.parentNode;
					var new_name = confirm_modal.querySelector('.new_name').value.trim();
					// 如果新的作品名为空则不修改
					if(new_name) {
						_.ajax({
							url: '/api/works/'+ data.id +'',
							method: 'PATCH',
							data: {
								name: new_name
							},
							success: function(data) {
								data = JSON.parse(data);
								console.log(data)
								var name_node = work_target.parentNode.parentNode.querySelector('h3');
								name_node.innerHTML = new_name;
								work_target.parentNode.parentNode.dataset.name = new_name;
							}.bind(this),
							fail: function() {}
						});
					}
				}.bind(this)
			});
		};
		//初始函数
		WorkList.prototype.initWorkList = function() {
			this.param_total = 1;
			this.param_offset = 0;
			this.param_limit = 15;

			this.getWorksList();

			this.container.addEventListener('click', this.clickHandler.bind(this));
			this.loading = _.html2node('<img class="u-icon-load" src="../../img/detail/loading.gif">');
		    this.container.appendChild(this.loading);
		};

	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = WorkList;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return WorkList;
		});
	} else {
		// 直接暴露到全局
		window.WorkList = WorkList;
	}

})(window, undefined);