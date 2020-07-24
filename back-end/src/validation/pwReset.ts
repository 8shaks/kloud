const Validator = require("validator");
import isEmpty from './is-empty'

interface pwData {
  password?: string,
  password2?: string
}
export default function validateRegisterInput(data:pwData) {
    let errors: pwData = {};
  

    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  

  
    if (Validator.isEmpty(data.password)) {
      errors.password = "Password is required";
    }
  
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = "Passowrd must be between 6 and 30 characters";
    }
  
    if (Validator.isEmpty(data.password2)) {
      errors.password2 = "Please confirm your password";
    }
  
    if (!Validator.equals(data.password, data.password2)) {
      errors.password2 = "Passwords must match";
    }
  
    return {
      errors,
      isValid: isEmpty(errors)
    };
  };
  