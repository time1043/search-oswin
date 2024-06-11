package com.imooc.web.controller;

import com.imooc.web.utils.EsUtil;
import com.imooc.web.utils.HBaseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.imooc.web.domain.Article;
import com.imooc.web.page.Page;
import com.imooc.web.utils.FreeMarkerUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("article")
public class ArticleController {
    static final Logger logger = LoggerFactory.getLogger(ArticleController.class);
    private static final String ARTICLE_INDEX = "/article/articleList";
    private static final String ARTICLE_DETAIL = "/article/articleDetail";


    @RequestMapping("")
    public String index(ModelMap modelMap) {

        return ARTICLE_INDEX;
    }

    /**
     * 搜索
     *
     * @param modelMap
     * @param skey
     * @param request
     * @param start
     * @param row
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/search", produces = "application/text; charset=utf-8")
    public String searchArticle(
            ModelMap modelMap,
            @RequestParam(value = "skey", required = false) String skey,
            HttpServletRequest request,
            @RequestParam(value = "start", defaultValue = "0") Integer start,
            @RequestParam(value = "row", defaultValue = "10") Integer row
    ) {
        Map<String, Object> map = new HashMap<String, Object>();
        Long count = 0L;
        try {
            map = EsUtil.search(skey, "article", start, row);
            count = (Long) map.get("count");
        } catch (Exception e) {
            logger.error("查询索引错误!{}", e);
            e.printStackTrace();
        }

        List<Map<String, Object>> articleList = (List<Map<String, Object>>) map.get("dataList");
        String nextUrl = request.getContextPath() + "/article" + "/search";
        String pageString = Page.getJsonPage(request, "", start, row, count, nextUrl);
        Map<String, Object> root = new HashMap<String, Object>();
        root.put("pageString", pageString);
        root.put("articleList", articleList);
        root.put("count", count);
        root.put("row", row);
        root.put("contentPath", request.getContextPath());
        String result = FreeMarkerUtil.parseTemplate(
                "article/articlelist.ftl", root);
        modelMap.put("count", count);
        return result;
    }

    /**
     * 查看文章详细信息
     *
     * @return
     */
    @RequestMapping("/detailArticleById/{id}")
    public String detailArticleById(@PathVariable(value = "id") String id, ModelMap modelMap) {
        try {
            Map<String, String> map = HBaseUtil.getFromHBase("article", id);
            Article article = new Article();
            article.setId(id);
            article.setTitle(map.get("title"));
            article.setAuthor(map.get("author"));
            article.setDescribe(map.get("describe"));
            article.setContent(map.get("content"));
            article.setTime(map.get("time"));
            modelMap.put("article", article);
        } catch (Exception e) {
            logger.error("HBase数据查询异常：" + e.getMessage());
        }
        return ARTICLE_DETAIL;
    }


}
