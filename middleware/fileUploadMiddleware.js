const multer = require("multer");
const cloudnary = require("../config/cloudnary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const productImageStorage = multer.diskStorage({
  destination: "public",
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, file.originalname);
  },
  fileFilter(req, file, cb) {
    // console.log(file, file.mimetype)
    const fileType = file.originalname.split(".")[1];
    console.log(file);
    if (['jpeg','png','jpg'].includes(fileType)) {
      cb(undefined, true);
    } else {
      cb({ message: "Unsupported File format" }, false);
    }
  },
  limits:{fileSize:1024*1024*3}
});

const productImportsStorage = multer.diskStorage({
  destination: "public",
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, file.originalname);
  },
  fileFilter(req, file, cb) {
    // console.log(file, file.mimetype)
    const fileType = file.originalname.split(".")[1];
    // console.log(file);
    if (["XLSX", "xlsx", "jpg"].includes(fileType)) {
      cb(undefined, true);
    } else {
      cb({ message: "Unsupported File format" }, false);
    }
    
  },
  limits: { fileSize: 1024 * 1024 * 3 },
});

const chatSelfieStorage = multer.diskStorage({
  destination: "uploads/chat-image",
  filename: (req, file, cb) => {
    console.log(file);
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPEG|JPG)$/)) {
      return cb(new Error("Please upload a valid image file"), false);
    }
    cb(undefined, true);
  },
});

 const fileFilter = (req, file, cb) => {
     if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPEG|JPG)$/)) {
      cb(new Error("Please upload a valid image file type"), false);
     }
      cb(undefined, true);
  }


   const importfileFilter = (req, file, cb) => {
     if (!file.originalname.match(/\.(XLSX|xlsx)$/)) {
       cb(new Error("Please upload a valid xlsx file only"), false);
     }
     cb(undefined, true);
   };

const storage = new CloudinaryStorage({
  cloudinary: cloudnary,
  params: {
    folder: "DEV",
  },
  allowedFormats: ["jpg", "png","jpeg","JPG","PNG","JPEG"],
}); 


exports.uploadImage = multer({
  storage: productImageStorage,
  limits: { fileSize: 1024 * 1024 * 3 },
  fileFilter: fileFilter
}).single("image");

exports.uploadAnyImages = multer({
  storage: productImageStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
}).any();


exports.uploadImages = multer({
  storage: productImageStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
}).array("image");

exports.cloudUploadTry = multer({ storage: storage }).single("image");

