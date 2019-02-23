package pl.converter.converter.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.converter.converter.JpaRepository.JpaRoleRepository;
import pl.converter.converter.JpaRepository.JpaUserRepository;
import pl.converter.converter.model.User;
import pl.converter.converter.security.PBKDF2Encoder;

import javax.transaction.Transactional;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class UserService {

    private JpaUserRepository userRepository;
    private JpaRoleRepository roleRepository;
    private Logger logger;

    @Autowired
    public UserService(JpaUserRepository userRepository,JpaRoleRepository roleRepository,Logger logger){
        this.userRepository=userRepository;
        this.roleRepository=roleRepository;
        this.logger=logger;
    }
    public UserService(){}

    @Transactional
    public void registerUser(User user){
        if(user!=null) {
            user.setPassword(PBKDF2Encoder.hashPassword(user.getPassword()));
            user.setActive(true);
            userRepository.save(user);
            roleRepository.addUserToRole(null, user.getUsername());
        }else{
            logger.log(Level.SEVERE,"registerUser() user is null");
        }
    }

    public boolean checkPresenceOfUsername(String username){
        return userRepository.checkPresenceOfUsername(username)==1;
    }
}
