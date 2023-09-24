const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");

router.post("/", async (request, response) => {
  let expiresIn = 120;
  const token = await tokenService.create(request, expiresIn);
  const companyRes = await httpService.postRequest({
    endPoint: request.get("origin"),
    api: "/api/private/company",
    data: token
  });
  // requesting user api
  if (companyRes.isCompanyCreated) {
    const newUser = {
      body: {
        uid: companyRes.data._id,
        password: request.body.password,
        companyInfo: companyRes.data
      },
      endPoint: request.get("origin"),
      originalUrl: request.originalUrl,
    }
    // user private route  token request
    const userToken = await tokenService.createCustomToken(newUser, expiresIn);
    const userRes = await httpService.postRequest({
      endPoint: request.get("origin"),
      api: "/api/private/user",
      data: userToken
    });
    // return user response
    response.cookie("authToken", userRes.token, { maxAge: 86400 * 1000 })
    response.json(userRes)
  } else {
    response.status(409)
    response.json(companyRes)
  }

});



module.exports = router;


