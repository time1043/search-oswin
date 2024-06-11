var sPingj = "";
var sId = "";
function pingJia(id, pingj) {
    sPingj = pingj;
    sId = id;
    $.ajax({
        url: "chart.aspx?DA=" + new Date(),
        type: 'post', //数据发送方式 
        dataType: 'html', //接受数据格式 
        data:
                                {
                                    action: 'pj',
                                    id: id,
                                    p: pingj
                                },
        success: _refresh //回传函数(这里是函数名)   error转向错误页面
    });
    return true;
}
function _refresh(obj) { //ajax提交后返回
    if (obj == "1") {
        alert('您已经成功评价！');
        if (sPingj == "zhi") {
            $('#span_pj_' + sId + '_zhi').html(parseInt($('#span_pj_' + sId + '_zhi').html()) + 1);
        } else if (sPingj == "buzhi") {
            $('#span_pj_' + sId + '_buzhi').html(parseInt($('#span_pj_' + sId + '_buzhi').html()) + 1);
        }
        else { }

    }
    else if (obj == "0") {
        alert('您已经评价，请不要重复评价');
    }
    else if (obj == "-1") {
        alert('发表评价失败，请稍后再试！');
    }
    else {
    }
}

var commentid_ = 0;
function commentyy(commentid) {
    commentid_ = commentid;
    $.ajax({
        url: "chart.aspx?DA=" + new Date(),
        type: 'post', //数据发送方式 
        dataType: 'html', //接受数据格式 
        data:
                                {
                                    type: 'commentyy',
                                    commentid: commentid
                                },
        success: commentyy_refresh //回传函数(这里是函数名)   error转向错误页面
    });
}
function commentyy_refresh(obj) { //ajax提交后返回
    if (obj == "true") {
        $('#yycount_' + commentid_).text(parseInt($('#yycount_' + commentid_).text()) + 1);
    }
    else {
        alert('操作失败，请稍后再试！');
    }
}