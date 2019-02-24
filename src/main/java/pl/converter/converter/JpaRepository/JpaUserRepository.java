package pl.converter.converter.JpaRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import pl.converter.converter.model.User;

public interface JpaUserRepository extends JpaRepository<User, Long> {

    int checkPresenceOfUsername(@Param("username") String username);
    int checkPresenceOfEmail(@Param("email") String email);
}
