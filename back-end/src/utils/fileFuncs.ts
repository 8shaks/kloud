
// const { keys } = require("../../config/keys")

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const keys = require("../config/keys");
const path = require("path");

const s3 = new aws.S3({
    signatureVersion: 'v4',
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    region: 'us-east-2'
});

export const storage = multerS3({
  s3: s3,
  bucket: "kloud-storage",
  acl: "public-read",
  metadata: function(req:any, file:any, cb:any) {
    cb(null, { fieldName: file.originalname });
  },
  key: function(req:any, file:any, cb:any) {
    // console.log(req)
    cb(null, `${req.params.collab_id}/${file.originalname}`);
  }
});

// Check File Type
export function checkFileType(file:any) {
  // Allowed ext
  const filetypes = /mp3|mpeg|wav|flac|midi/;

  // Check ext

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return true
  } else {
    return false
  }
}


export const uploadFile = (file:any, collabId:string) => {
    return new Promise<any>((resolve, reject) => {
          const params = {
              Bucket: 'kloud-storage', // pass your bucket name
              Key: `${collabId}/${file.originalname}`, // file will be saved as testBucket/contacts.csv
              Body: file.buffer
          };

            s3.putObject(params, function(s3Err:any, data:any) {
              if (s3Err) throw s3Err;
              resolve(data);
            //  fileData.push(data);
          });
    });

  };


export const getFile = (fileLoc:string) => {
    
    return new Promise<any>(async (resolve, reject) => {

        var getParams = {
            Bucket: 'kloud-storage', // your bucket name,
            Key: fileLoc, // path to the object you're looking for,
            Expires:60 * 5
        }
        const url = await s3.getSignedUrl('getObject', getParams)
        return resolve(url)
    });
}