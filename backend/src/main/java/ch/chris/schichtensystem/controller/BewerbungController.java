package ch.chris.schichtensystem.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.chris.schichtensystem.model.Bewerbung;
import ch.chris.schichtensystem.model.BewerbungRepository;
import ch.chris.schichtensystem.util.AuthenticationManager;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/bewerbungen") // Basieroute für alle Bewerbungs-Endpoints
public class BewerbungController {

    private static final Logger logger = LoggerFactory.getLogger(BewerbungController.class);

    @Autowired
    private BewerbungRepository bewerbungRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/apply")
    public ResponseEntity<String> applyForShift(@RequestBody Bewerbung bewerbung, HttpServletRequest request) {
        try {
            String apiKey = extractApiKey(request);
            if (apiKey == null) {
                logger.warn("Ungültiger API-Schlüssel");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültiger API-Schlüssel");
            }

            String bewerberName = authenticationManager.getUsernameFromApiKey(apiKey);
            if (bewerberName == null) {
                logger.warn("Benutzername nicht gefunden");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültiger API-Schlüssel");
            }

            bewerbung.setBewerberName(bewerberName);
            bewerbungRepository.save(bewerbung);
            logger.info("Bewerbung erfolgreich eingereicht");
            return ResponseEntity.ok("Bewerbung erfolgreich eingereicht");
        } catch (Exception e) {
            logger.error("Fehler beim Einreichen der Bewerbung", e);
            return ResponseEntity.internalServerError().body("Fehler beim Einreichen der Bewerbung: " + e.getMessage());
        }
    }

    @GetMapping("/sent")
    public ResponseEntity<List<Bewerbung>> getSentApplications(HttpServletRequest request) {
        try {
            String apiKey = extractApiKey(request);
            if (apiKey == null) {
                logger.warn("Ungültiger API-Schlüssel");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String bewerberName = authenticationManager.getUsernameFromApiKey(apiKey);
            if (bewerberName == null) {
                logger.warn("Benutzername nicht gefunden");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            List<Bewerbung> bewerbungen = bewerbungRepository.findByBewerberName(bewerberName);
            return ResponseEntity.ok(bewerbungen);
        } catch (Exception e) {
            logger.error("Fehler beim Abrufen der gesendeten Bewerbungen", e);
            return ResponseEntity.internalServerError().body(null);
        }
    }
    
    @DeleteMapping("/bySchicht/{schichtId}")
    public ResponseEntity<?> deleteApplicationBySchichtId(@PathVariable Long schichtId, HttpServletRequest request) {
        String apiKey = extractApiKey(request);
        if (apiKey == null || schichtId == null) {
            logger.warn("Ungültiger API-Schlüssel oder schichtId");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String bewerberName = authenticationManager.getUsernameFromApiKey(apiKey);
        Optional<Bewerbung> bewerbungOptional = bewerbungRepository.findBySchichtIdAndBewerberName(schichtId, bewerberName);

        if (bewerbungOptional.isEmpty()) {
            logger.error("Bewerbung mit Schicht ID {} nicht gefunden oder Berechtigung fehlt", schichtId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        bewerbungRepository.deleteById(bewerbungOptional.get().getId());
        logger.info("Bewerbung mit Schicht ID {} erfolgreich gelöscht", schichtId);
        return ResponseEntity.ok().build();
    }

    private String extractApiKey(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader("Authorization"))
                .filter(authHeader -> authHeader.startsWith("Bearer "))
                .map(authHeader -> authHeader.substring(7))
                .orElse(null);
    }
    
}
