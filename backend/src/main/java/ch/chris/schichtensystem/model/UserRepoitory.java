package ch.chris.schichtensystem.model;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

public interface UserRepoitory extends CrudRepository<User, UUID>{
	public Optional<User> findByUsername(String username);

}
