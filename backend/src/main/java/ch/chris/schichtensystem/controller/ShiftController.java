	package ch.chris.schichtensystem.controller;
	
	
	import java.util.List;
	
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.http.HttpStatus;
	import org.springframework.http.ResponseEntity;
	import org.springframework.validation.annotation.Validated;
	import org.springframework.web.bind.annotation.DeleteMapping;
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.PathVariable;
	import org.springframework.web.bind.annotation.PostMapping;
	import org.springframework.web.bind.annotation.PutMapping;
	import org.springframework.web.bind.annotation.RequestBody;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RestController;
	
	import ch.chris.schichtensystem.model.Shift;
	import ch.chris.schichtensystem.model.ShiftRepository;
	
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
	        List<Shift> shifts = shiftRepository.findAll();
	        return new ResponseEntity<>(shifts, HttpStatus.OK);
	    }
	
	    @GetMapping("/{id}")
	    public ResponseEntity<Shift> getShiftById(@PathVariable int id) {
	        java.util.Optional<Shift> optionalShift = shiftRepository.findById(id);
	        if (optionalShift.isPresent()) {
	            return ResponseEntity.ok(optionalShift.get());
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	
	    @PostMapping
	    public ResponseEntity<Shift> createShift(@Validated @RequestBody Shift shift) {
	        Shift createdShift = shiftRepository.save(shift);
	        return new ResponseEntity<>(createdShift, HttpStatus.CREATED);
	    }
	
	    @PutMapping("/{id}")
	    public ResponseEntity<Shift> updateShift(@PathVariable int id, @Validated @RequestBody Shift updatedShift) {
	        java.util.Optional<Shift> existingShiftOptional = shiftRepository.findById(id);
	        if (existingShiftOptional.isPresent()) {
	            Shift existingShift = existingShiftOptional.get();
	            updatedShift.setId(existingShift.getId());
	            Shift savedShift = shiftRepository.save(updatedShift);
	            return ResponseEntity.ok(savedShift);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	
	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteShift(@PathVariable int id) {
	        java.util.Optional<Shift> existingShiftOptional = shiftRepository.findById(id);
	        if (existingShiftOptional.isPresent()) {
	            shiftRepository.delete(existingShiftOptional.get());
	            return ResponseEntity.noContent().build();
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	}
	
