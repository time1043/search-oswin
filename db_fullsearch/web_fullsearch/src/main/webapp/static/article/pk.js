//删除COOKIE
function delCookie(id) {
    var cooks = $.cookie("listhc").split("//"), dstr = "";

        for (var i = 1; i < cooks.length; i++) { if (cooks[i].split("__")[0] != id) { dstr += "//" + cooks[i]; } }
        $.cookie("listhc", dstr);
    newpos();
    $("#" + id).attr("checked", false);
    //$("#tishi").attr("checked", false);

}

//初始化页面中的选项
function renew() {
    $("input[name='chkdb']").each(function() {
        if ($.cookie("listhc").indexOf("//" + $(this).attr("id")) > -1) $(this).attr("checked", true);
    });
}

//初始化漂浮层
function newpos() {
    var ouli = "", alls = 0;
    if ($.cookie("listhc") == null || $.cookie("listhc") == undefined || $.cookie("listhc") == "" || $.cookie("listhc") == NaN) {
        $("#dbnr2").children("ul").html("");
        $("#tishi").show();
        $("#dbimg").html("(0)");
    }
    else {
        $("#dbimg").show();
        var cooks = $.cookie("listhc").split("//");
        for (var i = 1; i < cooks.length; i++) {
            alls++; var wf = cooks[i].split("__");
            ouli += "<li><img src='http://misc.manmanbuy.com/images/tv/closex.gif' align='absmiddle' onclick=\"delCookie('" + wf[0] + "')\" /> <a href='http://www.manmanbuy.com/p_" + wf[0].replace("a", "") + ".aspx' target='_blank'>" + wf[1] + "</a></li>";
        }
        $("#dbnr2").children("ul").html(ouli);
        $("#dbimg").html("(" + (cooks.length-1) + ")");
        $("#tishi").hide();
    }

}

function setdivhide() {
    $("#dbnr2").hide();
}
function setdivshow() {
    $("#dbnr2").show();
}

//删除COOKIE
function clears() {
    $.cookie("listhc", null);
    $("input[name='chkdb']").removeAttr("checked");
    $("#dbimg").html("(0)");
    $("#dbnr2").children("ul").html("");
}

//增加点击开始对比的处理--liuliqiang
function comparepro() {
    var cook = $.cookie("listhc");
    var cooks = cook.split("//");
    var url = "compare";
    var cs = "";
    for (var i = 0; i < cooks.length; i++) {
        var proid = cooks[i].substr(0, cooks[i].indexOf("__"));
        if (proid.length > 0)
            cs += "|" + proid.replace("a", "");
    }
    if (cs.length > 1) {
        window.open(url + ".aspx?p="+cs);
    }
    else {
        alert("请先选择要对比的产品");
    }
    return false;
}