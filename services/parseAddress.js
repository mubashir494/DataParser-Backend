import { Dbf } from "dbf-reader";
import csv from "csv-parser";
import fs from 'fs';
import {DBFFile} from 'dbffile'
import dbf from  "dbf";
import { doesNotReject } from "assert";
import { resolve } from "path";

export const checkAddressFields = (dataTable, addressFields) => {
  const arr = Object.keys(addressFields).map((key) => addressFields[key]);
  const setArr = new Set(arr);
  if (arr.length == setArr.size) {
    let found = true;
    arr.forEach((element) => {
      let found2 = false;
      dataTable.columns.forEach((el) => {
        if (el.name == element) {
          found2 = true;
          
        }
      });
      if (found2 == false) {
        found = false;
      }
    });

    return found;
  } else {
    return false;
  }
};

export const checkOwnerFields = (dataTable, ownerFields) => {
  const arr = Object.keys(ownerFields).map((key) => ownerFields[key]);
  const setArr = new Set(arr);
  if (arr.length == setArr.size) {
    let found = true;
    arr.forEach((element) => {
      let found2 = false;
      dataTable.columns.forEach((el) => {
        if (el.name == element) {
          found2 = true;
        }
      });

      if (!found2) {
        found = false;
      }
    });
    return found;
  } else {
    return false;
  }
};

export const getAddresses = (dataTable, addressFields) => {
  let addresses = [];
  dataTable.rows.forEach((element) => {
    let obj = {};
    obj.street = String(element[addressFields.street]);
    obj.city = String(element[addressFields.city]);
    obj.postalCode = String(element[addressFields.postalCode]);
    // Add optional fields here
    addresses.push(obj);
  });
  return addresses;
};

export const getOwners = (dataTable, ownerFields) => {
  let owners = [];
  dataTable.rows.forEach((element) => {
    let obj = {};
    obj.street = element[ownerFields.street];
    obj.name = element[ownerFields.name];
    if (ownerFields.mailing) {
      obj.mailing = String(element[ownerFields.mailing]);
    }
    if (ownerFields.addresscsz) {
      obj.addresscsz = String(element[ownerFields.addresscsz]);
    }
    if (ownerFields.postalCode) {
      obj.postalCode = String(element[ownerFields.postalCode]);
    }
    if (ownerFields.type) {
      obj.type = String(element[ownerFields.type]);
    }
    owners.push(obj);
  });
  return owners;
};


export const getFields = (buffer) =>{
  const datatable = Dbf.read(buffer);
  let arr = []
  datatable.columns.forEach((element) =>{
    arr.push(element.name);
  })
  return arr;
}

