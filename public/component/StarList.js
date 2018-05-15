//明日之星组件（加载有点缓慢）
(function(window, undefined) {

	var template = '<div class="m-section-star">\
                        <ul class="m-list2 starlist clearfix"></ul>\
                    </div>';

	function StarList(option) {
		_.extend(this, option);
		// 创建DOM
		this.container = _.html2node(template);
		this.ul = this.container.getElementsByClassName('starlist')[0];
		this.parent = document.getElementsByClassName('m-section-starlist')[0];
		//初始化
		this.init();
	};
	//获取数据
	StarList.prototype.getstarlist = function(){
		_.ajax({
			url: '/api/users?getstarlist',
			method: 'GET',
			success: function(data){
				data = JSON.parse(data);
				console.log(data);
				if(data.code === 200){
					this.render(data.result);
				}
			}.bind(this),
			fail: function(){}
		});
	};
	//添加列表
	StarList.prototype.render = function(data) {
		var html = '';
		data.forEach(function(item) {
			html += this.renderItem(item);
		}.bind(this));
		this.ul.innerHTML = html;
	};
	var followConfig = [{
		class: '',
		icon: 'u-icon-add',
		text: '关注'
	}, {
		class: 'z-follow',
		icon: 'u-icon-right',
		text: '已关注'
	}];
	//渲染列表
	StarList.prototype.renderItem = function(data) {
		console.log(data);
		var config = followConfig[Number(!!data.isFollow)];
		console.log(config);
		var html = '<li class="m-card">\
                            <img src="../img/StarList/avatar'+data.id+'.png" alt="头像" class="card_avatar">\
                            <div class="card_info">\
                                <div class="card_name">'+ data.nickname +'</div>\
                                <div class="card_fans">\
                                    <span class="works">作品&nbsp;&nbsp;'+ data.workCount +'</span>\
                                    粉丝&nbsp;&nbsp;'+ data.followCount +'\
                                </div>\
                            </div>\
                            <button class="u-btn-follow '+ config.class +'" data-userid="'+ data.id +'" data-nickname="'+ data.nickname+'" data-workcount="'+ data.workCount +'" data-followcount="'+ data.followCount +'" >\
                                <span class="'+ config.icon +'"></span><p>'+config.text+'</p>\
                            </button>\
                        </li>';
		return html;
	};
	//点击事件
	StarList.prototype.followHandler = function(event) {
		var target = event.target;
		var user_name = document.getElementById('name');
		console.log(user_name);
		if(target.tagName !== 'BUTTON' && target.parentNode.tagName === 'BUTTON') {
			target = target.parentNode;
		}
		console.log(target.dataset.nickname);
		if(target.tagName === 'BUTTON') {
			// 未登录需要弹出登录框
			if(user_name.innerHTML == '') {
				modallogin.show(); 
				return;
			};
			// 已登录
			var data;
			data = {
				id: target.dataset.userid,
				nickname: target.dataset.nickname,
				workCount: target.dataset.workcount,
				followCount: target.dataset.followcount
			};
			// 已关注
			if(_.hasClassName(target, 'z-follow')) {
				this.unFollow(data, target.parentNode);
			} else {
				this.follow(data, target.parentNode);
			};
		};
	};
	//获取关注数据
	StarList.prototype.follow = function(followInfo, replaceNode) {
		_.ajax({
			url: '/api/users?follow',
			method: 'POST',
			data: {
				id: followInfo.id
			},
			header: {
				'content-type': 'application/json'
			},
			success: function(data) {
				data = JSON.parse(data);
				console.log(data);
				if(data.code === 200) {
					// 状态变成 已关注
					followInfo.isFollow = true; 
					// 关注人数 ＋1
					followInfo.followCount++; 
					var newNode = _.html2node(this.renderItem(followInfo));
					replaceNode.parentNode.replaceChild(newNode, replaceNode);
				}
			}.bind(this),
			fail: function() {}
		});
	};
	//获取取消关注数据
	StarList.prototype.unFollow = function(followInfo, replaceNode) {
		_.ajax({
			url: '/api/users?unfollow',
			method: 'POST',
			data: {
				id: followInfo.id
			},
			header: {
				'content-type': 'application/json'
			},
			success: function(data) {
				data = JSON.parse(data);
				console.log(data);
				if(data.code === 200) {
					// 状态变成+关注
					followInfo.isFollow = false;
					// 关注人数 -1
					followInfo.followCount--;
					var newNode = _.html2node(this.renderItem(followInfo));
					replaceNode.parentNode.replaceChild(newNode, replaceNode);
				}
			}.bind(this),
			fail: function() {}
		});
	};
	//初始函数
	StarList.prototype.init = function(){
		this.getstarlist();
		
		// 添加事件
		this.ul.addEventListener('click', this.followHandler.bind(this)); 
		this.parent.appendChild(this.container);		
	};
	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = StarList;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return StarList;
		});
	} else {
		// 直接暴露到全局
		window.StarList = StarList;
	}
	

})(window, undefined);