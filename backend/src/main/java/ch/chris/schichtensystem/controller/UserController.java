package ch.chris.schichtensystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.chris.schichtensystem.model.User;
import ch.chris.schichtensystem.model.UserRepoitory;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "/user")
public class UserController {

    @Autowired
    private UserRepoitory userRepoitory;

    @GetMapping("/userinfo/{username}")
    public ResponseEntity<User> getUserInfo(@PathVariable String username) {
        User userInfo = userRepoitory.findByUsername(username).orElse(null);

        if (userInfo != null) {
            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
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
