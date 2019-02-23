package pl.converter.converter.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.converter.converter.JpaRepository.JpaRoleRepository;
import pl.converter.converter.JpaRepository.JpaUserRepository;
import pl.converter.converter.model.Role;
import pl.converter.converter.model.User;
import pl.converter.converter.security.PBKDF2Encoder;

import javax.transaction.Transactional;

@Service
public class UserService {

    private JpaUserRepository userRepository;
    private JpaRoleRepository roleRepository;

    @Autowired
    public UserService(JpaUserRepository userRepository,JpaRoleRepository roleRepository){
        this.userRepository=userRepository;
        this.roleRepository=roleRepository;
    }
    public UserService(){}

    @Transactional
    public void registerUser(User user){
        user.setPassword(PBKDF2Encoder.hashPassword(user.getPassword()));
        user.setActive(true);
        userRepository.save(user);
        roleRepository.addUserToRole(null,user.getUsername());
    }
}
