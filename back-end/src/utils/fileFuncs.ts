
// const { keys } = require("../../config/keys")

const fs = require('fs');
// const s3 = new AWS.S3({
//     signatureVersion: 'v4',
//     accessKeyId: "AKIAJH52AAB5XEIEZQXQ",
//     secretAccessKey: "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",
//     region: 'us-east-2'
// });
// var kms = new AWS.KMS({apiVersion: '2014-11-01'});

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const keys = require("../config/keys");
const path = require("path");
//IMAGE UPLOAD
aws.config.update({
  // Your SECRET ACCESS KEY from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
  secretAccessKey: "Kud+HU5kEzRFvXj5LKrur9E1ANUuo/ThHa+K5H9I",
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: "AKIAJH52AAB5XEIEZQXQ",
  region: "us-east-2" // region of your bucket
});
const s3 = new aws.S3();
export const storage = multerS3({
  s3: s3,
  bucket: "crypto-net",
  acl: "public-read",
  metadata: function(req:any, file:any, cb:any) {
    cb(null, { fieldName: file.originalname });
  },
  key: function(req:any, file:any, cb:any) {
    cb(null, `${req.params.id}_${req.user._id}`);
  }
});

// Check File Type
export function checkFileType(file:any, cb:any) {
  // Allowed ext
  const filetypes = /mp3/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Audio Only!");
  }
}


export const uploadFile = (files:FileList, conversationdId:string, messageId:string) => {
    console.log("bob")
    return new Promise<any>((resolve, reject) => {
        let fileData:any = []
        for( let i = 0; i< files.length; i++){
            // console.log(files[i])
            const j = Buffer.from(files[i])

            const params = {
                Bucket: 'kloud-storage', // pass your bucket name
                Key: `conversations/${conversationdId}/${messageId}/${files[i].name.trim().replace(" ", "_")}`, // file will be saved as testBucket/contacts.csv
                Body: j
            };
            s3.putObject(params, function(s3Err:any, data:any) {
                if (s3Err) throw s3Err;
               fileData.push(data);
            });
            if (i === files.length-1) resolve(fileData)
        }
        // files.forEach((file, i) => {
           
        // }) 
    });

  };


  function encode(data:any)
{
    var str = data.reduce(function(a:any,b:any){ return a+String.fromCharCode(b) },'');
    return Buffer.from(str, 'base64').toString().replace(/.{76}(?=.)/g,'$&\n');
}
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