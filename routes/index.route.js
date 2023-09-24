const express = require("express");
const route = express.Router();


// get request
route.get("/",(request,response)=>{
    response.render('index')
})

module.exports = route;