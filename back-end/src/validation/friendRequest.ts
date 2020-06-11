const Validator = require("validator");
import isEmpty from './is-empty'

export default function validateFriendRequest(data: {username: string}) {
  let errors: { username?: string} = {};

  data.username = !isEmpty(data.username) || typeof data.username !== 'string' ? data.username : "";

  if (Validator.isEmpty(data.username)) {
    errors.username = "Please add a valid user";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
