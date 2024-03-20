package ch.chris.schichtensystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.chris.schichtensystem.model.Bewerbung;
import ch.chris.schichtensystem.model.BewerbungRepository;
import ch.chris.schichtensystem.util.AuthenticationManager;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/bewerbungen")
public class BewerbungController {

    @Autowired
    private BewerbungRepository bewerbungRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/apply")
    public ResponseEntity<String> applyForShift(@RequestBody Bewerbung bewerbung, HttpServletRequest request) {
        try {
            String apiKey = request.getHeader("Authorization").substring(7);

            String bewerberName = authenticationManager.getUsernameFromApiKey(apiKey);

            if (bewerberName == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültiger API-Schlüssel");
            }

            bewerbung.setBewerberName(bewerberName);

            bewerbungRepository.save(bewerbung);
            return ResponseEntity.ok("Bewerbung erfolgreich eingereicht");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Fehler beim Einreichen der Bewerbung: " + e.getMessage());
        }
    }
}
