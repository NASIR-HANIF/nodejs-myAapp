const express = require("express");
const router = express.Router();
const companyController = require("../controller/company.controller");
// postrequest
router.post("/", (request, response) => {
    companyController.createCompany(request, response);
})

// put request
router.put("/:id", (request, response) => {
    companyController.updateCompanyData(request, response);
})

// get request
router.get("/:query", (request, response) => {

    companyController.getCompanyId(request,response);
})

module.exports = router