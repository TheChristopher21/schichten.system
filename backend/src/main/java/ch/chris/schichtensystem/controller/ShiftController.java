package ch.chris.schichtensystem.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ch.chris.schichtensystem.model.Shift;
import ch.chris.schichtensystem.model.ShiftRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/shift")
public class ShiftController {

    private final ShiftRepository shiftRepository;

    @Autowired
    public ShiftController(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    @GetMapping
    public ResponseEntity<List<Shift>> getAllShifts() {
        List<Shift> shifts = (List<Shift>) shiftRepository.findAll();
        return ResponseEntity.ok(shifts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shift> getShiftById(@PathVariable int id) {
        Optional<Shift> optionalShift = shiftRepository.findById(id);
        return optionalShift.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createShift(@Validated @RequestBody Shift shift) {
        try {
            Shift createdShift = shiftRepository.save(shift);
            return new ResponseEntity<>(createdShift, HttpStatus.CREATED);
        } catch (Exception e) {
            // Return a meaningful error message
            return new ResponseEntity<>("Error creating shift: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shift> updateShift(@PathVariable int id, @Validated @RequestBody Shift updatedShift) {
        Optional<Shift> existingShiftOptional = shiftRepository.findById(id);
        if (existingShiftOptional.isPresent()) {
            Shift existingShift = existingShiftOptional.get();
            existingShift.setShiftid(updatedShift.getShiftid());
            existingShift.setDate(updatedShift.getDate());
            existingShift.setText(updatedShift.getText());
            Shift savedShift = shiftRepository.save(existingShift);
            return ResponseEntity.ok(savedShift);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable int id) {
        Optional<Shift> existingShiftOptional = shiftRepository.findById(id);
        if (existingShiftOptional.isPresent()) {
            shiftRepository.delete(existingShiftOptional.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
