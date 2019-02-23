package pl.converter.converter.validation;

import org.springframework.beans.factory.annotation.Autowired;
import pl.converter.converter.Service.UserService;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

	@Autowired
	UserService userService;

	@Override
	public void initialize(UniqueUsername arg0) {

	}

	@Override
	public boolean isValid(String username, ConstraintValidatorContext arg1) {
		return !userService.checkPresenceOfUsername(username);
	}


}
