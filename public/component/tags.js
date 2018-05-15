//上传作品页面标签组件
(function(window, undefined) {

	var html = '<div class="m-tag">\
		<div class="f-cb tag_title_box">\
			<label class="tag_title c-title">标签</label>\
			<ul class="tag_list clearfix"></ul>\
		</div>\
		<div class="f-cb">\
			<label class="tag_recommend c-title">推荐标签</label>\
			<ul class="tag_rec_list"></ul>\
		</div>\
	</div>';

	function Tag(option) {
		_.extend(this, option);
		// 创建DOM
		this.container = _.html2node(html);
		this.tagUrl = this.container.getElementsByClassName('tag_list')[0];
		this.tagRecUrl = this.container.getElementsByClassName('tag_rec_list')[0];
		this.parent = document.getElementsByClassName('m-work-tags')[0];
		this.tagList = [];
		this.tagListRec = [];
		//初始化
		this.init();

	}

	Tag.prototype.getValue = function() {
		return this.tagList.join(',')
	};

	// 添加标签
	Tag.prototype.addTag = function(tags, target, before) {
		let that = this;
		let add = function(tag) {
			typeof before === 'undefined' ? this.target.appendChild(_.html2node('<li>'+tag+'</li>')) : this.target.insertBefore(_.html2node('<li>'+tag+'</li>'), this.before);
				//console.log(tag);
				that.tagList.push(tag);
		};

		// tags支持格式，自定义标签为字符串，推荐标签为数组
		if(tags && !Array.isArray(tags)) tags = [tags];
		let context = {};
		target && (context.target = target);
		before && (context.before = before);
		target === this.tagUrl ? context.list = this.tagList : context.list = this.tagListRec;

		// 遍历tags, 添加tag
		(tags || []).forEach(add, context);
	};
	//移除标签
	Tag.prototype.removeTag = function(event) {
		if(this.tagList.indexOf(event.target.innerText) !== -1) {
			// 从选中tagList中移除
			this.tagList.splice(this.tagList.indexOf(event.target.innerText), 1);
			// 从节点中移除
			event.target.parentNode.removeChild(event.target);
		}
	};

	// 添加事件
	Tag.prototype.addEvent = function() {
		_.addEvent(this.tagRecUrl, 'click', function(event) {
			if(event.target.nodeName.toUpperCase() == 'LI'){
				this.addTag(event.target.innerText, this.tagUrl, this.add_tag);
			};
		}.bind(this));

		// 点击选中标签事件
		_.addEvent(this.tagUrl, 'click', function(event) {
			if(event.target.nodeName.toUpperCase() === 'LI') {
				this.removeTag(event);
			}
			// 自定义标签按钮
			if(event.target === this.add_tag_btn) {
				_.addClassName(this.add_tag_btn, 'f-dn');
				_.delClassName(this.add_tag_input, 'f-dn');
				this.add_tag_input.value = '';
				this.add_tag_input.focus();
			}
		}.bind(this));
		// 添加自定义标签
		var addCustomTag = function(event) {
			if(event.target.value.trim()) {
				this.addTag(event.target.value.trim(), this.tagUrl, this.add_tag);
			}
			_.addClassName(this.add_tag_input, 'f-dn');
			_.delClassName(this.add_tag_btn, 'f-dn');
		}.bind(this);
		// 添加自定义标签输入框事件（失去焦点或回车都可以触发）
		_.addEvent(this.add_tag_input, 'blur', addCustomTag);
		_.addEvent(this.add_tag_input, 'keydown', function(event) {
			if(event.keyCode === 13) {
				addCustomTag(event);
			}
		});
	};
	// 初始化自定义标签列表
	Tag.prototype.initTagList = function() {
		// 节点
		this.add_tag = _.html2node('<li class="add_tag"><input class="f-dn" placeholder="按回车输入"/><span>自定义标签</span></li>');
		this.tagUrl.appendChild(this.add_tag);
		this.add_tag_input = this.add_tag.getElementsByTagName('input')[0];
		this.add_tag_btn = this.add_tag.getElementsByTagName('span')[0];
	};
	// 初始函数
	Tag.prototype.init= function() {
		_.ajax({
        url: '/api/tags?recommend',
        method: 'GET',
        success: function(data){
            data = JSON.parse(data);
            console.log(data);
            if(data.code === 200){
                 this.tags_recommend = data.result.split(',');   
                 this.tags_recommend && this.addTag(this.tags_recommend, this.tagRecUrl);
            } else console.log(data);
        }.bind(this),
        fail:function(){console.log('data translate fail')}
    });
		this.initTagList();
		this.addEvent();
		this.parent.appendChild(this.container);
	};

	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global
	// 支持commonjs
	if(typeof exports === 'object') {
		module.exports = Tag;
		// 支持amd
	} else if(typeof define === 'function' && define.amd) {
		define(function() {
			return Tag;
		});
	} else {
		// 直接暴露到全局
		window.Tag = Tag;
	}
})(window, undefined);