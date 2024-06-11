 <div  style="height: 32px; padding-left: 10px; background-color:#f7f7f7;  text-align: left; padding-top: 6px;">
                    <div  style="float: right; width: 200px; text-align: right; padding-top: 5px; margin-right: 10px;">
                       共找到 <font  style="color: #DF4100;">
                            ${count }</font> 条数据</div>
                    <div  style="float: left; width: 340px;">
                        <table  cellpadding="0"  cellspacing="0"><tbody><tr><td><div  class="sortDesced"><a  href="#"  style="font-size: 12px; color:#E85708" onclick="sortdata('');" title="按默认排序（匹配度）">默认</a></div></td></tr></tbody></table>
                    </div>
                </div>
                <div  class="clear">
                </div>
 <div  id="ctl00_ContentPlaceHolder1_DivListpro"  style="text-align: left; margin-top: 10px; padding-left: 12px;"  class="team_main_side">
 <#list articleList as article>
 <div  >
	<a href="${contentPath}/article/detailArticleById/${article["id"]}">${article["title"]}</a><p/>
	作者：${article["author"]},时间：${article["time"]}<p/>
	${article["describe"]}<p/>
	<p>----------------------------------------------------------<p/>
</div>
</#list>
	<div  class="clear">
	</div>
</div>
<div  id="ctl00_ContentPlaceHolder1_dispage"  style="margin: 10px 8px; padding: 3px;">共有${count}条记录  ，每页${row}条记录 &nbsp; ${pageString}</div>
