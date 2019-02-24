package pl.converter.converter.validation;

import org.springframework.beans.factory.annotation.Autowired;
import pl.converter.converter.Service.UserService;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class EmailUniqueValidator implements ConstraintValidator<EmailUnique, String> {

	@Autowired
	UserService userService;
	@Override
	public void initialize(EmailUnique arg0) {

	}

	@Override
	public boolean isValid(String email, ConstraintValidatorContext arg1) {
		return !userService.checkPresenceOfEmail(email);
	}


}
