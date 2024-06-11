package com.imooc.web.utils;

import freemarker.cache.StringTemplateLoader;
import freemarker.template.Configuration;
import freemarker.template.Template;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import com.imooc.web.SpringContextHolder;

import java.io.StringWriter;
import java.io.Writer;
import java.util.Map;

public class FreeMarkerUtil {
	
	public static String parseStringTemplate(String sqlTemplate,
			Map<String, String> root) {
		
		Writer out = new StringWriter(2048);
		   try {
			Configuration cfg = new Configuration();
			    StringTemplateLoader stringLoader = new StringTemplateLoader();
			    stringLoader.putTemplate("myTemplate", sqlTemplate);
			    cfg.setTemplateLoader(stringLoader);
			    Template temp = cfg.getTemplate("myTemplate","utf-8");
			    temp.process(root, out);
			    out.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return out.toString();
	}
	
	
	public static String parseTemplate(String templateName,
			Map<?, ?> root) {
		final FreeMarkerConfigurer freeMarkerConfigurer = SpringContextHolder.getBean(FreeMarkerConfigurer.class);
		Writer out = new StringWriter(2048);
		   try {
			   Template temp = freeMarkerConfigurer.getConfiguration().getTemplate(templateName);
			    temp.process(root, out);
			    out.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return out.toString();
	}
}

