const Validator = require("validator");
import isEmpty from './is-empty'
const normalize = require('normalize-url');


interface  profileDataErrors {
  bio?: string,
  social?: {
    youtube?: string,
    instagram?: string,
    twitter?: string,
    beatstars?: string,
    soundcloud?: string
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
    beatstars?: string,
    soundcloud?: string
  },
  credits?:string[]
}

const urlRegex =  new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);

export default function validateProfileInput(data: profileData ) {
    let errors: profileData = {};
    
    if(data.social){
      isEmpty(data.social.youtube) ?  data.social.youtube === '' : data.social.youtube =  normalize(data.social.youtube, { forceHttps: true })
      isEmpty(data.social.beatstars) ?  data.social.beatstars === '' : data.social.beatstars =  normalize(data.social.beatstars, { forceHttps: true })
      isEmpty(data.social.twitter) ?  data.social.twitter === '' : data.social.twitter =  normalize(data.social.twitter, { forceHttps: true })
      isEmpty(data.social.instagram) ?  data.social.instagram === '' : data.social.instagram =  normalize(data.social.instagram, { forceHttps: true })
      isEmpty(data.social.soundcloud) ?  data.social.soundcloud === '' : data.social.soundcloud =  normalize(data.social.soundcloud, { forceHttps: true })
      if(data.social.youtube && data.social.youtube.length === 0){
        !urlRegex.test(data.social.youtube) ? errors.social!.youtube = "Please enter a valid youtube url" : null
      }
      if(data.social.twitter && data.social.twitter.length === 0){
        !urlRegex.test(data.social.twitter) ? errors.social!.twitter = "Please enter a valid twitter url" : null
      }
      if(data.social.soundcloud && data.social.soundcloud.length === 0){
        !urlRegex.test(data.social.soundcloud) ? errors.social!.soundcloud = "Please enter a valid soundcloud url" : null
      }
      if(data.social.beatstars && data.social.beatstars.length === 0){
        !urlRegex.test(data.social.beatstars) ? errors.social!.beatstars = "Please enter a valid beatstars url" : null
      }
      if(data.social.instagram && data.social.instagram.length === 0){
        !urlRegex.test(data.social.instagram) ? errors.social!.instagram = "Please enter a valid instagram url" : null
      }
    }
    
    isEmpty(data.bio) ?  data.bio === '' : data.bio ;
   
    if(data.bio){
      if(data.bio?.length > 200 ){
        errors.bio = "Please enter a bio below 200 characters"
      }
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
}