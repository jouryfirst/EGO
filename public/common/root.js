
(function (root) {

    var document = root.document;

	// 工具函数对象
	var _ = Object.create(null);

    // 事件绑定兼容性写法
    _.addEvent = function(ele, type, fn) {
        document.addEventListener ? ele.addEventListener(type, fn): ele.attachEvent('on' + type, fn);
    }

        // 事件代理
    _.delegateEvent = function(ele, tag, eventName, fn) {
            _.addEvent(ele, eventName, function () {
                var event = arguments[0] || window.event,
                    target = event.target || event.srcElement;
                if (target && target.tagName === tag.toUpperCase()) {
                    fn.call(target, event);
                }
            });
        };

        // 增加classname
    _.addClassName = function (node, className) {
            var current = node.className || "";
            if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
                node.className = current ? ( current + " " + className ) : className;
            }
        };

        // 删除classname
    _.delClassName = function (node, className){
            var current = node.className || "";
            node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
        };

    // 判断是否有某个classname
    _.hasClassName = function (node, className){
            var current = node.className || "", flag;
            if ((" " + current + " ").indexOf(" " + className + " ") === -1){
                flag = false;
            } else {
                flag = true;
            }
            return flag;
        };

        // html转node节点
    _.html2node =  function (str){
            var container = document.createElement('div');
            container.innerHTML = str;
            return container.children[0];
        };

         // 属性赋值
    _.extend = function (o1,o2){
            // console.log(o1)
        for (var i in o2) if (typeof o1[i] === 'undefined') {
                o1[i] = o2[i];
            }
            return o1;
         };


    // 事件发射器
    _.emitter = {
            // 注册事件
            on: function(event, fn) {
                var handles = this._handles || (this._handles = {}),
                    calls = handles[event] || (handles[event] = []);
                // 找到对应名字的栈
                calls.push(fn);

                return this;
            },

            // 触发事件
            emit: function(event){
                var args = [].slice.call(arguments, 1),
                    handles = this._handles, calls;


                if (!handles || !(calls = handles[event])) return this;
                // 触发所有对应名字的listeners
                for (var i = 0, len = calls.length; i < len; i++) {
                    calls[i].apply(this, args)
                }
                return this;
            },

            // 解绑事件
            off: function(event, fn) {
                if(!event || !this._handles) this._handles = {};
                if(!this._handles) return;

                var handles = this._handles , calls;

                if (calls = handles[event]) {
                    if (!fn) {
                        handles[event] = [];
                        return this;
                    }
                    // 找到栈内对应listener 并移除
                    for (var i = 0, len = calls.length; i < len; i++) {
                        if (fn === calls[i]) {
                            calls.splice(i, 1);
                            return this;
                        }
                    }
                }
                return this;
            }

        };


   //ajax请求
    _.ajax = function (obj) {
        var xhr = (function () {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else {
                return new ActiveXobject('Microft.XMLHttp');
            }
        })(), data;


        if (obj.method.toUpperCase() === 'GET') {
            obj.url += obj.data ? ('?'+ _.serialize(obj.data)) : '';
        }


        if (obj.method.toUpperCase()  === 'POST' || obj.method.toUpperCase()  === 'PATCH') {
            data = obj.data ? JSON.stringify(obj.data) : null;
            console.log(obj.data, obj.url, obj.method)
        }

        xhr.open(obj.method, obj.url, true);

        // 请求头 设置需要放在open方法后面执行，否则会报错
        xhr.setRequestHeader('Content-Type','application/json');


        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
                    obj.success(xhr.responseText);
                }else{
                    obj.fail(xhr);
                    console.log('The error code：' + xhr.status + ' and msg is ：' + xhr.statusText);
                }
            }
        };
        xhr.send(data);
    };

    // 序列化参数
    _.serialize = function (data) {
        if (!data) return '';
        var pairs = [];
        for (var name in data) {
            if (!data.hasOwnProperty(name)) continue;
            if (typeof data[name] === 'function') continue;
            var value  = data[name].toString();
            name  = encodeURIComponent(name);
            value = encodeURIComponent(value);
            pairs.push(name + '=' + value);
        }
        return pairs.join('&');
    };
    // 级联数据结构映射
    _.toSelectData = function(data){
        // 映射函数
        function mapping(data){
            // 对data数组映射
            return data.map(function(item){
                // 设置对应对象的 name，value
                var result_data = {
                    name: item[1],
                    value: item[0]
                };
                // 若存在第3项, 则递归映射第3项
                item[2] && (result_data.list = mapping(item[2]));
                return result_data;
            });
        }
        return mapping(data);

    };


    //  以选择器data格式，生成日期数据 {name:,value:,list:}
    _.createDateData = function(start_year, end_year){
        start_year = start_year || 1949;    // 初始值
        end_year = end_year || new Date().getFullYear();
        // 日模板  (用模板，可以省去第3重循环，提升效率)
        var day_template = [];
        for(var k=1;k<=31;k++){
            day_template.push({name:k,value:k});
        }
        var select_data = [];
        for(var i=start_year;i<=end_year;i++){
            var year = {
                name: i,
                value: i,
                list: []
            }
            for(var j=1;j<=12;j++){
                var month = {
                    name: j,
                    value: j,
                    list: day_template.slice(0,new Date(i,j,0).getDate())
                }
                year.list.push(month);
            }
            select_data.unshift(year);
        }
        return select_data;
    };

    // 计算年龄
    _.calculateAge = function(birthday){
        birthday = birthday.replace(/-/g,'/');
        return parseInt((new Date().getTime() - new Date(birthday).getTime()) / 1000 / 3600 / 24 / 365, 10);
    };

    //  查找城市名
    _.searchCity = function(src, target){
        src.some(function(item){
            if(parseInt(item[0]) === parseInt(target.province)){
                item[2].some(function(item){
                    if(parseInt(item[0]) === parseInt(target.city)){
                        target.city_name = item[1];
                        return true;
                    }
                });
                return true;
            }
        });
        return target.city_name ;
    };


    //  计算星座
    _.calculateZodiac = function(birthday){
        birthday = birthday.split('-');
        var month = Number(birthday[1]);
        var day = Number(birthday[2]);
        var userInfo;
        var zodiac = [
            [12,22,1,19,'摩羯'],
            [1,20,2,18,'水瓶'],
            [2,19,3,20,'双鱼'],
            [3,21,4,20,'白羊'],
            [4,21,5,20,'金牛'],
            [5,21,6,21,'双子'],
            [6,22,7,22,'巨蟹'],
            [7,23,8,22,'狮子'],
            [8,23,9,22,'处女'],
            [9,23,10,22,'天秤'],
            [10,23,11,21,'天蝎'],
            [11,22,12,21,'射手']
        ];
        zodiac.some(function(item){
            if( (item[0] === month && item[1] <= day) || (item[2] === month && item[3] >= day) ){
                userInfo = item[4];
                return true;
            }

        });
        return userInfo;
    };   
    root._ = _;
})(window);