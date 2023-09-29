const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");
const bcryptService = require(("../services/bcrypt.service"))

router.post("/", async (request, response) => {
  let loginAs = request.body.loginAs
  

  if (loginAs == "admin") {
    adminLoger(request, response)
  }
  if (loginAs == "employee") {
    employeeLoger(request, response)
  }

  if (loginAs == "student") {
    studentLoger(request, response)
  }


})

// admin loger code
const adminLoger = async (request, response) => {
  let expiresIn = 120;
  const token = await tokenService.create(request, expiresIn);
  // getting user id
  const companyRes = await httpService.getRequest({
    endPoint: request.get("origin"),
    api: "/api/private/company",
    data: token
  });

  if (companyRes.isCompanyExists) {
    const uid = companyRes.data[0]._id;
    const query = {
      body: {
        uid: uid,
        companyInfo: companyRes.data[0]
      },
      endPoint: request.get("origin"),
      originalUrl: request.originalUrl
    }
    // make cookie token
    const uidToken = await tokenService.createCustomToken(query, expiresIn);
    // getting user id
    const userRes = await httpService.getRequest({
      endPoint: request.get("origin"),
      api: "/api/private/user",
      data: uidToken
    });

    // update role in authToken
    const role = userRes.data[0].role;
    query.body['role'] = role
    // get user password 
    if (userRes.isCompanyExists) {
      // start alow single device login 
      // if (userRes.data[0].isLogged) {
      //   response.status(406)// input reject status code
      //   response.json({
      //     message: "Please Logout from other device !"
      //   });
      //   return false;
      // }
      // end checking alow single device login  
      const realPassword = userRes.data[0].password;
      const isLoged = await bcryptService.decrypt(realPassword, request.body.password)
      if (isLoged) {
        const oneDaysInSecond = 86400;
        const authToken = await tokenService.createCustomToken(query, oneDaysInSecond);
        //stor token in database
        const dbToken = await httpService.putRequest({
          endPoint: request.get('origin'),
          api: "/api/private/user",
          data: authToken
        });


        response.cookie("authToken", authToken, { maxAge: oneDaysInSecond * 1000 });
        response.status(200);
        response.json({
          isLoged: true,
          message: "success"

        })

      } else {
        response.status(401);
        response.json({
          isLoged: false,
          message: "Wrong Password"
        })
      }
    } else {
      response.status(userRes.status)
      response.json(userRes)
    }

  } else {
    response.status(404)
    response.json(companyRes)
  }
}



// employee loger code
const employeeLoger = async (request, response) => {
  let expiresIn = 120;
  const token = await tokenService.create(request, expiresIn);
  // getting company id
  const companyRes = await httpService.getRequest({
    endPoint: request.get("origin"),
    api: "/api/private/company",
    data: token
  });

  if (companyRes.isCompanyExists) {
    const uid = companyRes.data[0]._id;
    const query = {
      body: {
        uid: uid,
        employeInfo: companyRes.data[0]
      },
      endPoint: request.get("origin"),
      originalUrl: request.originalUrl
    }
    // make cookie token
    const uidToken = await tokenService.createCustomToken(query, expiresIn);
    // getting user id
    const userRes = await httpService.getRequest({
      endPoint: request.get("origin"),
      api: "/api/private/user",
      data: uidToken
    });

    // update role in authToken
    const role = userRes.data[0].role;
    query.body['role'] = role
    // get user password 
    if (userRes.isCompanyExists) {
      // start alow single device login 
      // if (userRes.data[0].isLogged) {
      //   response.status(406)// input reject status code
      //   response.json({
      //     message: "Please Logout from other device !"
      //   });
      //   return false;
      // }
      // end checking alow single device login  
      const realPassword = userRes.data[0].password;
      const isLoged = await bcryptService.decrypt(realPassword, request.body.password)
      if (isLoged) {
        const oneDaysInSecond = 86400;
        const authToken = await tokenService.createCustomToken(query, oneDaysInSecond);
        //stor token in database
        const dbToken = await httpService.putRequest({
          endPoint: request.get('origin'),
          api: "/api/private/user",
          data: authToken
        });


        response.cookie("authToken", authToken, { maxAge: oneDaysInSecond * 1000 });
        response.status(200);
        response.json({
          isLoged: true,
          message: "success"

        })

      } else {
        response.status(401);
        response.json({
          isLoged: false,
          message: "Wrong Password"
        })
      }
    } else {
      response.status(userRes.status)
      response.json(userRes)
    }

  } else {
    response.status(404)
    response.json(companyRes)
  }
}



// student loger code
const studentLoger = async (request, response) => {
  let expiresIn = 120;
  const token = await tokenService.create(request, expiresIn);
  // getting user id
  const companyRes = await httpService.getRequest({
    endPoint: request.get("origin"),
    api: "/students/login",
    data: token
  });

  if (companyRes.isCompanyExists) {
    const uid = companyRes.data[0]._id;
    const query = {
      body: {
        uid: uid,
        studentInfo: companyRes.data[0]
      },
      endPoint: request.get("origin"),
      originalUrl: request.originalUrl
    }
    // make cookie token
    const uidToken = await tokenService.createCustomToken(query, expiresIn);
    // getting user id
    const userRes = await httpService.getRequest({
      endPoint: request.get("origin"),
      api: "/api/private/user",
      data: uidToken
    });

    // update role in authToken
    const role = userRes.data[0].role;
    query.body['role'] = role
    // get user password 
    if (userRes.isCompanyExists) {
      // start alow single device login 
      /*
      if (userRes.data[0].isLogged) {
        response.status(406)// input reject status code
        response.json({
          message: "Please Logout from other device !"
        });
        return false;
      }
      */
      // end checking alow single device login  
      const realPassword = userRes.data[0].password;
      const isLoged = await bcryptService.decrypt(realPassword, request.body.password)
      if (isLoged) {
        const oneDaysInSecond = 86400;
        const authToken = await tokenService.createCustomToken(query, oneDaysInSecond);
        //stor token in database
        const dbToken = await httpService.putRequest({
          endPoint: request.get('origin'),
          api: "/api/private/user",
          data: authToken
        });


        response.cookie("authToken", authToken, { maxAge: oneDaysInSecond * 1000 });
        response.status(200);
        response.json({
          isLoged: true,
          message: "success"

        })

      } else {
        response.status(401);
        response.json({
          isLoged: false,
          message: "Wrong Password"
        })
      }
    } else {
      response.status(userRes.status)
      response.json(userRes)
    }

  } else {
    response.status(404)
    response.json(companyRes)
  }
}
module.exports = router;
