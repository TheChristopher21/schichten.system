package ch.chris.schichtensystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "bewerbungen")
public class Bewerbung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long schichtId; // Verweis auf die Schicht
    private String datum;
    private String anmerkung;
    private String bewerberName;
	public Long getSchichtId() {
		return schichtId;
	}
	public void setSchichtId(Long schichtId) {
		this.schichtId = schichtId;
	}
	public String getDatum() {
		return datum;
	}
	public void setDatum(String datum) {
		this.datum = datum;
	}
	public String getAnmerkung() {
		return anmerkung;
	}
	public void setAnmerkung(String anmerkung) {
		this.anmerkung = anmerkung;
	}
	public String getBewerberName() {
		return bewerberName;
	}
	public void setBewerberName(String bewerberName) {
		this.bewerberName = bewerberName;
	}

    // Konstruktoren, Getter und Setter
}
