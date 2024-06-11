/**
 * @author 蓝面小生
 * 需要注意的事项
 * 1.发送ajax请求获取数据需要延时执行
 * 2.缓存之前已经获得的数据以便减少请求数目
 * //TODO: 在有滚动的情况下，控制滚动条的位置
 *         格式化数据的函数
 */
(function(){
    Simple.namespace("keyCode");
    Simple.mixin(Simple.keyCode, {
        ENTER: function(e){
            return e.keyCode == 13;
        },
        ESC: function(e){
            return e.keyCode == 27;
        },
        DOWN: function(e){
            return e.keyCode == 40;
        },
        UP: function(e){
            return e.keyCode == 38;
        },
        DEL: function(e){
            return e.keyCode == 46;
        },
        PAGELEFT: function(e){
        
        },
        PAGERIGHT: function(e){
        
        },
        SHIFT: function(e){
            return e.keyCode == 16;
        },
        CTRL: function(e){
            return e.keyCode == 17;
        },
        ALT: function(e){
            return e.keyCode == 18;
        },
        BACKSPACE: function(e){
            return e.keyCode == 8;
        }
    });
    Simple.declare("AutoComplete", null, {
        //触发自动完成的节点
        node: null,
        source: null,
        format: null,
        delay: 0,
		isResult:function(data){
			return data.length;
		},
		dealData:function(data){
			return data;
		},
        onchange: function(value, data){
        
        },
        onselect: function(value, data){
        
        },
        init: function(){
            var self = this;
            this.cacheData = {};
            this.currentData = [];
            this.lastKeyPress = null;
            this.lastSelectedValue = null;
            this.active = false;//当有自动完成的值时
            this.local = $.isArray(this.source);
            //是否已经激活了自动提示
            this.node = $(this.node);
            //bind event
            this.node.bind("autocomplete/keydownEvent", function(e, event){
                self._keydownEvent.apply(self, [event]);
            }).bind("autocomplete/blurEvent", function(){
                self._blurEvent.apply(self);
            }).attr("autocomplete", "off");
            //trigger event
            this.node.keyup(function(e){
                self.node.trigger("autocomplete/keydownEvent", [e]);
            }).blur(function(e){
                self.node.trigger("autocomplete/blurEvent");
            });
        },
        destroy: function(){
            this.node.unbind("autocomplete/keydownEvent").unbind("autocomplete/blurEvent").removeAttr("autocomplete");
        },
        _keydownEvent: function(e){
            var self = this;
            self.lastKeyPress = e.keyCode;
            switch (self.lastKeyPress) {
                case 38:
                    //up
                    e.preventDefault();
                    if (self.active) {
                        self.focusPrev();
                    }
                    else {
                    
                    }
                    break;
                case 40:
                    e.preventDefault();
                    if (self.active) {
                        self.focusNext();
                    }
                    else {
                        self.activeAutoComplete();
                    }
                    break;
                case 9:
                case 13:
                    e.preventDefault();
                    if (self.active) {
                        self.selectCurrent();
                        return false;
                    }
                    break;
                case 27:
                    //esc
                    e.preventDefault();
                    if (self.active) {
                        self.finish();
                    }
                    break;
                default:
                    self.activeAutoComplete();
            }
        },
        _blurEvent: function(){
            if (!this._mouseInSelect) {
                this.finish();
            }
        },
        activeAutoComplete: function(){
            var self = this;
            if (self.timeOutActive) {
                clearTimeout(self.timeOutActive);
            }
            if (self.delay && !self.local) {
                self.timeOutActive = setTimeout(function(){
                    self.activeNow();
                }, self.delay);
            }
            else {
                self.activeNow();
            }
        },
        activeNow: function(){
            var value = $.trim(this.node.val());
            if (value.length < 1) {
                this.finish();
				 this.lastProcessValue=null;
                return;
            }
            if (value != this.lastSelectedValue) {
                //this.active = true;
                this.lastProcessValue = value;
                this.getData(value);
            }
        },
        finish: function(){
            this.active = false;
            this.menuContainer && this.menuContainer.hide();
        },
        getData: function(value){
            var self = this;
            if (this.local) {
                //有数据
                if (this.source.length) {
                    //过滤数据
                    this.currentData = this.filterData(this.source, value);
                    self.parseData(self.currentData);
                }
            }
            else {
                var data = this.getCache(value);
                if (data && data.length) {
                    self.currentData = data;
                    self.parseData(self.currentData);
                }
                else {
                    if (typeof this.source == "string") {
                        var sendData = {}, name = this.node.attr("name");
                        sendData[name] = this.lastProcessValue;
                        $.ajax({
                            url: this.source,
                            data: sendData,
                            dataType: "json",
                            success: function(r){
                                self.currentData = r;
                                self.setCache(value, r);
                                self.parseData(self.currentData)
                            }
                        });
                    }
                    else 
                        if (typeof this.source == "function") {
                            this.source(this.lastProcessValue, function(data){
                                self.currentData = data;
                                self.setCache(value, data);
                                self.parseData(self.currentData);
                            });
                        }
                }
            }
        },
        filterData: function(data, val){
            var newArr = [];
            $.each(data, function(i, n){
                var reg = new RegExp(val, "gi");
                if (n.label) {
                    if (reg.test(n.label) || reg.test(n.value)) {
                        newArr.push(n);
                    }
                }
                else {
                    if (reg.test(n)) {
                        newArr.push(n);
                    }
                }
            });
            return newArr;
        },
        parseData: function(data){
            //var data = this.currentData;
			if(this.isResult(data)){
                this.active = true;
                this.createDom();
				var data=this.dealData(data)
                this.renderMenu(data, this.lastProcessValue);
                this.position();
            }
            else {
                this.finish();
            }
        },
        createDom: function(){
            var self = this;
            if (this.menuContainer) {
                return;
            }
            else {
                var div = $("<div/>").addClass("simple-autocomplete-container").append("<div class='simple-autocomplete-bg'></div>"), ul = $("<ul/>");
                this.menuContainer = div;
                this.menuContainer.append(ul);
                this.menuContainer.appendTo(document.body);
                ul.delegate("li", "mouseover", function(){
                    $(this).addClass("simple-autocomplete-select").siblings().removeClass("simple-autocomplete-select");
                    self._mouseInSelect = true;
                }).delegate("li", "mouseout", function(){
                    self._mouseInSelect = false;
                }).delegate("li", "click", function(){
                    self.node.val($(this).data("value"));
                    self._mouseInSelect = false;
                    self.finish();
                })
            }
        },
        renderMenu: function(data, value){
            var self = this, ul = self.menuContainer.find("ul");
            ul.empty();
            $.each(data, function(i, item){
                if (!self.format) {
                    if (item.label) {
                        var li = $("<li/>"), label = item.label.replace(value, "<b class='orange'>" + value + "</b>");
                        li.data("value", item.value), li.html(label);
                    }
                    else {
                        var li = $("<li/>").data("value", item);
                        item = item.replace(value, "<b class='orange'>" + value + "</b>");
                        li.html(item);
                    }
                }
                else {
                    //TODO:需要修正格式化函数以适应不同的数据源
                    var li = self.format(value, item);
                }
                ul.append(li);
            });
            this.menuContainer.show();
        },
        position: function(){
            this.menuContainer.css("position", "absolute");
            var offset = this.node.offset(), height = this.node.outerHeight(), width = this.node.width();
            this.menuContainer.css({
                top: offset.top + height + 2,
                left: offset.left,
                width: width
            });
        },
        //读取缓存
        getCache: function(value){
            return this.cacheData[value];
        },
        setCache: function(value, data){
            if (this.cacheData.length && this.cacheData.length > 10) {
                this.cacheData = {};
                this.cacheData.length = 0;
            }
            this.cacheData[value] = data;
            this.cacheData.length++;
        },
        //移动选中
        focus: function(index){
            var items = $("li", this.menuContainer), self = this, hasSelect = false;
            if (items.length) {
                for (var i = 0; i < items.length; i++) {
                    if (items.eq(i).hasClass("simple-autocomplete-select")) {
                        self.selectItem(i + index);
                        hasSelect = true;
                        return;
                    }
                }
                if (!hasSelect) {
                    this.selectItem(0);
                }
            }
        },
        focusNext: function(){
            this.focus(1);
        },
        focusPrev: function(){
            this.focus(-1);
        },
        selectItem: function(index){
            var items = $("li", this.menuContainer);
            index = index < 0 ? items.length - 1 : index;
            index = index == items.length ? 0 : index;
            items.removeClass("simple-autocomplete-select");
            items.eq(index).addClass("simple-autocomplete-select");
            var val = $('li.simple-autocomplete-select',this.menuContainer).data("value");
            this.node.val(val);
            if (this.lastSelectedValue && !this.lastSelectedValue != val) {
                this.onchange(val);
            }
            this.lastSelectedValue = val;
            //this.onselect(val);
        },
        selectCurrent: function(){
			var val=$('li.simple-autocomplete-select',this.menuContainer).data("value");
            this.node.val(val);
            this.lastSelectValue = val;
			this.onselect(val);
			this.finish();
        }
    });
    
    Simple.bridgeTojQuery("autocomplete", Simple.AutoComplete);
})();
