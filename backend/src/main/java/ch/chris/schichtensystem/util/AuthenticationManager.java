package ch.chris.schichtensystem.util;


import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Component;


import ch.chris.schichtensystem.model.User;
import ch.chris.schichtensystem.model.UserRepository;


@Component
public class AuthenticationManager {
	
	private final String INVALID_CREDENTIALS = "invalid credentials";
	private final int API_KEY_LENGTH = 32;
	
	@Autowired
	private UserRepository userRepository;
	
	private HashMap<String, User> apiKeys;
	private Argon2PasswordEncoder argon2;
	
	private AuthenticationManager() {
		apiKeys = new HashMap<>();
		argon2 = new Argon2PasswordEncoder(16, 32, 1, 60000, 5);
	}
	
	public User validateApiKey(String apiKey) {
		if(apiKey.length() != API_KEY_LENGTH) throw new RuntimeException("invalid apikey");
		
		User user = apiKeys.get(apiKey);
		if(user == null) throw new RuntimeException();
		
		return user;
	}
	
	public String authenticate(ApiUser userData) {
		Optional<User> user = userRepository.findByUsername(userData.username);
		if(user.isEmpty()) throw new RuntimeException(INVALID_CREDENTIALS);
		if(!argon2.matches(userData.password, user.get().getPassword())) throw new RuntimeException(INVALID_CREDENTIALS);
		
		String apiKey = UUID.randomUUID().toString().replace("-", "");
		apiKeys.put(apiKey, user.get());
		
		return apiKey;
	}
	
	public void deauthenticate(String apiKey) {
		validateApiKey(apiKey);
		apiKeys.remove(apiKey);
	}
	
	public record ApiUser(String username, String password) {};

public String getUsernameFromApiKey(String apiKey) {
    User user = validateApiKey(apiKey);	
    if(user != null) {
        return user.getUsername(); // oder eine andere Methode, um den Benutzernamen zu erhalten
    }
    throw new RuntimeException("User not found for the given API key");
}

}