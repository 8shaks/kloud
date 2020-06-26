
// const { keys } = require("../../config/keys")

const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: "AKIAJH52AAB5XEIEZQXQ",
  secretAccessKey: "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"
});
var kms = new AWS.KMS({apiVersion: '2014-11-01'});

export const uploadFile = (files:File[], conversationdId:string, messageId:string) => {
    return new Promise<any>((resolve, reject) => {
        let fileData:any = []
        files.forEach((file, i) => {
            const params = {
                Bucket: 'kloud-storage', // pass your bucket name
                Key: `conversations/${conversationdId}/${messageId}/${file.name.trim().replace(" ", "_")}`, // file will be saved as testBucket/contacts.csv
                Body: JSON.stringify(file, null, 2)
            };
            s3.upload(params, function(s3Err:any, data:any) {
                if (s3Err) throw s3Err;
               fileData.push(data);
            });
            if (i === files.length-1) resolve(fileData)
        }) 
    });

  };


  function encode(data:any)
{
    var str = data.reduce(function(a:any,b:any){ return a+String.fromCharCode(b) },'');
    return Buffer.from(str, 'base64').toString().replace(/.{76}(?=.)/g,'$&\n');
}
export const getFile = (fileLoc:{file:string, fileName:string}) => {
    
    // console.log(fileLoc)
    return new Promise<any>((resolve, reject) => {

        var getParams = {
            Bucket: 'kloud-storage', // your bucket name,
            Key: fileLoc.file // path to the object you're looking for
        }

        s3.getObject(getParams, async function(err:any, data:any) {
            // Handle any error and exit
            if (err){
                console.log(err);
                reject(err);
            }
            // data.url = await "data:audio/mp4;base64," + encode(data.Body);
            // resolve(data.Body.toString('utf-8'));
            resolve(data)
            
        // No error happened
        // Convert Body from a Buffer to a String
            
        //   let objectData = data.Body.toString('utf-8'); // Use the encoding necessary
        });
    });
}