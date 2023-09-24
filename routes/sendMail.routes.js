const express = require("express");
const router = express.Router();
const sendMailController = require("../controller/sendMail.controller")

router.post("/",(request,response)=>{
    sendMailController.sendEmail(request,response);

});

module.exports = router