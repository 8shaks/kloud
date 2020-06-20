const Validator = require("validator");
import isEmpty from './is-empty'

export default function validateCollab(data: {username: string, title: string, description: string}) {
  let errors: { username?: string, title?: string, description?: string} = {};

  data.username = !isEmpty(data.username) || typeof data.username !== 'string' ? data.username : "";
  data.title = !isEmpty(data.title) || typeof data.title !== 'string' ? data.title : "";
  data.description = !isEmpty(data.description) || typeof data.description !== 'string' ? data.description : "";


  if (Validator.isEmpty(data.username)) {
    errors.username = "Please add a valid user";
  }

  if(data.description){
    if(data.description?.length > 300 || data.description?.length < 20 ){
      errors.description = "Please enter a description below 300 characters"
    }
  }
  if(data.title){
    if(data.title?.length > 100 || data.title?.length < 10 ){
      errors.title = "Please enter a title below 100 characters"
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
