package com.zuul.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;

@Configuration
//@EnableOAuth2Sso
@EnableResourceServer
public class SecurityConfig extends ResourceServerConfigurerAdapter {

    @Autowired
    private JwtAccessTokenConverter jatc;

    /**
     * Configure.
     *
     * @param http the http
     * @throws Exception the exception
     */
//    @Override
//    public void configure(HttpSecurity http) throws Exception {
//        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED).and().authorizeRequests()
//                .antMatchers(
//                        "/web/login",
//                        "/auth/authentication/form",
//                        "/auth/oauth/token",
//                        "/**/*.js",
//                        "/**/*.css",
//                        "/**/*.jpg",
//                        "/**/*.png").permitAll()
//                .antMatchers("/**").authenticated()
//                .and().csrf().disable();
////        http
////                .authorizeRequests()
////                .antMatchers(
////                        "/web/login",
////                        "/auth/authentication/form",
////                        "/auth/oauth/token",
////                        "/**/*.js",
////                        "/**/*.css",
////                        "/**/*.jpg",
////                        "/**/*.png").permitAll()
////                .antMatchers("/**").authenticated()
////                .and().csrf().disable();
//        //http.csrf().disable();
//    }
    @Override
    public void configure(HttpSecurity http) throws Exception {
        /*http.requestMatcher(new OAuthRequestedMatcher()).authorizeRequests().antMatchers(HttpMethod.OPTIONS).permitAll()
                .anyRequest().authenticated();*/

        http.antMatcher("/**")
                .authorizeRequests()
                .antMatchers("/", "/login**", "/index")
                .permitAll()
                .anyRequest()
                .authenticated();
        // @formatter:off
//        http.requestMatcher(new OAuthRequestedMatcher()).authorizeRequests().antMatchers(HttpMethod.OPTIONS).permitAll()
//                .antMatchers(
//                        "/web/login",
//                        "/auth/authentication/form",
//                        "/auth/oauth/token",
//                        "/**/*.js",
//                        "/**/*.css",
//                        "/**/*.jpg",
//                        "/**/*.png").permitAll()
//                .antMatchers("/**").authenticated()
//                .and().csrf().disable();
        // @formatter:on
    }

    private static class OAuthRequestedMatcher implements RequestMatcher {
        public boolean matches(HttpServletRequest request) {
            String auth = request.getHeader("Authorization");
            // Determine if the client request contained an OAuth Authorization
            boolean haveOauth2Token = (auth != null) && auth.startsWith("Bearer");
            String s = request.getParameter("token");
            System.out.println("-------------------->     " + s);
            boolean haveAccessToken = request.getParameter("token") != null;
            System.out.println("-------------------->     " + haveAccessToken);
            return haveAccessToken;
        }
    }


    @Override
    public void configure(ResourceServerSecurityConfigurer config) {
        config.tokenServices(tokenServices());
    }

    @Bean
    public TokenStore tokenStore() {

        DefaultAccessTokenConverter datc  = new DefaultAccessTokenConverter();
        datc.setUserTokenConverter(new JWTUserAuthenticationConverter());
        jatc.setAccessTokenConverter(datc);
        return new JwtTokenStore(jatc);
    }

    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        KeyPairGenerator keyGen = null;
        try {
            keyGen = KeyPairGenerator.getInstance("RSA");
        } catch (NoSuchAlgorithmException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setKeyPair(keyGen.generateKeyPair());
        return converter;
    }

    @Bean
    @Primary
    public DefaultTokenServices tokenServices() {
        final DefaultTokenServices defaultTokenServices = new DefaultTokenServices();
        defaultTokenServices.setTokenStore(tokenStore());
        return defaultTokenServices;
    }

}