const keys_prod = {
  mongoURI: process.env.MONGO_URI!,
  secretOrKey: process.env.SECRET_OR_KEY!,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  resetPassword:process.env.RESET_PASSWORD,
  email: process.env.EMAIL,
  emailPassword:process.env.EMAIL_PASSWORD
}

module.exports =  keys_prod;