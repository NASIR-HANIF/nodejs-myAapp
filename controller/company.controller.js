const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const createCompany = async (request, response) => {
  const token = tokenService.verify(request);
  // stor data data base
  if (token) {
    try {
      const data = token.data;
      const dataRes = await dbService.creatRecord(data, 'companySchema');
      response.status(200)
      response.json({
        isCompanyCreated: true,
        message: "Company Created",
        data: dataRes
      })

    } catch (error) {
      response.status(409)
      response.json({
        isCompanyCreated: false,
        message: error
      })
    }
  } else {
    response.status(401)
    response.json({
      message: "Permission denied !"
    })
  }
}

// getCompanyId function
const getCompanyId = async (request, response) => {
  const token = await tokenService.verify(request);
  if (token.isVerified) {
    const query = {
      email: token.data.email
    }
    const companyRes = await dbService.getRecordByQuery(query, "companySchema");

    if (companyRes.length > 0) {
      response.status(200);
      response.json({
        isCompanyExists: true,
        message: "Company Available",
        data: companyRes
      })

    } else {
      response.status(404);
      response.json({
        isCompanyExists: false,
        message: "Company Not Found !"
      })
    }

  } else {
    response.status(401)
    response.json({
      message: "Permission Denied !"
    })
  }
}

// updateCompanyData
const updateCompanyData = async (request, response) => {
  const token = tokenService.verify(request);

  if (token.isVerified) {
    const id = request.params.id;
    const data = request.body;

    try {
      const dataRes = await dbService.updateById(id, data, "companySchema");  
      const newToken = await refreshToken(request,id,dataRes);
      response.cookie("authToken",newToken,{maxAge : (86400*1000)});
      response.status(200);
      response.json({
        message: "update success",
        data: dataRes
      })
    } catch (error) {
      response.status(424)
      response.json({
        message: "update failed"
      })
    }

  } else {
    response.status(401)
    response.json({
      message: "Permission Denied !"
    })
  }
}

// refresh token
const refreshToken = async (request,id,dataRes) => {
  const data = {
    uid : id,
    companyInfo : dataRes
  }
  // onely domain name miley ga
  const endPoint = request.get("origin") || "http://" + request.get("host");
  const option = {
    body: data,
    endPoint: endPoint,
    originalUrl: "/api/private/company"
  };
  const expiresIn = 86400;
  const newToken = await tokenService.createCustomToken(option, expiresIn);
  const query = {
    uid : id
  }
  const updateMe = {
    token: newToken,
    expiresIn: expiresIn,
    updateMe: Date.now(),
  }
  await dbService.upDateByQuery(query, "userSchema", updateMe);
  return newToken;
};



module.exports = {
  createCompany : createCompany,
  getCompanyId : getCompanyId,
  updateCompanyData : updateCompanyData
}