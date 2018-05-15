//作品列表页面个人信息组件
(function (window,undefined) {

    var template = '<div>\
    						<div class="u-avatar"></div>\
   						 <div class="userinfobox"></div>\
					</div>';

    function UserInfo(option) {
        _.extend(this, option);
        //创建DOM
        this.container = _.html2node(template);
        this.parent = document.getElementsByClassName('d-user')[0];
        this.userinfobox = this.container.getElementsByClassName('userinfobox')[0];
		//初始化
        this.init();
    }
    _.extend(UserInfo.prototype, _.emitter);
    //设置性别图标（对象、数组都可以，考虑到后面获取数据，为表现差异，用的对象。header的用户信息用的数组）
    var iconConfig = {
        0: 'u-icon-male',
		1: 'u-icon-female'
    };
    //添加内容
    UserInfo.prototype.render = function(data){
    		var html = '';
    		html = this.renderItem(data);
    		this.userinfobox.innerHTML = html;
    	
    };
    
    UserInfo.prototype.renderItem = function(data){
    			var html = '<div class="u-info">\
								<em class="name" title="'+ data.nickname +'">'+ data.nickname +'</em>\
								<span class="u-icon-sex '+ data.sex +'"></span>\
						</div>\
						<div class="u-info u-info-detail">\
								<span class="age">'+ data.age +'岁</span>\
								<span class="constellation">'+ data.zodiac +'座</span>\
								<span class="address-info">\
									<i class="u-icon u-icon-address"></i>\
									<span class="address">'+ data.city +'</span>\
								</span>\
						</div>';
		return html;
    };
    //初始函数
	UserInfo.prototype.init = function () {
            _.ajax({
               url: '/api/users?getloginuser',
               method: 'GET',
               success: function (data) {
                   data = JSON.parse(data);
                   var user_info = {
                       nickname: data.result.nickname,  
                       sex: iconConfig[data.result.sex],  
                       age: _.calculateAge(data.result.birthday),  
                       city: _.searchCity(ADDRESS_CODES, {province: data.result.province,city: data.result.city}), 
                       zodiac: _.calculateZodiac(data.result.birthday)  
                   };
                   this.parent.appendChild(this.container);
                   this.render(user_info);
                   //console.log(data, user_info.sex);
               }.bind(this),
                fail: function(){}
            });
      };


    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global

    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = UserInfo;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return UserInfo
        });
    } else {
        // 直接暴露到全局
        window.UserInfo = UserInfo;
    }

})(window,undefined);