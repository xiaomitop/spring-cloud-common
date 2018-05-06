package com.auth.config;

import com.auth.user.User;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;

import java.util.HashMap;
import java.util.Map;

/**
 * 修改此类，可能测试时发现获得的AccessToken还是老的样子，没有改变。这是因为没改的AccessToken是修改前
 * 生成的，被存在数据库内，还没过期。可以删除oauth_access_token表内数据测试，或者换个新用户。
 *
 */
public class AuthoritiesTokenEnhancer implements TokenEnhancer {
	private static final Log log = LogFactory.getLog(AuthoritiesTokenEnhancer.class);
	
	@Override
	public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
		if(log.isTraceEnabled()){
			log.trace("user in authentication " + authentication.getPrincipal().getClass().getName());
		}
		User user = (User)  authentication.getPrincipal();
        final Map<String, Object> additionalInfo = new HashMap<>();

        additionalInfo.put("userId", user.getId());
        //additionalInfo.put("name", user.getName());
        additionalInfo.put("email", user.getEmail());
        //additionalInfo.put("phone", user.getPhone());
        //additionalInfo.put("headImage", user.getHeadImage());
        additionalInfo.put("authorities", authentication.getAuthorities());

        ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(additionalInfo);

        return accessToken;
	}

}
