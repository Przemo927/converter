package pl.converter.converter.Rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import pl.converter.converter.Service.UserService;
import pl.converter.converter.model.User;

import javax.validation.Valid;

@RestController
public class RegisterEndPoint {

    private UserService userService;

    @Autowired
    public RegisterEndPoint(UserService userService){
        this.userService=userService;
    }

    @RequestMapping(name = "registerUser", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity registerUser(@RequestBody @Valid User user){
        this.userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

}
