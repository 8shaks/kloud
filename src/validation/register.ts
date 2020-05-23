const Validator = require("validator");
import isEmpty from './is-empty'

interface userData {
  username?: string,
  email?: string,
  password?: string,
  password2?: string
}
export default function validateRegisterInput(data:userData) {
    let errors: userData = {};
  
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  
    if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
      errors.username = "Username must be between 2 and 30 characters";
    }
  
    if (Validator.isEmpty(data.username)) {
      errors.username = "Username is required";
    }
    if (!Validator.isEmail(data.email)) {
      errors.email = "Email is not valid";
    }
    if (Validator.isEmpty(data.email)) {
      errors.email = "Email is required";
    }
  
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
  