// JavaScript Document
var islogin = 0;
function isloginf() {
    $("#logindiv").html("读取登陆状态..");
    //$.get("/kong.aspx");
    $.ajax({
    type: "get", //使用get方法访问后台
        cache: false, //不缓存
        dataType: "text", //返回text格式的数据
        url: "/userControl/ajaxUserLogin.aspx", //要访问的后台地址
        data: "ack=islogin", //要发送的数据
        error: function() {
            $("#logindiv").html("读取错误");
        },
        success: function(msg) {//xml文档为返回的数据，在这里做数据绑定

            if (msg != "false") {
                islogin = 1;
                var suser=msg.split('|')[0];
var suid=msg.split('|')[1];
$("#logindiv").html("欢迎， <a href=\"http://home.manmanbuy.com/userCenter.aspx\" class=\"bbsuser\">" + suser + "</a>  &nbsp;   <a href=\"http://home.manmanbuy.com/userCenter.aspx\"  class=\"pt\">我的帐户</a> &nbsp;  <a href=\"/logout.aspx\">退出</a>");
            }
            else {
                $("#logindiv").html("欢迎来到慢慢买！<a href=\"http://home.manmanbuy.com/login.aspx?tourl=" + document.location.href + "\"  class=\"pt\">请登录</a> &nbsp;   <a href=\"http://home.manmanbuy.com/reg.aspx\" class=\"pt\">免费注册</a>");
            }
        }
    });
}