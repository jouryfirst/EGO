window.onload = function() {
	new Tabs();
	new Search();
	var tag = new Tag();
	new Authorization();
	var uploadimg = new UploadImg();
	var modal = new Modal();
	var modallogin = new LoginModal();
	var modalregister = new RegisterModal();
	var guest = document.getElementById('guest');
	var userbox = document.getElementById('userdropdown');
	var user_name = document.getElementById('name');
	var SexIcon = document.getElementsByClassName('u-icon-sex')[0];
	var loginner = document.getElementById('login');
	var registerner = document.getElementById('register');
	var ulstar = document.getElementsByClassName('m-list-star')[0];

	loginner.addEventListener('click', function() {
		modallogin.show();
		console.log('1');
	});
	registerner.addEventListener('click', function() {
		modalregister.show();
	});
	
	    // 缓存节点
    var that = this;
    var submit_btn = document.getElementsByClassName('u-btn-work-submit')[0];
    this.desc = document.getElementsByClassName('m-work-detail')[0];
    this.input = this.desc.getElementsByClassName('u-ipt-name')[0];
    this.msg =  this.desc.getElementsByClassName('prompt_msg')[0];
    
	 function checkForm(data) {
        var flag = true;
        if(that.input.value.length === 0 || that.input.value.trim() === '') {
            flag = false;
        }
        else if(data.pictures.length === 0){
            alert('请选择图片上传');
            return false
        } else if(!data.coverId || !data.coverUrl){
            alert('请设置封面图片');
            return false
        }
        return flag;
    };
    function submitForm(data) {
			// 若表单数据不合格，则不做提交请求
			if(!checkForm(data)){return;}
			// 提交表单请求
			_.ajax({
				url: '/api/works',
				method: 'POST',
				data: data,
				success: function(res){
					res = JSON.parse(res);
					console.log(res);
					// 上传成功
					if(res.code === 200){
						// 跳转回列表页
						window.location.href = "/works/create";
					}
				},
				fail: function(e){
					console.log(e);
				},
				header: {'content-type': 'application/json'}
			});
		};
		function addEvent(){
			// 绑定提交表单事件
			submit_btn.addEventListener('click', function(){
				// 新创建作品数据
				var new_work = {};
            _.extend(new_work, getDescValue());
            _.extend(new_work, getWorkValue());
            _.extend(new_work, getPrivilegeValue());
            _.extend(new_work, getAuthorizationValue());
            _.extend(new_work, uploadimg.getValue());
            new_work.tag = tag.getValue();
            submitForm(new_work);
			}.bind(this));
		};
		addEvent();


    // 作品描述
    function getDescValue() {
        if(that.input.value.length === 0 || that.input.value.trim() === ''){
            _.delClassName(that.msg, 'f-dn');
        } else{
            _.addClassName(that.msg, 'f-dn');
        } return {
            name: this.desc.querySelector('input').value.trim(),
            description: this.desc.querySelector('textarea').value.trim()
        };
    };

    // 原创 or 临摹
    function getWorkValue() {
         return {
             category: document.querySelector('.workClass input').value.trim()
        };
    };

    // 权限设置
    function getPrivilegeValue() {
        return {
            privilege: document.querySelector('.m-radio input').value.trim()
        };
    };

    // 作品授权设置
    function getAuthorizationValue() {
        return {
            authorization: document.querySelector('.m-select .select_val').innerText.trim()
        };
    };

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
}