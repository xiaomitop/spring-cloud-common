package com.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created on 2018/1/25 0025.
 *
 * @author zlf
 * @email i@merryyou.cn
 * @since 1.0
 */
@RestController
public class LoginController {
    //@Autowired
    //private RestTemplate template;

    @RequestMapping("/authentication/require")
    public void require(HttpServletResponse response) throws IOException {
        System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        //return template.getForEntity("http://localhost:8081/web/login", ModelAndView.class).getBody();\
        response.sendRedirect("http://localhost:8081/web/login");
        //return "redirect: http://localhost:8081/web/login";
    }
}
