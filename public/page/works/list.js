window.onload = function(){
	new Tabs();
	new Search();
	var userinfo = new UserInfo();
	var worklist = new WorkList();
	//var page_num = new Pagination();
	var modal = new Modal();
	var modallogin = new LoginModal();
	var modalregister = new RegisterModal();
	var guest = document.getElementById('guest');
	var userbox = document.getElementById('userdropdown');
	var user_name = document.getElementById('name');
	var SexIcon = document.getElementsByClassName('u-icon-sex')[0];
	var loginner = document.getElementById('login');
	var registerner = document.getElementById('register');
	loginner.addEventListener('click', function() {
		modallogin.show();
	});
	registerner.addEventListener('click', function() {
		modalregister.show();
	});
	var GetLoginUser = function(){
		_.ajax({
			url: '/api/users?getloginuser',
			method: 'GET',
			success: (function(data){
				data = JSON.parse(data);
				console.log(data);
				if(data.code === 200){
					// 触发登录事件
					guest.style.display = 'none';
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
				}
				// 如果不是200，则隐藏userbox，显示Guest，默认就是如此，无需操作
				else{
					// 触发未登录事件
					guest.style.display = 'block';
					userbox.style.display = 'none';
					
				}
			}).bind(this),
			fail: function(){
				console.log('api/users?getloginuser 失败');
			}
		})
	};
	GetLoginUser();
};
