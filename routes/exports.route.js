const express = require("express");
const router = express.Router();
const exportController = require("../controller/export.controller")

//creat pdf route
router.post("/",(request,response)=>{
    exportController.pdf(request,response)
})

// delete pdf route
router.delete("/:filename",(request,response)=>{
    exportController.deletePdf(request,response)
})

module.exports = router