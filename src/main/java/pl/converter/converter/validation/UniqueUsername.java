package pl.converter.converter.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Constraint(validatedBy = UniqueUsernameValidator.class)
@Retention(RUNTIME)
@Target({ FIELD, METHOD, PARAMETER, ANNOTATION_TYPE })
public @interface UniqueUsername {
    String message() default "{pl.converter.converter.validation.UniqueUsername.message}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
