function addFav(aid) {
    if (islogin == 0) {
        $("#disFaverror").html("正在登陆...");
        $.ajax({
            type: "get", //使用get方法访问后台
            dataType: "text", //返回text格式的数据
            url: "/userControl/ajaxUserLogin.aspx", //要访问的后台地址
            data: "ack=ajaxlogin&username=" + $("#txtuser222").val() + "&password=" + $("#txtpass222").val(), //要发送的数据
            error: function() {
                $("#disFaverror").html("用户名或密码错误!");
            },
            success: function(msg) {//xml文档为返回的数据，在这里做数据绑定
                if (msg == "true") {
                    islogin = 1;
                    $("#disFaverror").html("登陆成功，正在跳转...");
                    isloginf();
                    toaddfav($("#txtspid").val());

                }
                else {
                    $("#disFaverror").html("用户名或密码错误!");
                }
            }
        });
    }
    else {
        toaddfav($("#txtspid").val());
    }
}
function toaddfav(spid) {
    $("#disFaverror").html("开始处理收藏...");
    var type_value = $("input[@type=radio][name=rbtype][checked]").val();
    var datas = "ack=ajaxAddFac&spid=" + spid + "&itype=" + type_value + "&bz=" + $("#txtbz").val();
    //$("#disFaverror").html(datas); //ack=ajaxAddFac&spid=12024&itype=2&bz=
    $.ajax({
        type: "get", //使用get方法访问后台
        dataType: "text", //返回text格式的数据
        url: "/userControl/ajaxUserLogin.aspx", //要访问的后台地址
        data: datas, //要发送的数据
        error: function() {
            $("#disFaverror").html("收藏失败,读取错误！");
        },
        success: function(msg) {
            if (msg == "True") {
                $("#ajaxContent22").html("<br /><font style='font-size:20px;color:#fc0000;'>收藏成功！</font><br /><br />可进入“我的帐户 -> <a href='http://home.manmanbuy.com/fac.aspx' target='_blank' class='f12sc'>我的收藏</a>”查看已收藏的商品<br /><br />");
            }
            else {
                $("#disFaverror").html("收藏失败...");
            }

        }
    });
}

function setfav(spid,itype) {
    $("#txtspid").val(spid);
    $("#rbtype" + itype).attr("checked", true);
    easyDialog.open({
        container: 'divfav'
    });
}