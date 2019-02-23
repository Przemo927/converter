package pl.converter.converter.mapper;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import pl.converter.converter.model.CustomEntityException;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@ControllerAdvice
    @RestController
    public class CustomResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
        protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                      HttpHeaders headers, HttpStatus status, WebRequest request) {
        List<String> errorMessages = new ArrayList<>();

            for(ObjectError error:ex.getBindingResult().getAllErrors()){
                errorMessages.add(error.getDefaultMessage());
            }

            return new ResponseEntity(new CustomEntityException(new Date(), errorMessages),HttpStatus.BAD_REQUEST);
        }
    }
