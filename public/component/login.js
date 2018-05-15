//登录弹窗组件
(function(window, undefined) {
		var template = '<div class="m-loginmodal clearfix">\
	<span class="close_btn u-icon cancel"></span>\
	<div class="modal_tt clearfix"><strong>欢迎回来</strong><span>还没有账号？<a class="u-link" id="goregister">立即注册</a></span></div>\
	<form class="m-form-1" id="loginform">\
		<div class="u-formitem">\
			<input id="username" type="text" placeholder="手机号" class="formitem_ct u-ipt"/>\
		</div>\
		<div class="u-formitem u-formitem-1">\
			<input id="password" type="password" placeholder="密码" class="formitem_ct p-ipt"/>\
		</div>\
		<div class="u-formitem u-formitem-2 clearfix">\
			<label for="remember" class="u-checkbox u-checkbox-remember">\
				<input type="checkbox" class="remember" id="remember"/>\
				<i class="u-icon u-icon-checkbox"></i>\
				<i class="u-icon u-icon-checkboxchecked"></i>\
				<span>保持登录</span>\
			</label>\
			<span class="f-fr">忘记密码？</span>\
		</div>\
		<div class="u-error">\
			<span class="u-icon u-icon-error"></span>\
			<span class="errormsg"></span>\
		</div>\
		<button class="u-btn u-btn-submit" type="submit">登&nbsp;&nbsp;录</button>\
	</form>\
</div>';

		function LoginModal(options) {
			this.content = template;
			//改变Modal组件this指向
			window.Modal.call(this, options);
			//创建DOM
			this.goregister = this.container.getElementsByClassName('u-link')[0];
			this.closeBtn = this.container.getElementsByClassName('close_btn')[0];
			this.loginusername = this.container.getElementsByClassName('u-ipt')[0];
			this.loginpassword = this.container.getElementsByClassName('p-ipt')[0];
			this.loginremember = this.container.getElementsByClassName('remember')[0];
			this.loginerrorbox = this.container.getElementsByClassName('u-error')[0];
			this.loginerror = this.container.getElementsByClassName('errormsg')[0];
			this.submitbtn = this.container.getElementsByClassName('u-btn-submit')[0];
			//初始化
			this.init();
		};
		LoginModal.prototype = Object.create(window.Modal.prototype);
		LoginModal.prototype.constructor = LoginModal;
		//初始函数
		LoginModal.prototype.init = function() {
			//添加事件（关闭、立即注册、提交）
			this.closeBtn.addEventListener('click', this.hide.bind(this));
			this.goregister.addEventListener('click', function() {
				this.hide(this);
				modalregister.show();
			}.bind(this));

			this.submitbtn.addEventListener('click', this.submit.bind(this));
		};
		//检测函数
		LoginModal.prototype.check = function() {
			var validator = window.validator;
			var isValid = true,
				flag = true;

			flag = flag && !validator.isEmpty(this.loginusername.value);
			flag = flag && validator.isPhone(this.loginusername.value);
			flag ? this.loginusername.className = 'formitem_ct u-ipt' : this.loginusername.className = 'formitem_ct u-ipt n-error';
			isValid = isValid && flag;

			flag = true;
			flag = flag && !validator.isEmpty(this.loginpassword.value);
			flag ? this.loginpassword.className = 'formitem_ct p-ipt' : this.loginpassword.className = 'formitem_ct p-ipt n-error';
			//!flag && this.showError(this.loginpassword,true);
			isValid = isValid && flag;
			isValid || (this.loginerror.style.background = 'url(../img/header/error.gif) no-repeat');
			isValid || (this.loginerror.innerText = '账号或密码不正常，请重新输入');

			return isValid;
		};
		//	LoginModal.prototype.showError = function(){
		//		this.loginerrorbox.className = 'u-error f-dn';
		//	};
		//提交
		LoginModal.prototype.submit = function(event) {
			event.preventDefault();
			if(this.check()) {
				var data = {
					username: this.loginusername.value.trim(),
					password: hex_md5(this.loginpassword.value),
					remember: !!this.loginremember.checked
				};
				_.ajax({
						url: '/api/login',
						method: 'POST',
						data: data,
						success: function(data) {
							data = JSON.parse(data);
							console.log(data);
							if(data.code === 200) {
								this.hide();
								guest.style.display = 'none';
								//console.log(guest);
								//console.log(user);
								userbox.style.display = 'block';
								user_name.innerHTML = data.result.nickname;
								var iconConfig = {
									0: 'u-icon-male',
									1: 'u-icon-female'
								};
								for(var key in iconConfig) {
									_.delClassName(SexIcon, iconConfig[key]);
								}
								_.addClassName(SexIcon, iconConfig[data.result.sex]);
								
							console.log(data);
						} else {
							// 根据不同代码错误，显示不同的错误提示
							switch(data.code) {
								case 400:
									this.loginerror.innerText = '密码错误，请重新输入';
									break;
								case 404:
									this.loginerror.innerText = '用户不存在，请重新输入';
									break;
							};
							this.showError();
						};
					}.bind(this),
					fail: function() {}
				});
		};
	}; 
	
	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = LoginModal;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return LoginModal;
		});
	} else {
		// 直接暴露到全局
		window.LoginModal = LoginModal;
	}
	

})(window, undefined)