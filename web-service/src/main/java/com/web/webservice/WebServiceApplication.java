package com.web.webservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;

@EnableOAuth2Sso
@SpringBootApplication
public class WebServiceApplication {

    @GetMapping("/user")
    public Authentication user(Authentication user) {
        System.out.println("aaaa--->    " + user.toString());
        return user;
    }

    public static void main(String[] args) {
        SpringApplication.run(WebServiceApplication.class, args);
    }
}
