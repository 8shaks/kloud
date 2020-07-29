
// const { keys } = require("../../config/keys")

const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const keys = require("../config/keys");
const path = require("path");

const s3 = new aws.S3({
    signatureVersion: 'v4',
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    region: 'us-east-2'
});


const storage = multerS3({
  s3: s3,
  bucket: "kloud-banners",
  acl: "public-read",
  metadata: function(req: any, file: { originalname: any; }, cb: (arg0: null, arg1: { fieldName: any; }) => void) {
    cb(null, { fieldName: file.originalname });
  },
  key: function(req: { params: { id: any; }; user: { id: string; }; }, file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, `${req.user.id}/${file.originalname}`);
  }
});

// Check File Type
function checkFileType(file: { originalname: any; mimetype: string; }, cb: (arg0: string | null, arg1?: boolean | undefined) => void) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const deleteImage = (key:string) => {
  return new Promise<any>((resolve, reject) => {
    resolve(
      s3.deleteObject({
        Bucket: "kloud-banners",
        Key: key
      },function (err:any,data:any){
        console.log(err)
        console.log(data)
      })
    )
  });
}

export default { checkFileType, storage, deleteImage}
