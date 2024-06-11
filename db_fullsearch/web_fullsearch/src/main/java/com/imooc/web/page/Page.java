package com.imooc.web.page;

import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;

public class Page implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = -4027017416763443932L;

    public static String getPage(
            HttpServletRequest request,
            String appendString, long start, long range, long count
    ) {
        String path = request.getRequestURI();

        // 会返回形如course-list这样的字符串
        String requestedResourceName = path
                .substring(path.lastIndexOf("/") + 1);

        // 总页数
        long numPages = count / range + (0 == count % range ? 0 : 1);

        if (numPages <= 1) {
            return "";
        }

        StringBuffer sb = new StringBuffer();

        // 显示上一页
        if (start > 0) {
            sb.append("<a href=\"").append(requestedResourceName).append("?");

            if ("".equals(appendString)) {
                sb.append("start=");
            } else {
                sb.append(appendString);
                sb.append("&start=");
            }

            sb.append(start - range);
            sb.append("&range=");
            sb.append(range);
            sb.append("\">");

            sb.append("上一页");
            sb.append("</a>");
            sb.append("&nbsp;");
        }

        // 当前处于第几页
        long currentPage = start / range + 1;

        long low = currentPage - 5;

        if (low <= 0) {
            low = 1;
        }

        long high = currentPage + 5;

        // 加上...
        if (low > 2) {
            sb.append("<a href=\"").append(requestedResourceName).append("?");

            if ("".equals(appendString)) {
                sb.append("start=0");
            } else {
                sb.append(appendString);
                sb.append("&start=0");
            }

            sb.append("&range=");
            sb.append(range);
            sb.append("\">");
            sb.append("1");
            sb.append("</a>");
            sb.append("...");
        }

        while (low < currentPage) {
            sb.append("<a href=\"").append(requestedResourceName).append("?");

            if ("".equals(appendString)) {
                sb.append("start=");
            } else {
                sb.append(appendString);
                sb.append("&start=");
            }

            sb.append((low - 1) * range);
            sb.append("&range=");
            sb.append(range);
            sb.append("\">");
            sb.append(low);
            sb.append("</a>");
            sb.append("&nbsp;");

            low++;
        }

        // 打印当前页
        sb.append("<b>");
        sb.append(currentPage);
        sb.append("</b>");

        // 打印当前页的后5页

        currentPage++;

        while (currentPage <= high && currentPage <= numPages) {
            sb.append("&nbsp;<a href=\"").append(requestedResourceName)
                    .append("?");

            if ("".equals(appendString)) {
                sb.append("start=");
            } else {
                sb.append(appendString);
                sb.append("&start=");
            }

            sb.append((currentPage - 1) * range);
            sb.append("&range=");
            sb.append(range);
            sb.append("\">");
            sb.append(currentPage);
            sb.append("</a>");

            currentPage++;
        }

        if (high + 1 < numPages) {
            sb.append("...");
        }

        if (high + 1 <= numPages) {
            sb.append("<a href=\"").append(requestedResourceName).append("?");

            if ("".equals(appendString)) {
                sb.append("start=");
            } else {
                sb.append(appendString);
                sb.append("&start=");
            }

            sb.append((numPages - 1) * range);
            sb.append("&range=");
            sb.append(range);
            sb.append("\">");
            sb.append(numPages);
            sb.append("</a>");
        }

        // 如果不在最后一页，则显示下一页
        if (count > (start + range)) {
            sb.append("&nbsp;<a href=\"").append(requestedResourceName)
                    .append("?");

            if ("".equals(appendString)) {
                sb.append("start=");
            } else {
                sb.append(appendString);
                sb.append("&start=");
            }

            sb.append(start + range);
            sb.append("&range=");
            sb.append(range);
            sb.append("\">");
            sb.append("下一页");
            sb.append("</a>");
        }

        return sb.toString();
    }

    public static String getJsonPage(
            HttpServletRequest request,
            String appendString, long start, long range, long count, String nextUrl
    ) {
        String path = request.getRequestURI();

        // 总页数
        long numPages = count / range + (0 == count % range ? 0 : 1);

        if (numPages <= 1) {
            return "";
        }

        StringBuffer sb = new StringBuffer();
        // 显示上一页
        if (start > 0) {
            sb.append("<a href=\"#\" onclick=\"nextPage('" + nextUrl + "','");

            if ("".equals(appendString)) {
                sb.append("start=");
            } else {
                sb.append(appendString);
                sb.append("&start=");
            }

            sb.append(start - range);
            sb.append("&range=");
            sb.append(range);
            sb.append("');\" style=\"cursor:pointer\">");

            sb.append("上一页");
            sb.append("</a>");
            sb.append("&nbsp;");
        }

        // 当前处于第几页
        long currentPage = start / range + 1;

        long low = currentPage - 5;

        if (low <= 0) {
            low = 1;
        }

        long high = currentPage + 5;

        // 加上...
        if (low > 2) {
            sb.append("<a href=\"#\" onclick=\"nextPage('" + nextUrl + "','");

            if ("".equals(appendString)) {
                sb.append("start=0");
            } else {
                sb.append(appendString);
                sb.append("&start=0");
            }

            sb.append("&range=");
            sb.append(range);
            sb.append("');\" style=\"cursor:pointer\">");
            sb.append("1");
            sb.append("</a>");
            sb.append("...");
        }

        while (low < currentPage) {
            sb.append("<a href=\"#\" onclick=\"nextPage('" + nextUrl + "','");

            if ("".equals(appendString)) {
                sb.append("start=");
            } else {
                sb.append(appendString);
                sb.append("&start=");
            }

            sb.append((low - 1) * range);
            sb.append("&range=");
            sb.append(range);
            sb.append("');\" style=\"cursor:pointer\">");
            sb.append(low);
            sb.append("</a>");
            sb.append("&nbsp;");

            low++;
        }

        // 打印当前页
        sb.append("<b>");
        sb.append(currentPage);
        sb.append("</b>");

        // 打印当前页的后5页

        currentPage++;

        while (currentPage <= high && currentPage <= numPages) {
            sb.append("&nbsp;<a href=\"#\" onclick=\"nextPage('" + nextUrl + "','");

            if ("".equals(appendString)) {
                sb.append("start=");
            } else {
                sb.append(appendString);
                sb.append("&start=");
            }

            sb.append((currentPage - 1) * range);
            sb.append("&range=");
            sb.append(range);
            sb.append("');\" style=\"cursor:pointer\">");
            sb.append(currentPage);
            sb.append("</a>");

            currentPage++;
        }

        if (high + 1 < numPages) {
            sb.append("...");
        }

        if (high + 1 <= numPages) {
            sb.append("<a href=\"#\" onclick=\"nextPage('" + nextUrl + "','");

            if ("".equals(appendString)) {
                sb.append("start=");
            } else {
                sb.append(appendString);
                sb.append("&start=");
            }

            sb.append((numPages - 1) * range);
            sb.append("&range=");
            sb.append(range);
            sb.append("');\" style=\"cursor:pointer\">");
            sb.append(numPages);
            sb.append("</a>");
        }

        // 如果不在最后一页，则显示下一页
        if (count > (start + range)) {
            sb.append("&nbsp;<a href=\"#\" onclick=\"nextPage('" + nextUrl + "','");


            if ("".equals(appendString)) {
                sb.append("start=");
            } else {
                sb.append(appendString);
                sb.append("&start=");
            }

            sb.append(start + range);
            sb.append("&range=");
            sb.append(range);
            sb.append("');\" style=\"cursor:pointer\">");
            sb.append("下一页");
            sb.append("</a>");
        }

        return sb.toString();
    }
}
