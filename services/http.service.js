const ajax = require("supertest");

const postRequest = async (request)=>{
 const response = await ajax(request.endPoint)  // end point
.post(request.api) // api
.send({token : request.data})// data

return response.body;

// yeaha se response na de keh response waley vareable me send ker den gey
// .end((error,dataRes)=>{
//     console.log(dataRes.body)
// });// response resive
}



// http get request

const getRequest = async (request)=>{
    const response = await ajax(request.endPoint)  // end point
   .get(request.api+"/"+request.data) // api
   .set({"X-Auth-Token" : request.data})
   return response.body;
   
   }
// http put request
   const putRequest = async (request)=>{
    const response = await ajax(request.endPoint)  // end point
   .put(request.api+"/"+request.data) // api put request karni hey
   .send({token: request.data})  // send me data bhajna hey or header nahi dena hey
   return response.body;
   
   }

module.exports = {
    postRequest,
    getRequest,
    putRequest
}