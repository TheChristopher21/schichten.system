package ch.chris.schichtensystem.model;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    User findByApiKey(String apiKey); // Neue Methode zur Abfrage eines Benutzers anhand des API-Schlüssels
}
