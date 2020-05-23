const Validator = require("validator");
import isEmpty from './is-empty'
const normalize = require('normalize-url');


interface  profileDataErrors {
  bio?: string,
  social?: {
    youtube?: string,
    instagram?: string,
    twitter?: string,
    facebook?: string,
  },
  credits:string
}

interface  profileData {
  user?: string,
  bio?: string,
  social?: {
    youtube?: string,
    instagram?: string,
    twitter?: string,
    facebook?: string,
  },
  credits?:string[]
}

const youtubeRegex =  new RegExp(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);

export default function validateProfileInput(data: profileData ) {
  let isValid = true
    let errors: profileData = {};


    if(data.social){
      isEmpty(data.social.youtube) ?  data.social.youtube === '' : data.social.youtube =  normalize(data.social.youtube, { forceHttps: true })
      isEmpty(data.social.facebook) ?  data.social.facebook === '' : data.social.facebook =  normalize(data.social.facebook, { forceHttps: true })
      isEmpty(data.social.twitter) ?  data.social.twitter === '' : data.social.twitter =  normalize(data.social.twitter, { forceHttps: true })
      isEmpty(data.social.instagram) ?  data.social.instagram === '' : data.social.instagram =  normalize(data.social.instagram, { forceHttps: true })
    }
    
    isEmpty(data.bio) ?  data.bio === '' : data.bio ;

    if(data.bio){
      if(data.bio?.length > 200 && data.bio ){
        errors.bio = "Please enter a bio below 200 characters"
      }
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
}