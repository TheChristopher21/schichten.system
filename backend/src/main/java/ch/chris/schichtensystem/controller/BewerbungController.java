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
            String apiKey = extractApiKey(request);

            if (apiKey == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültiger API-Schlüssel");
            }

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

    // Methode zur Extraktion des API-Schlüssels aus dem Header
    private String extractApiKey(HttpServletRequest request) {
        String apiKeyHeader = request.getHeader("Authorization");
        if (apiKeyHeader != null && apiKeyHeader.startsWith("Bearer ")) {
            return apiKeyHeader.substring(7);
        }
        return null;
    }
}
