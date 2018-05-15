//注册组件
(function(window,undefined){

	var template = '<div class="m-registermodal clearfix">\
		<span class="close_btn u-icon u-icon-close"></span>\
		<div><img class="logo" src="../../img/header/logo-register.gif" /></div>\
		<form class="m-form" id="registerform">\
			<div class="u-formitem">\
				<label for="phone" class="formitem_tt">手机号</label>\
				<input id="phone" name="phone" placeholder="请输入11位手机号码" class="formitem_ct u-ipt phone"/>\
			</div>\
			<div class="u-formitem">\
				<label for="nickname" class="formitem_tt">昵 称</label>\
				<input id="nickname" name="nickname" placeholder="中英文均可，至少8个字符" class="formitem_ct u-ipt nickname"/>\
			</div>\
			<div class="u-formitem">\
				<label for="password" class="formitem_tt">密 码</label>\
				<input type="password" id="password" name="password" placeholder="长度6-16个字符，不包含空格" class="formitem_ct u-ipt password"/>\
			</div>\
			<div class="u-formitem">\
				<label for="comform_password" class="formitem_tt">确认密码</label>\
				<input type="password" id="comform_password" name="comform_password" placeholder="" class="formitem_ct u-ipt comform_password"/>\
			</div>\
			<div class="u-formitem">\
				<label for="" class="formitem_tt">性 别</label>\
					<div class="sex_box">\
						<label>\
							<input type="radio" name="sex" checked value=0 />\
							<i class="u-icon u-icon-radio"></i>少&nbsp;男\
						</label>\
						<label>\
							<input type="radio" name="sex" value=1 />\
							<i class="u-icon u-icon-radio u-icon-radio-girl"></i>少&nbsp;女\
						</label>\
					</div>\
			</div>\
			<div class="u-formitem">\
				<label for="" class="formitem_tt">生 日</label>\
				<div class="formitem_ct">\
					<div class="m-cascadeselect birthday_select" id="birthday"></div>\
				</div>\
			</div>\
			<div class="u-formitem">\
				<label for="" class="formitem_tt">所在地</label>\
				<div class="formitem_ct">\
					<div class="m-cascadeselect location_select" id="location"></div>\
				</div>\
			</div>\
			<div class="u-formitem">\
				<label for="" class="formitem_tt">验证码</label>\
				<div class="formitem_ct-validate">\
					<input type="text" id="captcha" class="u-ipt captcha" />\
					<img id="captchaimg" class="captchaimg" src="/captcha" alt="" />\
				</div>\
			</div>\
			<div class="terms clearfix">\
				<label for="agree2terms" class="u-checkbox u-checkbox-agree">\
					<input type="checkbox" class="agree2terms"  id = "agree2terms" name="agree2terms" value="1" />\
					<i class="u-icon u-icon-checkbox"></i>\
					<i class="u-icon u-icon-checkboxchecked"></i>\
					<span>我已阅读并同意相关条款</span>\
				</label>\
			</div>\
			<div class="u-error f-dn"><span class="u-icon u-icon-error"></span><span class="errormsg"></span></div>\
			<button id="submit" class="u-btn u-btn-submit" type="submit">注&nbsp;&nbsp;册</button>\
		</form>\
	</div>';
	function RegisterModal(options){
		this.content = template;
		window.Modal.call(this, options);
		//设置节点
		this.closeBtn = this.container.getElementsByClassName('close_btn')[0]; 
		this.captchaImg = this.container.getElementsByClassName('captchaimg')[0]; 
		this.phone = this.container.getElementsByClassName('phone')[0]; 
		this.nick = this.container.getElementsByClassName('nickname')[0]; 
		this.pwd = this.container.getElementsByClassName('password')[0]; 
		this.confirmpwd = this.container.getElementsByClassName('comform_password')[0]; 
		this.captcha = this.container.getElementsByClassName('captcha')[0]; 
		this.agree2terms = this.container.getElementsByClassName('agree2terms')[0]; 
		this.registererrorBox = this.container.getElementsByClassName('u-error')[0]; 
		this.nError = this.container.getElementsByClassName('errormsg')[0]; 
		this.submitBtn = this.container.getElementsByClassName('u-btn-submit')[0]; 

		// 初始化
		this.initSelect();
		this.initRegisterEvent();
	}
	RegisterModal.prototype = Object.create(window.Modal.prototype);
	RegisterModal.prototype.constructor = RegisterModal;

	// 初始化选择器
	RegisterModal.prototype.initSelect = function(){
		 //生日 级联选择器
		this.birthdaySelect = new CascadeSelect({
			parent: this.container.getElementsByClassName('birthday_select')[0],
			// 生日数据
			data: _.createDateData()
		});
		// 地址 级联选择器
		this.locationSelect = new CascadeSelect({
			parent: this.container.getElementsByClassName('location_select')[0],
			// 地址数据
			data: _.toSelectData(ADDRESS_CODES)
		});
	};

	// 重置验证码
	RegisterModal.prototype.resetCaptcha = function(){
		this.captchaImg.src = '/captcha?t=' + new Date().getTime() + ''
	};
	// 表单验证
	RegisterModal.prototype.check = function(){
		var isValid = true,
			errorMsg = "";

		// 隐藏错误信息框
		_.addClassName(this.registererrorBox, 'f-dn');

		// check输入内容
		var checkList = [
			[this.phone, ['require', 'phone']],
			[this.nick, ['require', 'nickname']],
			[this.pwd, ['require', 'length']],
			[this.confirmpwd, ['require', 'length']],
			[this.captcha, ['require']]
		];
		isValid = this.checkRules(checkList);
		isValid || (this.nError.style.background = 'url(../img/header/error.gif) no-repeat');
		if(!isValid){
			errorMsg = '用户信息错误';
		}
		// 验证两次密码
		if(isValid && this.pwd.value !== this.confirmpwd.value){
			isValid = false;
			errorMsg = '2次密码不一致';
		}
		
		// 验证条款是否为空
		if(isValid && !this.agree2terms.checked){
			isValid = false;
			errorMsg = '未同意条款';
		}

		// 显示错误
		if(!isValid){
			this.nError.innerText = errorMsg;
			_.delClassName(this.registererrorBox, 'f-dn');
		}
		// 返回结果
		return isValid;
	};
	// 按规则验证表单
	RegisterModal.prototype.checkRules = function(checkRules){
		// 载入 数据验证器
		var validator = window.validator;
		// 验证结果
		var check_result = true;
		
		for(var i=0;i<checkRules.length;i++){
			// 被检查的元素节点
			var checkItem = checkRules[i][0];
			console.log(checkItem);
				// 规则数组
				rules = checkRules[i][1];
			// 去除错误标示
			_.delClassName(checkItem, 'n-error');

			for(var j=0;j<rules.length;j++){
				// 检测规则名称
				var key = rules[j];
				switch(key){
					case 'require':
						flag = !validator.isEmpty(checkItem.value);
						break;
					case 'phone':
						flag = validator.isPhone(checkItem.value);
						break;
					case 'nickname':
						flag = validator.isNickName(checkItem.value);
						break;
					case 'length':
						flag = validator.isLength(checkItem.value, 6, 16);
						break;
				}
				if(!flag){break;}
			}
			// 显示错误
			flag || _.addClassName(checkItem, 'n-error'); 
			flag || (check_result = false);
		}
		// 若无错误
		return check_result;
	}
	// 提交
	RegisterModal.prototype.submit = function(evt){
		evt.preventDefault();
		// 若验证成功
		if(this.check()){
			// 构造数据
			var data = {
				username: this.phone.value.trim(),
				nickname: this.nick.value.trim(),
				password: hex_md5(this.pwd.value),
				sex: this.getRadioValue('registerform', 'sex'),
				captcha: this.captcha.value.trim()
			};
			this.birthday = this.birthdaySelect.getValue().join('-');
			this.location = this.locationSelect.getValue();
			data.province = this.location[0];
			data.city = this.location[1];
			data.district = this.location[2];
			data.birthday = this.birthday;
			// 发送请求
			_.ajax({
				url:'/api/register',
				method:'POST',
				header: {
					'content-type': 'application/json'
				},
				data:data,
				success:function(data){
					console.log(data);
					data = JSON.parse(data);
					if(data.code === 200){
						this.hide();
					}
					else{
						this.nError.innerText = data.msg;
						this.showError();
					}
				}.bind(this),
				fail:function(){}
			});
		}
	};
	// 获取 单选框的值
	RegisterModal.prototype.getRadioValue = function(registerform, sex){
		return document.getElementById(registerform)[name=sex].value;
	};
	// 显示错误信息
	RegisterModal.prototype.showError = function(){
		_.delClassName(this.registererrorBox, 'f-dn');
	};

	// 初始函数
	RegisterModal.prototype.initRegisterEvent = function(){
		// 添加事件（关闭、二维码、提交）
		this.closeBtn.addEventListener('click', this.hide.bind(this));
		this.captchaImg.addEventListener('click', this.resetCaptcha.bind(this));
		this.submitBtn.addEventListener('click', this.submit.bind(this));
	};
	
	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = RegisterModal;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return RegisterModal;
		});
	} else {
		// 直接暴露到全局
		window.RegisterModal = RegisterModal;
	}
	

})(window,undefined);