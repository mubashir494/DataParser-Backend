import { Dbf } from "dbf-reader";
import { PrismaClient } from "@prisma/client";
import {
  checkAddressFields,
  checkOwnerFields,
  getAddresses,
  getFields,
  getOwners,
} from "../services/parseAddress.js";

const prisma = new PrismaClient();

// Upload Address File to Database
export const uploadAddress = async (req, res) => {
  if (req.valid == true && req.file.size < 100000000) {
    if (req.body.id) {
      try {
        const findCounty = await prisma.county.findFirst({
          where: { id: req.body.id },
        });
        if (findCounty && findCounty.addressFile == null) {
          const fields = getFields(req.file.buffer);
          const county = await prisma.county.update({
            where: { id: req.body.id },
            data: { addressFile: req.file.buffer },
          });
          res.status(200).json({ message: "Success", fields });
        } else {
          res.status(400).json({
            message: "County doesn't Exist or file have already been uploaded",
          });
        }
      } catch (e) {
        res.status(400).json({ message: e.message });
      }
    } else {
      res.status(400).json({ message: "Invalid Body" });
    }
  } else {
    res.status(401).json({ message: "Invalid File" });
  }
};

// Upload Ownership File to Database
export const uploadOwnership = async (req, res) => {
  if (req.valid == true && req.file.size < 100000000) {
    if (req.body.id) {
      try {
        const findCounty = await prisma.county.findFirst({
          where: { id: req.body.id },
        });

        if (findCounty && findCounty.ownerFile == null) {
          const fields = getFields(req.file.buffer);
          const county = await prisma.county.update({
            where: { id: req.body.id },
            data: { ownerFile: req.file.buffer },
          });
          res.status(200).json({ message: "Success", fields });
        } else {
          res.status(400).json({
            message: "County doesn't Exist or file have already been uploaded",
          });
        }
      } catch (e) {
        res.status(400).json({ message: e.message });
      }
    } else {
      res.status(400).json({ message: "Invalid Body" });
    }
  } else {
    res.status(401).json({ message: "Invalid File" });
  }
};

// Create County
export const createCounty = async (req, res) => {
  if (req.body.name) {
    try {
      const county = await prisma.county.create({
        data: {
          updatedAt: new Date(),
          name: req.body.name,
        },
      });
      res.status(200).json(county);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  } else {
    res.status(400).json({ message: "Invalid Body" });
  }
};

// Populate the Database with Address Data
// Input {"id" : "xyz" , addressFields : {"street" : "xyz", "postalCode" : "xyz","city" :"xyz"}, ownershipFields : {"name" : "xyz", "street" : "xyz","postalCode" : "xyz"}}
export const parseAddress = async (req, res) => {
  if (req.body.id && req.body.addressFields) {
    if (
      req.body.addressFields.street &&
      req.body.addressFields.postalCode &&
      req.body.addressFields.city
    ) {
      const county = await prisma.county.findFirst({
        where: { id: req.body.id },
      });
      if (county) {
        if (county.addressFile && county.ownerFile) {
          let datatable = Dbf.read(county.addressFile);
          if (checkAddressFields(datatable, req.body.addressFields)) {
            const address = getAddresses(datatable, req.body.addressFields);

            const counties = await prisma.county.update({
              where: { id: req.body.id },
              data: {
                addresses: { create: address },
              },
            });
            res.status(200).json({ message: "Success" });
          } else {
            res
              .status(400)
              .json({ message: "Invalid Address or ownership fields" });
          }
        } else {
          res.status(400).json({ message: "Please save the files first" });
        }
      } else {
        res.status(400).json({ message: "Invalid Request" });
      }
    } else {
      res.status(400).json({ message: "Invalid Body" });
    }
  } else {
    res.status(400).json({ message: "Invalid Body" });
  }
};

// Populate ownership database with the data
export const parseOwnership = async (req, res) => {
  if (req.body.id && req.body.ownershipFields) {
    if (req.body.ownershipFields.street && req.body.ownershipFields.name) {
      const county = await prisma.county.findFirst({
        where: { id: req.body.id },
      });
      if (county) {
        if (county.ownerFile) {
          let datatable = Dbf.read(county.ownerFile);
          if (checkOwnerFields(datatable, req.body.ownershipFields)) {
            const owners = getOwners(datatable, req.body.ownershipFields);
            const counties = await prisma.county.update({
              where: { id: req.body.id },
              data: {
                Owner: { create: owners },
              },
            });
            res.status(200).json({ message: "Success" });
          } else {
            res
              .status(400)
              .json({ message: "Invalid Address or ownership fields" });
          }
        } else {
          res.status(400).json({ message: "Please save the files first" });
        }
      } else {
        res.status(400).json({ message: "Invalid Request" });
      }
    } else {
      res.status(400).json({ message: "Invalid Body" });
    }
  } else {
    res.status(400).json({ message: "Invalid Body" });
  }
};

// Delete Address Data
export const deleteAddresses = async (req, res) => {
  if (req.body.id) {
    const county = await prisma.county.findFirst({
      where: { id: req.body.id },
      include: { addresses: true },
    });
    if (county && county.addressFile) {
      await prisma.county.update({
        where: { id: req.body.id },
        data: {
          addressFile: null,
        },
      });
      if (county.addresses) {
        await prisma.address.deleteMany({ where: { countyId: req.body.id } });
      }

      res.status(200).json({ message: "Success" });
    } else {
      res.status(400).json({ message: "Address File doesn't exist" });
    }
  } else {
    res.status(400).json({ message: "Invalid Body" });
  }
};

// Delete Owner Data
export const deleteOwnership = async (req, res) => {
  if (req.body.id) {
    const county = await prisma.county.findFirst({
      where: { id: req.body.id },
      include: { Owner: true },
    });
    if (county && county.ownerFile) {
      await prisma.county.update({
        where: { id: req.body.id },
        data: {
          ownerFile: null,
        },
      });
      if (county.Owner) {
        await prisma.owner.deleteMany({ where: { countyId: req.body.id } });
      }
      res.status(200).json({ message: "Success" });
    } else {
      res.status(400).json({ message: "Address File doesn't exist" });
    }
  } else {
    res.status(400).json({ message: "Invalid Body" });
  }
};

//Get Address Fields from the saved file
export const getAddressFields = async (req, res) => {
  if (req.body.id) {
    const county = await prisma.county.findFirst({
      where: { id: req.body.id },
    });
    if (county && county.addressFile) {
      const fields = getFields(county.addressFile);
      res.status(200).json({ fields });
    } else {
      res.status(401).json({
        message: "County doesn't exist or the address file isn't uploaded",
      });
    }
  }
};

//Get Owners Fields from the saved file
export const getOwnerFields = async (req, res) => {
  if (req.body.id) {
    const county = await prisma.county.findFirst({
      where: { id: req.body.id },
    });
    if (county && county.ownerFile) {
      const fields = getFields(county.ownerFile);
      res.status(200).json({fields });
    } else {
      res.status(401).json({
        message: "County doesn't exist or the Owner file isn't uploaded",
      });
    }
  }
};

// Get County
export const getCounties = async (req, res) => {
  const county = await prisma.county.findMany({
    include: { Owner: true, addresses: true },
  });
  if (county) {
    county.forEach((element) => {
      if (element.Owner && element.Owner.lenght > 0) {
        element.Owner = true;
      } else {
        element.Owner = false;
      }
      if (element.ownerFile) {
        element.ownerFile = true;
      } else {
        element.ownerFile = false;
      }
      if (element.addressFile) {
        element.addressFile = true;
      } else {
        element.addressFile = false;
      }
      if (element.addresses && element.addresses.length > 0) {
        element.addresses = true;
      } else {
        element.addresses = false;
      }
    });
    res.status(200).json(county);
  }
};


