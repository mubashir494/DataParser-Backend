import {
  createCounty,
  uploadAddress,
  uploadOwnership,
  parseAddress,
  parseOwnership,
  deleteAddresses,
  deleteOwnership,
  getAddressFields,
  getOwnerFields,
  getCounties,
} from "../controller/data.js";
import { Router } from "express";
import uploadFile from "../middleware/fileHandler.js";

const router = Router();

//Create County to upload Address and Ownership file to the database
router.post("/county", createCounty);

// Upload address file to the database
router.post("/upload/address", uploadFile.single("address"), uploadAddress);

// Upload ownership file to the database
router.post(
  "/upload/ownership",
  uploadFile.single("ownership"),
  uploadOwnership
);

// Parse and store the address from saved files
router.post("/parse/address", parseAddress);

// Parse and store the ownership details from the saved file
router.post("/parse/ownership", parseOwnership);

// Delete address file and data
router.post("/delete/address", deleteAddresses);

// Delete owner file and data
router.post("/delete/ownership", deleteOwnership);

// Get Address file fields
router.post("/fields/address", getAddressFields);

// Get Owner file Fields
router.post("/fields/owner", getOwnerFields);

// Get All the Counties
router.get("/", getCounties);

export default router;
