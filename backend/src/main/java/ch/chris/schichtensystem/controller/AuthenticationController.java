package ch.chris.schichtensystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.chris.schichtensystem.model.User;
import ch.chris.schichtensystem.model.UserRepository;
import ch.chris.schichtensystem.util.AuthenticationManager;
import ch.chris.schichtensystem.util.AuthenticationManager.ApiUser;
import jakarta.validation.Valid;

@RestController
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private UserRepository userRepository;

    public String getUsernameFromApiKey(String apiKey) {
        User user = userRepository.findByApiKey(apiKey);
        if (user != null) {
            return user.getUsername();
        }
        return null; // API-Schlüssel ungültig oder Benutzer nicht gefunden
    }
    @PostMapping("/authenticate")	
    public ResponseEntity<String> authenticate(@RequestBody ApiUser user) {
        String apiKey = authManager.authenticate(user);
        return ResponseEntity.ok(apiKey) ;
    }

    @PostMapping("/deauthenticate")
    public ResponseEntity<String> deauthenticate(@RequestParam String apiKey) {
        authManager.deauthenticate(apiKey);
        return ResponseEntity.ok(apiKey) ;
    }
}