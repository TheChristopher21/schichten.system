package ch.chris.schichtensystem.model;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BewerbungRepository extends JpaRepository<Bewerbung, Long> {
    // Methoden zur Suche von Bewerbungen, z.B. nach Schicht-ID
}
