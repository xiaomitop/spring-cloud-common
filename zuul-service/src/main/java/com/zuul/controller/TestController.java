package com.zuul.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;

@Controller
public class TestController {

    @RequestMapping("/")
    public String getUser(Principal user) {
        //model.addAttribute("user", user);
        System.out.println("----->  ssssssssssssss   " + user.toString());
        return "/web";
    }

}
