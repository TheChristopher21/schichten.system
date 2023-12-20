package ch.chris.schichtensystem.model;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftRepository extends CrudRepository<Shift, Integer> {
    // Hier können zusätzliche Methoden für spezifische Abfragen definiert werden, falls erforderlich
}
