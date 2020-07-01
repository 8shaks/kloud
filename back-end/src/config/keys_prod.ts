const keys_prod = {
  mongoURI: process.env.MONGO_URI!,
  secretOrKey: process.env.SECRET_OR_KEY!,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  // googleAPI:process.env.GOOGLEAPI,
}

module.exports =  keys_prod;