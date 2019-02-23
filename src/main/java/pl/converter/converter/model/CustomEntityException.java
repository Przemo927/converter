package pl.converter.converter.model;

import java.util.Date;
import java.util.List;

public class CustomEntityException {

    private Date dateOfOccurence;
    private List<String> responseValidationResult;

    public CustomEntityException(Date dateOfOccurence, List<String> responseValidationResult){
        this.dateOfOccurence=dateOfOccurence;
        this.responseValidationResult=responseValidationResult;
    }

    public Date getDateOfOccurence() {
        return dateOfOccurence;
    }

    public void setDateOfOccurence(Date dateOfOccurence) {
        this.dateOfOccurence = dateOfOccurence;
    }

    public List<String> getResponseValidationResult() {
        return responseValidationResult;
    }

    public void setResponseValidationResult(List<String> responseValidationResult) {
        this.responseValidationResult = responseValidationResult;
    }
}
