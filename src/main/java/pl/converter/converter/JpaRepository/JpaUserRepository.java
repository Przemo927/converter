package pl.converter.converter.JpaRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.converter.converter.model.User;

public interface JpaUserRepository extends JpaRepository<User, Long> {
}
