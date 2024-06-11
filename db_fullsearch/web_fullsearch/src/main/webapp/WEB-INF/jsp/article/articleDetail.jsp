<%@page import="com.imooc.web.domain.Article"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/tags/article/article_tag_common.tagf"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<title>详情页面</title>
<script type="text/javascript">
</script>
<style type="text/css">
.gridtable {
	font-family: verdana, arial, sans-serif;
	font-size: 11px;
	color: #333333;
	border-width: 1px;
	border-color: #666666;
	border-collapse: collapse;
}

.gridtable th {
	width: 100px;
	border-width: 1px;
	padding: 8px;
	border-style: solid;
	border-color: #666666;
	background-color: #dedede;
}

.gridtable td {
	width: 800px;
	border-width: 1px;
	padding: 8px;
	border-style: solid;
	border-color: #666666;
	background-color: #ffffff;
}
</style>
<body>
	<div align="center">
	<article:article_head/>
	<table class="gridtable" width="998px" border="1px #000 solid"
		cellspacing="1" cellpadding="3">
		<tr>
			<th>标题</th>
			<td><font color="red">${article.title }</font></td>
		</tr>
		<tr>
			<th>作者</th>
			<td>${article.author}</td>
		</tr>
		<tr>
			<th>描述</th>
			<td>${article.describe }</td>
		</tr>
		<tr>
			<th>内容</th>
			<td>${article.content }</td>
		</tr>
	</table>
	<br />
	<br />
	</div>
</body>