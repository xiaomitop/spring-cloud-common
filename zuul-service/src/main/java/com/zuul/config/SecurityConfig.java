package com.zuul.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationProcessingFilter;
import org.springframework.security.oauth2.provider.error.DefaultWebResponseExceptionTranslator;
import org.springframework.security.oauth2.provider.error.OAuth2AuthenticationEntryPoint;
import org.springframework.security.oauth2.provider.error.OAuth2ExceptionRenderer;
import org.springframework.security.oauth2.provider.error.WebResponseExceptionTranslator;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.context.request.ServletWebRequest;

import javax.servlet.http.HttpServletRequest;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;

@Configuration
//@EnableOAuth2Sso
@EnableResourceServer
public class SecurityConfig extends ResourceServerConfigurerAdapter {

    @Autowired
    private JwtAccessTokenConverter jatc;

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers(
                        "/web/login",
                        "/auth/authentication/form",
                        "/auth/oauth/token",
                        "/**/*.js",
                        "/**/*.css",
                        "/**/*.jpg",
                        "/**/*.png").permitAll()
                .antMatchers("/**").authenticated().and()
                .csrf().disable();
    }

    @Bean
    public WebResponseExceptionTranslator webResponseExceptionTranslator() {
        return new DefaultWebResponseExceptionTranslator() {
            @SuppressWarnings("unchecked")
            @Override
            public ResponseEntity<OAuth2Exception> translate(Exception e) throws Exception {
                ResponseEntity responseEntity = super.translate(e);
                OAuth2Exception body = (OAuth2Exception) responseEntity.getBody();
                HttpHeaders headers = new HttpHeaders();
                headers.setAll(responseEntity.getHeaders().toSingleValueMap());
                // do something with header or response
                if (401 == responseEntity.getStatusCode().value()) {
                    //Response r = new Response();
                    //r.setCodeAndMsg(401, "Invalid access token");
                    return new ResponseEntity("aaaaaaaaaaaaaa", headers, responseEntity.getStatusCode());
                } else {
                    return new ResponseEntity(body, headers, responseEntity.getStatusCode());
                }

            }
        };
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
        OAuth2AuthenticationEntryPoint oAuth2AuthenticationEntryPoint = new OAuth2AuthenticationEntryPoint();
        oAuth2AuthenticationEntryPoint.setExceptionTranslator(webResponseExceptionTranslator());
        config.authenticationEntryPoint(oAuth2AuthenticationEntryPoint);
    }

    @Bean
    public TokenStore tokenStore() {

        DefaultAccessTokenConverter datc = new DefaultAccessTokenConverter();
        datc.setUserTokenConverter(new JWTUserAuthenticationConverter());
        jatc.setAccessTokenConverter(datc);
        return new JwtTokenStore(jatc);
    }

   /* @Bean
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
    }*/

    @Bean
    @Primary
    public DefaultTokenServices tokenServices() {
        final DefaultTokenServices defaultTokenServices = new DefaultTokenServices();
        defaultTokenServices.setTokenStore(tokenStore());
        return defaultTokenServices;
    }

}