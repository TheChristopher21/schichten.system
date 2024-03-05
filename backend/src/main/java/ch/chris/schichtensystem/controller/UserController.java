package ch.chris.schichtensystem.controller;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import ch.chris.schichtensystem.model.User;
import ch.chris.schichtensystem.model.UserRepository;
import ch.chris.schichtensystem.util.AuthenticationManager;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import jakarta.validation.Valid;



@RestController
@RequestMapping(path = "/user")
public class UserController {

	  @Autowired
	    private UserRepository userRepository; // Korrekter Name
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/userdetails")
    public ResponseEntity<List<User>> getAllUserDetails() {
        List<User> userDetails = (List<User>) userRepository.findAll();
        
        if (!userDetails.isEmpty()) {
            return ResponseEntity.ok(userDetails);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(Exception.class)
        public ResponseEntity<String> handleException(Exception ex) {
            // Hier kannst du den Fehler erfassen und eine detaillierte Fehlermeldung zurückgeben
            String errorMessage = "Ein Fehler ist aufgetreten: " + ex.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }
    
    
    @PostMapping("/register")
    public ResponseEntity<String> createUser(@Valid @RequestBody User user) {
    if (userRepository.findByUsername(user.getUsername()).isPresent()) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
    }

 
    Argon2 argon2 = Argon2Factory.create();
    try {
        // Hashing des Passworts
        String hash = argon2.hash(10, 65536, 1, user.getPassword().toCharArray());
        user.setPassword(hash);

        // Speichern des Benutzers mit gehashtem Passwort
        userRepository.save(user);
        return ResponseEntity.ok("User created");
    } finally {
        // Löschen des Passworts aus dem Speicher
        argon2.wipeArray(user.getPassword().toCharArray());
    }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        User existingUser = userRepository.findByUsername(user.getUsername()).orElse(null);
        
        if (existingUser != null) {
            Argon2 argon2 = Argon2Factory.create();
            if (argon2.verify(existingUser.getPassword(), user.getPassword().toCharArray())) {
                String apiKey = UUID.randomUUID().toString();
                existingUser.setApiKey(apiKey);
                userRepository.save(existingUser);
                
                HashMap<String, String> responseBody = new HashMap<>();
                responseBody.put("token", apiKey);
                return ResponseEntity.ok(responseBody);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @GetMapping("/getUsername")
    public ResponseEntity<String> getUsername(@RequestHeader("Authorization") String authHeader) {
        try {
            String apiKey = authHeader.substring(7);
            String username = authenticationManager.getUsernameFromApiKey(apiKey);
            return ResponseEntity.ok(username);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ein Fehler ist aufgetreten: " + e.getMessage());
        }
    }
}

