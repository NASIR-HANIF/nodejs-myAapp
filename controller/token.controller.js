const tokenService = require("../services/token.service")

// get token
const getToken = async (request, response) => {
    const token = tokenService.verify(request)
    if (token.isVerified) {
        const expiresIn = request.params.expires*1000;
        const data = JSON.parse(request.body.data)
        const endPoint = request.get("origin") || "http://" + request.get("host");
        const option = {
            body: data,
            endPoint: endPoint,
            originalUrl: "/get-token",
        };
       
        const newToken = await tokenService.createCustomToken(option, expiresIn);
        response.status(200)
        response.json({
            token : newToken
        })
    } else {
        response.status(401)
        response.json({
            message: "Permission denied"
        })
    }
}

module.exports = {
    getToken: getToken
}