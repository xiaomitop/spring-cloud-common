package com.auth;


import com.auth.user.UserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class AuthServerApplication extends WebSecurityConfigurerAdapter {


    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                .formLogin()
                .loginPage("/signin")
                .loginProcessingUrl("/signin/authenticate")
                .failureUrl("/signin?error=bad_credentials")
                .and()
                .logout()
                .logoutUrl("/signout")
                .deleteCookies("JSESSIONID")
                .and()
                .authorizeRequests()
                .antMatchers("/favicon.ico", "/signin", "/signup", "/connect/facebook").permitAll()
                .antMatchers("/**").authenticated()
                .and()
                .rememberMe()
            /*.and()
	            .apply(new SpringSocialConfigurer())*/
                .and()
                .headers()
                .frameOptions().disable(); // ulalala... dangerous
    }


    @Autowired
    private UserDetailService userDetailService;
	
	/*@Override
	public void run(String... args) throws Exception {
		User user = new User();
		user.setUsername("john");
		user.setPassword("{noop}doe");
		user.addAuthority(new SimpleGrantedAuthority("LOCALUSER"));
		userRepository.save(user);
		
	}*/

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(userDetailService);
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        // TODO Auto-generated method stub
        return super.authenticationManagerBean();
    }

    public static void main(String[] args) {
        SpringApplication.run(AuthServerApplication.class, args);
    }


}
