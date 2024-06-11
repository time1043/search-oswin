<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/tags/article/article_tag_common.tagf"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<title>搜索页面</title>


<script language="javascript" type="text/javascript">
	var root = '<%=request.getContextPath()%>'
	$(document).ready(function() {
		//加载数据
		$.ajax({
			url : "${article_path}/article/search",
			dataType : 'text',
			success : function(data) {
				$("#dataList").empty().append(data);
			},
			error : function(data) {
				alert("数据加载失败!");
			}

		});

		jQuery.focusblur = function(focusid) {
			var focusblurid = $(focusid);
			var defval = focusblurid.val();
			focusblurid.focus(function() {
				var thisval = $(this).val();
				if (thisval == defval) {
					$(this).val("");
				}
			});
			focusblurid.blur(function() {
				var thisval = $(this).val();
				if (thisval == "") {
					$(this).val(defval);
				}
			});

		};
		/*下面是调用方法*/
		$.focusblur("#skey");
	});
	
	//下一页    	
	function nextPage(url, param) {
		var params = param.split("&");
		var start = params[0].split("=")[1];
		var row = params[1].split("=")[1];
		var key = $("#skey").val();
		$.ajax({
			url : url,
			type : "get",
			data : {
				start : start,
				row : row,
				skey:key
			},
			dataType : 'text',
			error : function(msg) {
				$.messager.alert("操作提示", "加载数据出错！");
			},
			success : function(text) {
				$("#dataList").empty().append(text);
			}
		});
	}
	//查询
	function searchdata() {
		var key = $("#skey").val();
		if(key==''){
			alert('查询内容不能为空!');
			return;
		}
		$.ajax({
			url : "${article_path}/article/search",
			data : {
				skey : key
			},
			dataType : 'text',
			contentType: "application/x-www-form-urlencoded; charset=utf-8", 
			success : function(data) {
				$("#dataList").empty().append(data);
			},
			error : function(data) {
				alert("数据加载失败!");
			}
		});
	}
	
</script>
<style type="text/css">
A.f12hot:link, A.f12hot:active, A.f12hot:visited {
	text-decoration: none;
	color: #999;
}

A.f12hot:hover {
	text-decoration: none;
	color: #F16320;
}

A.f12sc:link, A.f12sc:active {
	font-size: 12px;
	text-decoration: none;
	color: #005AA0;
}

A.f12sc:visited {
	font-size: 12px;
	text-decoration: none;
	color: #005AA0;
}

A.f12sc:hover {
	font-size: 12px;
	text-decoration: underline;
	color: #ED0000;
}
#fk{
	background-position:0 0px;
	width:51px;
	height:51px;
	overflow:hidden;
	text-indent:-2000em;
	position:fixed;
	_position:absolute;
	right:10px;
	bottom:133px;
	display:none;
}
#fk:hover{
	background-position:0 -1px;
}
</style>
<body>
	<div align="center">
		<article:article_head/>
		<div style="width: 998px; text-align: center; margin-top: 3px;">
			<!-- 商品数据 -->
			<div style="">
				<div class="divRightMoldKuang">
					<div id="dataList"></div>
				</div>
			</div>
		</div>
	</div>
</body>