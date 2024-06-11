/**
 * SimpleCore.js
 * SimpleUI的核心文件,包括动态加载模块和一个构造函数声明模块...
 * @author:蓝面小生
 * @version 0.9
 * 2011-10-08
 */
if (typeof Simple == "undefined") {
    var Simple = {};
}

Simple.mixin = $.extend;

Simple.log = function(msg){
    if (window.console) {
        console.log(msg);
    }
}
Simple.isIE6=$.browser.msie&&($.browser.version == "6.0");
/**
 * 声明一个命名空间
 * @param {string} arguments
 * @return {object} o 根据给出的字符串创建的对象
 *<p>
 *<code>
 * Simple.namespace("Simple.dd");
 * Simple.dd.Drag=function(){}
 *</code>
 *</p>
 */
Simple.namespace = function(){
    var a = arguments, o = this, i = 0, j, d, arg;
    for (; i < a.length; i++) {
        arg = a[i];
        if (arg.indexOf(".")) {
            d = arg.split(".");
            for (j = (d[0] == 'Simple') ? 1 : 0; j < d.length; j++) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
            }
        }
        else {
            o[arg] = o[arg] || {};
        }
    }
    return o;
}
Simple.bridgeTojQuery = function(methodName, widget){
    var methodArray = methodName.split(",");
    jQuery.each(methodArray, function(i, n){
        jQuery.fn[n] = function(config){
            return this.each(function(){
                if (config == "destroy") {
                    if (jQuery.data(this, "widget_" + n)) {
                        jQuery.data(this, "widget_" + n).destroy();
                        $(this).removeData("widget_" + n);
                        return;
                    }
                    else {
                        return true;
                    }
                }
                config = Simple.mixin({}, config, {
                    node: this
                });
                //不要重复绑定
               // if (jQuery.data(this, "widget_" + n)) {
                 //   return;
               // }
                var demo = new widget(config);
                jQuery.data(this, "widget_" + n, demo);
            });
        }
    });
}//require,define
;
(function(){
    var require, define;
    Simple.loaded = {};
    Simple.defined = {};
    //队列
    var Queue = function(q){
        this.queue = q || [];
    };
    Queue.prototype = {
        next: function(){
            return this.queue.shift();
        },
        last: function(){
            return this.queue.pop();
        },
        add: function(){
            this.queue.push.apply(this.queue, arguments);
        },
        size: function(){
            return this.queue.length;
        }
    };
    define = function(mName, callback){
        //定义即加载
        //if (!Simple.loaded[mName]) {
        
        Simple.loaded[mName] = true;
        if (typeof callback == "function") {
            Simple.defined[mName] = callback();
        }
        else {
            Simple.defined[mName] = callback;
        }
        //}
    }
    var time, isLoad = false, loadJs = function(uri, callback, path, isOpenMinify){
        var uris;
        if (isOpenMinify) {
            if (typeof uri == "string") {
                uris = uri;
            }
            else {
                uris = uri.join(".js,");
            }
        }
        else {
            uris = uri;
        }
        var script = document.createElement("script");
        //uris = uri.replace(/./, "/");
        script.type = "text/javascript";
        script.src = path ? path + uris + ".js" : uris + ".js";
        document.getElementsByTagName("head")[0].appendChild(script);
        script.onreadystatechange = script.onload = function(){
            clearTimeout(time);
            if (isOpenMinify && uri instanceof Array) {
                $.each(uri, function(i, n){
                    Simple.loaded[n] = true;
                })
            }
            else {
                Simple.loaded[uri] = true;
            }
            callback();
            script.onreadystatechange = script.onload = null;
            isLoad = true;
        }
        time = setTimeout(function(){
            if (!isLoad) {
                Simple.log("装载资源失败：名称：" + uri + ",错误：装载超时！");
                // script.parentNode.removeChild(script);
            }
        }, 5000);
    }
    var _loading = false, requireList, require = function(mName, callback, path, isOpenMinify){
        //正在加载中。。将现在的函数放入队列
        if (!requireList) {
            requireList = new Queue();
            requireList.add({
                mName: mName,
                callback: callback,
                path: path,
                isOpenMinify: isOpenMinify
            });
        }
        if (_loading) {
            requireList.add({
                mName: mName,
                callback: callback,
                path: path,
                isOpenMinify: isOpenMinify
            });
        }
        else {
            //执行加载
            //启用压缩
            //if(isOpenMinify){
            //if(mName instanceof Array){
            //mName=mName.join(".js,");
            //}
            //}
            _dealLoadJs(mName, callback, path, isOpenMinify);
        }
    }
    var _dealLoadJs = function(mName, callback, path, isOpenMinify){
        _loading = true;
        if (typeof mName == "string") {
            _dealLoadJsString(mName, callback, path, isOpenMinify)
        }
        else {
            _dealLoadJsArray(mName, callback, path, isOpenMinify);
        }
    }, _dealLoadJsString = function(mName, callback, path, isOpenMinify){
        //加载当前模块
        if (isModuleExsit(mName)) {
            callback(getModuleObj(mName));
            requireList.next();
            _loading = false;
            if (requireList.queue[0]) {
                require(requireList.queue[0].mName, requireList.queue[0].callback, requireList.queue[0].path, requireList.queue[0].isOpenMinify);
            }
        }
        else {
            //从外部加载
            loadJs(mName, function(){
                callback(getModuleObj(mName));
                requireList.next();
                _loading = false;
                if (requireList.queue[0]) {
                    require(requireList.queue[0].mName, requireList.queue[0].callback, requireList.queue[0].path, requireList.queue[0].isOpenMinify);
                }
            }, path, isOpenMinify)
        }
    }, jsList, args = [], _dealLoadJsArray = function(mName, callback, path, isOpenMinify){
        //启用压缩，遍历模块，剔除已经加载的模块
        if (isOpenMinify) {
            var newMname = [];
            $.each(mName, function(i, n){
                if (!Simple.loaded[n]) {
                    newMname.push(n);
                }
            });
            if (newMname.length > 0) {
                loadJs(newMname, function(){
                    callback.apply(this, args);
                    requireList.next();
                    _loading = false;
                    if (requireList.queue[0]) {
                        require(requireList.queue[0].mName, requireList.queue[0].callback, requireList.queue[0].path, requireList.queue[0].isOpenMinify);
                    }
                }, path, isOpenMinify);
            }
            else {
                callback.apply(this, args);
                requireList.next();
                _loading = false;
                if (requireList.queue[0]) {
                    require(requireList.queue[0].mName, requireList.queue[0].callback, requireList.queue[0].path, requireList.queue[0].isOpenMinify);
                }
            }
            return;
        }
        //将当前JS队列加载完毕
        jsList = jsList || new Queue(mName);
        //队列未加载完毕，继续加载直到加载完毕
        if (jsList.size() > 0) {
            if (isModuleExsit(jsList.queue[0])) {
                args.push(getModuleObj(jsList.queue[0]));
                jsList.next();
                _dealLoadJsArray(mName, callback, path, isOpenMinify);
            }
            else {
                loadJs(jsList.queue[0], function(){
                    args.push(getModuleObj(jsList.queue[0]));
                    jsList.next();
                    _dealLoadJsArray(mName, callback, path, isOpenMinify);
                }, path);
            }
            //队列加载完毕
        }
        else {
            jsList = null;
            callback.apply(this, args);
            requireList.next();
            _loading = false;
            if (requireList.queue[0]) {
                require(requireList.queue[0].mName, requireList.queue[0].callback, requireList.queue[0].path, requireList.queue[0].isOpenMinify);
            }
        }
    }, isModuleExsit = function(moduleName){
        if (Simple.loaded[moduleName]) {
            return true;
        }
        else {
            return false;
        }
    }, getModuleObj = function(moduleName){
        return Simple.defined[moduleName];
    }
    Simple.require = require;
    Simple.define = define;
})();

//declare;
(function(){
    var _crackName = function(name){
        var index = name.lastIndexOf("."), clsName, o, args;
        if (index != -1) {
            args = name.substring(0, index);
            o = Simple.namespace(args);
            clsName = name.substring(index + 1, name.length);
        }
        else {
            clsName = name;
            o = Simple;
        }
        return {
            clsName: clsName,
            o: o
        };
    }
    Simple.mixin(Simple, {
        /**
         * 用于继承的静态方法
         *@param {object} subCls 用于继承的子类
         *@param {object} superCls 被继承的父类
         *@return {object} subCls 返回子类
         */
        extend: function(subCls, superCls){
            var F = function(){
            }, subClsProp;
            F.prototype = superCls.prototype;
            subClsProp = subCls.prototype = new F();
            subCls.prototype.constructor = subCls;
            subCls.superclass = superCls.prototype;
            return subCls;
        },
        declare: function(subCls, superCls, prop){
            Simple.loaded[subCls] = true;
            var o = _crackName(subCls), subCls = o.o[o.clsName] = function(opts){
                if (superCls) {
                    subCls.superclass.constructor.apply(this, arguments);
                }
                Simple.mixin(this, opts);
                prop.init.call(this, opts);
                if (opts && opts.plugins) {
                    for (var i = 0; i < opts.plugins.length; i++) {
                        this.usePlugin(opts.plugins[i]);
                    }
                }
            }
            if (superCls) {
                Simple.extend(subCls, superCls);
            }
            for (var key in prop) {
				
					subCls.prototype[key] = prop[key];
					if(typeof prop[key] =="function"&&key!= "init"){
						subCls.prototype[key].supername = key;
					}
				
            }
            subCls.prototype._meta = {};
            subCls.prototype._meta.className = o.clsName;
            if (superCls) {
                /**
                 * 调用父类的方法
                 *@param {array} 传入的参数
                 */
                subCls.prototype.supermethod = function(args){
                    if (args.callee.supername) {
                        return subCls.superclass[args.callee.supername]();
                    }
                }
                //取得父类的方法
                subCls.prototype.getSuperMethod = function(name){
                    if (subCls.superclass[name]) {
                        return subCls.superclass[name];
                    }
                }
            }
            subCls.prototype._plugins = {};
            subCls.prototype.addPlugin = function(name, callback){
                this._plugins[name] = callback;
                if (callback.methods) {
                    Simple.mixin(subCls.prototype, callback.methods);
                }
            }
            subCls.prototype.usePlugin = function(name){
                if (this._plugins[name] && typeof this._plugins[name] === "function") {
                    this._plugins[name]();
                }
                else 
                    if (this._plugins[name]._init) {
                        this._plugins[name]._init.call(this);
                    }
                    else {
                        Simple.log("还没有为 " + o.clsName + " 定义 " + name + " 插件");
                    }
            }
            //使用已经声明的对象
            subCls.prototype.useObject = function(name, opts){
                var config;
                if (typeof obj == "function") {
                    try {
                        var node = this.node;
                        if (this.node instanceof jQuery) {
                            node = (this.node)[0]
                        }
                        if (opts) {
                            config = Simple.mixin({}, opts, {
                                node: node
                            });
                        }
                        else {
                            config = {
                                node: node
                            }
                        }
                        new obj(config);
                    } 
                    catch (e) {
                        Simple.log(e, "貌似没有为其作为插件接口");
                    }
                }
                else {
                    Simple.log(obj, "不存在这个构造函数！");
                }
            }
        },
        plugin: function(name, obj, callback){
        
            obj.prototype.addPlugin(name, callback);
            
        },
        override: function(cls, prop){
            if (cls) {
                for (var methodName in prop) {
                    cls.prototype[methodName] = prop[methodName];
                }
            }
            else {
                Simple.log(cls, "该对象还没有被声明!")
            }
        }
    });
})();
(function(){
    var UserData = {
        userData: null,
        name: location.hostname,
        init: function(){
            if (!UserData.userData) {
                try {
                    UserData.userData = document.createElement('INPUT');
                    UserData.userData.type = "hidden";
                    UserData.userData.style.display = "none";
                    UserData.userData.addBehavior("#default#userData");
                    document.body.appendChild(UserData.userData);
                    var expires = new Date();
                    expires.setDate(expires.getDate() + 365);
                    UserData.userData.expires = expires.toUTCString();
                } 
                catch (e) {
                    return false;
                }
            }
            return true;
        },
        
        setItem: function(key, value){
        
            if (UserData.init()) {
                UserData.userData.load(UserData.name);
                UserData.userData.setAttribute(key, value);
                UserData.userData.save(UserData.name);
            }
        },
        
        getItem: function(key){
            if (UserData.init()) {
                UserData.userData.load(UserData.name);
                return UserData.userData.getAttribute(key)
            }
        },
        
        remove: function(key){
            if (UserData.init()) {
                UserData.userData.load(UserData.name);
                UserData.userData.removeAttribute(key);
                UserData.userData.save(UserData.name);
            }
            
        }
    };
    //本地存储
    Simple.local = {
        get: function(key){
            if (!window.localStorage) {
                return UserData.getItem(key);
            }
            else {
                return window.localStorage.getItem(key);
            }
        },
        set: function(key, value){
            if (!window.localStorage) {
                if (value) {
                    UserData.setItem(key, value);
                }
                else {
                    UserData.remove(key);
                }
            }
            else {
                if (value) {
                    window.localStorage.setItem(key, value);
                }
                else {
                    window.localStorage.removeItem(key);
                }
            }
        }
    }
    //cookie
    Simple.cookie = {
        get: function(name){
            var cookieValue = "";
            var search = name + "=";
            if (document.cookie.length > 0) {
                offset = document.cookie.indexOf(search);
                if (offset != -1) {
                    offset += search.length;
                    end = document.cookie.indexOf(";", offset);
                    if (end == -1) 
                        end = document.cookie.length;
                    cookieValue = unescape(document.cookie.substring(offset, end));
                }
            }
            return cookieValue;
        },
        set: function(name, value, hours){
            var expire = "";
            if (hours != null) {
                expire = new Date((new Date()).getTime() + hours * 3600000);
                expire = "; expires=" + expire.toGMTString();
            }
            document.cookie = name + "=" + escape(value) + expire + ";path=/";
        }
    }
})();
/**
 * 这个插件来自于github jquery hot keys
 * Simple.keyup("body","ctrl+q",function(){
 * })
 */
(function(){
    $.hotkeys = {
    
        specialKeys: {
            8: "backspace",
            9: "tab",
            13: "return",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "del",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scroll",
            191: "/",
            224: "meta"
        },
        
        shiftNums: {
            "`": "~",
            "1": "!",
            "2": "@",
            "3": "#",
            "4": "$",
            "5": "%",
            "6": "^",
            "7": "&",
            "8": "*",
            "9": "(",
            "0": ")",
            "-": "_",
            "=": "+",
            ";": ": ",
            "'": "\"",
            ",": "<",
            ".": ">",
            "/": "?",
            "\\": "|"
        }
    };
    
    function keyHandler(handleObj){
        if (typeof handleObj.data !== "string") {
            return;
        }
        
        var origHandler = handleObj.handler, keys = handleObj.data.toLowerCase().split(" ");
        
        handleObj.handler = function(event){
            if (this !== event.target &&
            (/textarea|select/i.test(event.target.nodeName) ||
            event.target.type === "text")) {
                return;
            }
            
            var special = event.type !== "keypress" && $.hotkeys.specialKeys[event.which], character = String.fromCharCode(event.which).toLowerCase(), key, modif = "", possible = {};
            
            if (event.altKey && special !== "alt") {
                modif += "alt+";
            }
            
            if (event.ctrlKey && special !== "ctrl") {
                modif += "ctrl+";
            }
            
            if (event.metaKey && !event.ctrlKey && special !== "meta") {
                modif += "meta+";
            }
            
            if (event.shiftKey && special !== "shift") {
                modif += "shift+";
            }
            
            if (special) {
                possible[modif + special] = true;
                
            }
            else {
                possible[modif + character] = true;
                possible[modif + jQuery.hotkeys.shiftNums[character]] = true;
                
                if (modif === "shift+") {
                    possible[jQuery.hotkeys.shiftNums[character]] = true;
                }
            }
            
            for (var i = 0, l = keys.length; i < l; i++) {
                if (possible[keys[i]]) {
                    return origHandler.apply(this, arguments);
                }
            }
        };
    }
    
    $.each(["keydown", "keyup", "keypress"], function(){
        $.event.special[this] = {
            add: keyHandler
        };
    });
    
    //Y的便捷方式
    $.each(["keydown", "keyup", "keypress"], function(k, v){
        Simple[v] = function(el, key, callback){
            $(el).bind(v, key, function(){
                callback($(el))
                return false;
            });
        }
    })
})();
