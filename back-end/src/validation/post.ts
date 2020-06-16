const Validator = require("validator");
import isEmpty from './is-empty'
const normalize = require('normalize-url');


interface  postData {
  title?:string,
  description?:string
}

const youtubeRegex =  new RegExp(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);

export default function validateProfileInput(data: postData ) {
  let isValid = true
    let errors: postData = {};

    
    isEmpty(data.description) ?  data.description === '' : data.description ;
    isEmpty(data.title) ?  data.title === '' : data.title ;

    if(data.description){
      if(data.description?.length > 300 || data.description?.length < 20 ){
        errors.description = "Please enter a bio below 300 characters"
      }
    }
    if(data.title){
      if(data.title?.length > 100 || data.title?.length < 10 ){
        errors.title = "Please enter a bio below 100 characters"
      }
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
}