const tokenService = require("../services/token.service");
const dbservice = require("../services/database.service");

// refresh token
const refreshToken = async (uid, request) => {
  // onely domain name miley ga
  const endPoint = request.get("origin") || "http://" + request.get("host");
  const option = {
    body: uid,
    endPoint: endPoint,
    originalUrl: request.originalUrl,
  };
  const expiresIn = 86400;
  const newToken = await tokenService.createCustomToken(option, expiresIn);
  const updateMe = {
    token: newToken,
    expiresIn: expiresIn,
    updateMe: Date.now(),
  };
  await dbservice.upDateByQuery(uid, "userSchema", updateMe);
  return newToken;
};

// user checked logged
const checkUserLogged = async (request, response) => {
  const tokenData = await tokenService.verify(request);
  if (tokenData.isVerified) {
    const query = {
      token: request.cookies.authToken,
      isLogged: true,
    };
    const userData = await dbservice.getRecordByQuery(query, "userSchema");
    if (userData.length > 0) {
      // refresh token se new token ko resive kia
      const newToken = await refreshToken(tokenData.data, request);
      response.cookie("authToken", newToken, { maxAge: 86400 * 1000 });
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const logout = async (request, response) => {
  const tokenData = await tokenService.verify(request);
  if (tokenData.isVerified) {
    const query = {
      token: request.cookies.authToken,
    };
    const updateMe = {
      isLogged: false,
      updateAt: Date.now(),
    };
    const userRes = await dbservice.upDateByQuery(
      query,
      "userSchema",
      updateMe
    );
    if (userRes.modifiedCount == 1) {
      await response.clearCookie("authToken");
      response.redirect("/");
    }else{
        response.redirect("/profile"); 
    }
  } else {
    response.status(401);
    response.json({
      message: "Permission denied !",
    });
  }
};

module.exports = {
  checkUserLogged,
  logout,
};
