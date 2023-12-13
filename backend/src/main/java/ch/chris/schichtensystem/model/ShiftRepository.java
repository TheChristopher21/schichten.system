package ch.chris.schichtensystem.model;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Integer> {
    // Hier können zusätzliche Methoden für spezifische Abfragen definiert werden, falls erforderlich
}
