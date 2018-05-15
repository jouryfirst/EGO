//上传组件
(function (window,undefined) {

    var template = '<div class="m-upload clearfix">\
		<div class="upload_box f-cb">\
			<label class="upload_title">上传图片</label>\
			<div class="upload_description">\
				<div class="f-cb">\
					<label>\
						<span class="upload_btn u-btn u-btn-primary">选择图片上传</span>\
						<input class="u-ipt" type="file" multiple accept="image/*" />\
					</label>\
					<progress class="f-dn" max="100" value="50"></progress>\
					<span class="progress_msg" ></span>\
				</div>\
				<p class="prompt_box">提示：作品可以包含多张图片，一次选择多张图片，最多不超过10张（单张图片大小小于1M）</p>\
			</div>\
		</div>\
		<ul class="pictures_controller f-cb">\
		</ul>\
	</div>';


    function UploadImg(options) {
        _.extend(this, options);
        //创建DOM
        this.container = _.html2node(template);
        this.upload_btn = this.container.getElementsByClassName('upload_btn')[0];
        this.upload_input = this.container.getElementsByClassName('u-ipt')[0];
        this.parent = document.getElementsByClassName('uploadImg')[0];
        this.progress = this.container.getElementsByTagName('progress')[0];
        this.progress_msg = this.container.getElementsByClassName('progress_msg')[0];
        this.pictures_controller = this.container.getElementsByClassName('pictures_controller')[0];
        this.picture_list = [];
        //初始化
        this.init();
    }
    _.extend(UploadImg.prototype, _.emitter);

       UploadImg.prototype.changeHandler = function () {
            var files = this.upload_input.files;
            this._checkFiles(files);
            // 清空列表中的内容
            this.upload_input.value = null;
       };
        // 拖拽上传文件
        UploadImg.prototype.dropFiles = function (files) {
            this._checkFiles(files);
        };
        //check图片规格
        UploadImg.prototype._checkFiles = function (files) {
            var maxSize = 1024 * 1024, sizeOkFiles = [], sizeExceedFiles = [], typeExceedFiles = [];

            if(files.length > 10){
                alert('图片数量超过10张了')
                return false;
            }

            [].forEach.call(files, function(item){
                if(!/^image\//.test(item.type)){
                    typeExceedFiles.push(item);
                    return false;
                }
                if(item.size < maxSize) sizeOkFiles.push(item);
                else                    sizeExceedFiles.push(item);
            });

            if(sizeExceedFiles.length > 0){
                alert('图片大小不能超过1M');
                return false;
            }
            // 禁止点击上传按钮
            _.addClassName(this.upload_btn, 'f-select');
            this._uploadFiles(sizeOkFiles);
        };

        UploadImg.prototype._uploadFiles =function (files) {
            // 上传文件总个数
            this.uploadfiles_total = files.length;
            // 已上传完成文件数
            this.uploadfiles_loaded = 0;
            // 上传文件进度条 数组
            this.uploadfiles_progress = [];
            //添加末端
            for(var i=0;i<files.length;i++){
                this.uploadfiles_progress.push(0);
            }
            // 显示进度条
            this._showProgress(0, files.length);
            var uploadRequests = [];

            // 并发各图片上传请求
            files.forEach(function(item, index){
                uploadRequests.push(new Promise(function(resolve, reject){
                        //储存文件类型 数据
                        var data = new FormData();
                        data.append('file', item, item.name);

                        var xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.onreadystatechange = function(){
                            if(xhr.readyState === 4){
                                if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
                                    resolve(JSON.parse(xhr.responseText).result);
                                } else{
                                    reject(xhr.responseText);
                                }
                            }
                        };

                        console.log(xhr.upload)
                        xhr.upload.addEventListener('progress', this.progressHandler.bind(this, index), true);
                        xhr.open('POST', '/api/works?upload');
                        xhr.send(data);

                    }.bind(this))
                        .then(function(data){
                            this._addImg(data);
                            return data;
                        }.bind(this))
                        .catch(function(){console.log('上传图片过程中抛出异常')})
                );
            }.bind(this));
            // 全部请求返回后隐藏进度条
            Promise.all(uploadRequests)
                .then(function(){
                    this._hideProgress();
                    this._updateProgressMsg();
                    _.delClassName(this.upload_btn, 'f-select');
                }.bind(this))
                .catch(function(){console.log('请求返回后抛出异常')})
        };
        // 添加图片
        UploadImg.prototype._addImg = function (data) {
            switch(Object.prototype.toString.call(data).slice(8,-1)){
                case 'String': return false;
                case 'Array':
                    data.forEach(function(item){
                        _addOneImg.call(this, item);
                    }.bind(this));
                    break;
                case 'Object':
                    _addOneImg.call(this, data);
                    break;
            }
            // 添加 单张照片
            function _addOneImg(data){
                this.picture_list.push(data);
//              var reader = new FileReader;
//              upload_input.onChange() = function(){
//              	reader.readAsDataURL(this.files[0]);
//              };
                
                var html = '<li data-id="'+ data.id +'" data-url="'+ data.url +'">\
                        <img src="'+ data.url +'" class = "upload_img" />\
                        <div class="hover_bg">\
                            <i class="u-icon u-icon-delete"></i>\
                        </div>\
                        <button class="u-btn u-btn-link">设为封面</button>\
                        <button class="u-btn u-btn-link">已设为封面</button>\
                    </li>';
                this.containerbox = _.html2node(html);
//              var imgreader = this.containerbox.getElementsByClassName('upload_img'[0]);
//              reader.onloadend = function(){
//              	imgreader.src = this.result;
//              }
                this.pictures_controller.appendChild(this.containerbox);
            }
        };
        // HTML5原生进度条
        UploadImg.prototype.progressHandler = function (index, event) {
            if(event){
                this.uploadfiles_progress[index] = event.loaded / event.total;
                if(this.uploadfiles_progress[index] === 1){this.uploadfiles_loaded ++;}
            }
            this._showProgress(this.uploadfiles_progress.reduce(function(prev, cur){return prev + cur;}));
        };

        // 展示进度条信息
        UploadImg.prototype._showProgress = function (value, max) {
            this.progress.max = max || this.progress.max || 0;
            this.progress.value = value;
            _.delClassName(this.progress, 'f-dn');
            this._updateProgressMsg(this.progress.value, this.progress.max);
        };

        // 更新进度条内容
        UploadImg.prototype._updateProgressMsg = function (value, max) {
            var progress_msg = '';
            if(typeof value !== 'undefined' && typeof max !== 'undefined'){
                progress_msg = '共有' + this.uploadfiles_total + '个文件，已完成' + this.uploadfiles_loaded + '个文件，上传进度'+parseInt(value / max * 100, 10)+'%';
            }
            // 更新进度条
            this.progress_msg.innerHTML = progress_msg;
        };

        UploadImg.prototype._hideProgress=function () {
            _.addClassName(this.progress, 'f-dn');
        };

        // 设置选中图片设为封面操作
        UploadImg.prototype.setCoverImg = function (event) {
            if(!_.hasClassName(event.target, 'u-btn')){return;}
            [].forEach.call(this.pictures_controller.children, function(li){
                _.delClassName(li, 'z-active');
            });
            _.addClassName(event.target.parentNode, 'z-active');
            _.addClassName(event.target, 'z-choosen');
            this.coverImg = {
                id: event.target.parentNode.dataset.id,
                url: event.target.parentNode.dataset.url
            };
        };

        // 移除图片
        UploadImg.prototype.removeImg = function (event) {
            if(!_.hasClassName(event.target, 'u-icon')) return;

            var li = event.target.parentNode.parentNode;
            if(li.nodeName.toUpperCase() === 'LI'){
                var id =  li.dataset.id;
                this.pictures_controller.removeChild(li);
                for(var i = this.picture_list.length - 1;i >= 0; i--){
                    if(this.picture_list[i].id === id){
                        this.picture_list.splice(i,1);
                    }
                }
            }
        };

        // 接口字段 图片信息 coverId coverUrl pictures
        UploadImg.prototype.getValue = function () {
            return {
                coverId: this.coverImg ? this.coverImg.id : undefined,
                coverUrl: this.coverImg ? this.coverImg.url : undefined,
                pictures: this.picture_list.map(function(item, index){
                    var picture = {};
                    for(let key in item){
                        picture[key] = item[key];
                    }
                    picture['position'] = index;
                    return picture;
                })
            }
        };

        // 初始化函数
        UploadImg.prototype.init = function () {
            // 通过change事件使上传的内容在改变上传内容（输入域）执行
            this.upload_input.addEventListener('change', this.changeHandler.bind(this));

            // 添加拖拽事件
            this.pictures_controller.addEventListener('dragover', function(event){
                event.preventDefault();
            });
            // 拖动过程中释放鼠标触发事件
            this.pictures_controller.addEventListener('drop', function(event){
                event.preventDefault();
                this.dropFiles(event.dataTransfer.files);
            }.bind(this));

            // 添加事件（设置/移除图片封面）
            this.pictures_controller.addEventListener('click', this.setCoverImg.bind(this));
            this.pictures_controller.addEventListener('click', this.removeImg.bind(this));
            this.parent.appendChild(this.container);
        };

   

    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = UploadImg;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return UploadImg;
        });
    } else {
        // 直接暴露到全局
        window.UploadImg = UploadImg;
    }

})(window,undefined);