package ch.chris.schichtensystem.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ch.chris.schichtensystem.model.Shift;
import ch.chris.schichtensystem.model.ShiftRepository;
import ch.chris.schichtensystem.util.AuthenticationManager;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/shift")
public class ShiftController {

    private final ShiftRepository shiftRepository;

    @Autowired
    public ShiftController(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    @GetMapping("/offene")
    public ResponseEntity<List<Shift>> getOffeneSchichten() {
        List<Shift> offeneSchichten = shiftRepository.findByUserIsNull();
        return ResponseEntity.ok(offeneSchichten);
    }

    @GetMapping
    public ResponseEntity<List<Shift>> getAllShifts() {
        List<Shift> shifts = shiftRepository.findAll();
        return ResponseEntity.ok(shifts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shift> getShiftById(@PathVariable Long id) {
        return shiftRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Shift> createShift(@Validated @RequestBody Shift shift) {
        Shift createdShift = shiftRepository.save(shift);
        return new ResponseEntity<>(createdShift, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shift> updateShift(@PathVariable Long id, @Validated @RequestBody Shift updatedShift) {
        return shiftRepository.findById(id).map(existingShift -> {
            existingShift.setShiftid(updatedShift.getShiftid());
            existingShift.setDate(updatedShift.getDate());
            existingShift.setText(updatedShift.getText());
            existingShift.setUser(updatedShift.getUser()); // Aktualisiert für relationales Mapping
            return ResponseEntity.ok(shiftRepository.save(existingShift));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        Optional<Shift> shiftOptional = shiftRepository.findById(id);
        if (shiftOptional.isPresent()) {
            shiftRepository.delete(shiftOptional.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
