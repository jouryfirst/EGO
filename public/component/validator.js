// 验证器组件
(function(window,undefined){

	var validator = {
		// 验证非空
		isEmpty: function(value){
			return typeof value === 'undefined' || !value.trim();
		},
		// 验证电话号码格式
		isPhone: function(value){
			return /^\d{11}$/.test(value);
		},
		// 验证昵称
		isNickName: function(value){
			// 中英文数字均可，至少8个字符
			return /^[\u4e00-\u9fa5a-zA-Z0-9]{8}[\u4e00-\u9fa5a-zA-Z0-9]*$/.test(value);
		},
		// 长度限制
		isLength: function(value){
			return /[a-zA-Z0-9]/.test(value) && value.length >= 6 && value.length < 16;
		}
	};

	window.validator = validator;

})(window,undefined);