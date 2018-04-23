package com.auth.user;

import java.util.Optional;

public interface UserRepository {

	public Optional<User> findByFacebookId(String id);
	public Optional<User> findByUsername(String userName);
	
}
