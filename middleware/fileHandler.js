import multer from "multer";
const storage = multer.memoryStorage();
const uploadFile = multer({
  storage: storage,
  limits: 1,
  fileFilter: (req, file, cb) => {
    if (file.originalname.split(".")[file.originalname.split(".").length - 1] === "dbf") {
      req.valid = true;
      cb(null, true);
    } else {
      req.valid = false;
      cb(null, false);
    }
  },
});
export default uploadFile;
