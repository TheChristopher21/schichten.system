package ch.chris.schichtensystem.model;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BewerbungRepository extends JpaRepository<Bewerbung, Long> {
	List<Bewerbung> findByBewerberName(String bewerberName);

	Optional<Bewerbung> findBySchichtIdAndBewerberName(Long schichtId, String bewerberName);
}