const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
// post request
 router.post("/",(request,response)=>{
   userController.creatUser(request,response);
 })
// get request
 router.get("/:query",(request,response)=>{
userController.getUserPassword(request,response);
})

// put request
router.put("/:id",(request,response)=>{
  userController.createLog(request,response);
  })

 module.exports = router;