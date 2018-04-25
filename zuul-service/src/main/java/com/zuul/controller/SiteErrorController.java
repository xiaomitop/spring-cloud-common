package com.zuul.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class SiteErrorController implements ErrorController {

	
	private static final Logger log = LoggerFactory.getLogger(SiteErrorController.class);

    @RequestMapping(value="/403")
    @ResponseBody
    public String test(){
        return "403";
    }
	
	@RequestMapping(value="/error")
    public String handleError(){
        return "403";
    }
	
	@Override
	public String getErrorPath() {
		return "/error";
	}

	@RequestMapping(value="/deny")
    public String deny(){
        return "deny";
    }
	
	@RequestMapping("/tosignout")
    public String tosso() {
        return "tosignout";
    }

    @RequestMapping("/login")
    public String login() {
    	log.info("come here!");
        return "redirect:/#/";
    }
}
