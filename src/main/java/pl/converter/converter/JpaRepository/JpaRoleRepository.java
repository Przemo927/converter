package pl.converter.converter.JpaRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.converter.converter.model.Role;

@Repository
public interface JpaRoleRepository extends JpaRepository<Role, Long> {

    @Modifying
    void addUserToRole(@Param("role") String role,@Param("username") String username);
}
