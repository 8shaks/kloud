const Validator = require("validator");
import isEmpty from './is-empty'

export default function validateLoginInput(data: {username: string, password: string}) {
  let errors: { username?: string, password?: string} = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
