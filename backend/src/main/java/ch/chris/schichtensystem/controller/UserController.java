package ch.chris.schichtensystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import ch.chris.schichtensystem.model.User;
import ch.chris.schichtensystem.model.UserRepoitory;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/user")
public class UserController {

    @Autowired
    private UserRepoitory userRepoitory;

    @GetMapping("/userdetails")
    public ResponseEntity<List<User>> getAllUserDetails() {
        List<User> userDetails = (List<User>) userRepoitory.findAll();
        
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
    
    
    @PostMapping("register")
    public ResponseEntity<String> createUser(@Valid @RequestBody User user) {
        if (userRepoitory.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }
        userRepoitory.save(user);
        return ResponseEntity.ok("Created user");
    }

    @PostMapping("login")
    public ResponseEntity<String> loginUser(@RequestBody User user) {
        User existingUser = userRepoitory.findByUsername(user.getUsername()).orElse(null);

        // Check if the user exists and if the password matches
        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        
    }
}
