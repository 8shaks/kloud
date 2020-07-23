
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

// var kms = new AWS.KMS({apiVersion: '2014-11-01'});

//IMAGE UPLOAD
// aws.config.update({
//   // Your SECRET ACCESS KEY from AWS should go here,
//   // Never share it!
//   // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
//   secretAccessKey: "Kud+HU5kEzRFvXj5LKrur9E1ANUuo/ThHa+K5H9I",
//   // Not working key, Your ACCESS KEY ID from AWS should go here,
//   // Never share it!
//   // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
//   accessKeyId: "AKIAJH52AAB5XEIEZQXQ",
//   region: "us-east-2" // region of your bucket
// });

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



// {
//   "Version": "2012-10-17",
//   "Statement": [
//       {
//           "Sid": "VisualEditor0",
//           "Effect": "Allow",
//           "Action": [
//               "s3:PutObject",
//               "s3:PutObjectAcl"
//           ],
//           "Resource": "arn:aws:s3:::kloud-storage/*",
//           "Principal": "*"
//       }
//   ]
// }
export const uploadFile = (file:any, collabId:string) => {
    return new Promise<any>((resolve, reject) => {
        // let fileData:any = []
        // for( let i = 0; i< files.length; i++){
        //     // console.log(files[i])
        //     const j = Buffer.from(files[i])

            const params = {
                Bucket: 'kloud-storage', // pass your bucket name
                Key: `${collabId}/${file.originalname}`, // file will be saved as testBucket/contacts.csv
                Body: file.buffer
            };
        //     s3.putObject(params, function(s3Err:any, data:any) {
        //         if (s3Err) throw s3Err;
        //        fileData.push(data);
        //     });
        //     if (i === files.length-1) resolve(fileData)
        // }
        // files.forEach((file, i) => {
          // const j = Buffer.from(files[i])
        // }) 
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