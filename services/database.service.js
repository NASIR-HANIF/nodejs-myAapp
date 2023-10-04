const mongo = require("mongoose");
const companySchema = require("../models/company.model");
const userSchema = require("../models/user.model");
const studentSchema =require("../models/students.model");
 const url = "mongodb://127.0.0.1:27017/just-web";
 // const url = ""
mongo.connect(url);

const schemaList = {
    companySchema : companySchema,
    userSchema : userSchema,
    studentSchema : studentSchema
}

const creatRecord = async(data,schema)=>{
    const currentSchema = schemaList[schema]
const dataRes = await currentSchema(data).save();
return dataRes;
}


// get record dbService.getRecordByQuery

const getRecordByQuery = async (query,schema)=>{
    const currentSchema = schemaList[schema];
   const dataRes = await currentSchema.find(query);
return dataRes;

}

// update data user database
const upDateByQuery = async (query,schema,data)=>{
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.updateOne(query,data);
    return dataRes;
}

// cound data 
const countData = async (schema)=>{
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.countDocuments();
    return dataRes;
}

// paginateData
const paginateData = async (query,from,to ,schema)=>{
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.find(query).skip(from).limit(to);
    return dataRes;
}

// delete student by id
const deleteById = async (id ,schema)=>{
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.findByIdAndDelete(id);
    return dataRes;
}

// update student by id
const updateById = async (id,data ,schema)=>{
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.findByIdAndUpdate(id,data,{new : true});
    return dataRes;
}

module.exports = {
    creatRecord : creatRecord,
    getRecordByQuery : getRecordByQuery,
    upDateByQuery : upDateByQuery,
    countData : countData,
    paginateData : paginateData,
    deleteById : deleteById,
    updateById : updateById
}
