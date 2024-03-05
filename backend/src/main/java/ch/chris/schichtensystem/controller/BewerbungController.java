package ch.chris.schichtensystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.chris.schichtensystem.model.Bewerbung;
import ch.chris.schichtensystem.model.BewerbungRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/bewerbungen")
public class BewerbungController {

    @Autowired
    private BewerbungRepository bewerbungRepository;

    @GetMapping
    public ResponseEntity<List<Bewerbung>> getAllBewerbungen() {
        return ResponseEntity.ok(bewerbungRepository.findAll());
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyForShift(@RequestBody Bewerbung bewerbung, HttpServletRequest request) {
        try {
            // Token aus dem Authorization-Header extrahieren
            String authorizationHeader = request.getHeader("Authorization");
            String token = authorizationHeader.substring(7); // Entfernen Sie "Bearer "
            Claims claims = Jwts.parser().setSigningKey("IhrSchlüssel").parseClaimsJws(token).getBody();

            String bewerberName = claims.getSubject(); // oder ein anderes Feld, je nachdem, wie Ihr Token strukturiert ist

            // Setzen Sie den Namen des Bewerbers aus dem Token
            bewerbung.setBewerberName(bewerberName);

            bewerbungRepository.save(bewerbung);
            return ResponseEntity.ok("Bewerbung erfolgreich eingereicht");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Fehler beim Einreichen der Bewerbung: " + e.getMessage());
        }
    }

}