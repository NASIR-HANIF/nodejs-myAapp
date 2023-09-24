require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const issService = require("./iss.service")

// creat token with request 
const create = async (request, expiresIn) => {
    const formData = request.body;
    const endPoint = request.get("origin");;
    const api = request.originalUrl;
    const iss = endPoint + api;

    const token = await jwt.sign({
        iss: iss,
        data: formData
    }, secretKey, { expiresIn: expiresIn });

    return token;
}

// creat custom token
const createCustomToken = async (data, expiresIn) => {
    const formData = data.body;
    const endPoint = data.endPoint;
    const api = data.originalUrl;
    const iss = endPoint + api;

    const token = await jwt.sign({
        iss: iss,
        data: formData
    }, secretKey, { expiresIn: expiresIn });

    return token;
}


// verify token
const verify = (request) => {
    let token = "";

    if (request.method == "GET") {
        if (request.headers['x-auth-token']) {
            token = request.headers['x-auth-token'];
        } else {
            token = request.cookies.authToken;
        }
    } else {
        token = request.body.token
    }

    if (token) {
        try {
            const tmp = jwt.verify(token, secretKey);
            const requestCommingFrom = tmp.iss;
            if (issService.indexOf(requestCommingFrom) != -1) {
                return {
                    isVerified: true,
                    data: tmp.data
                };
            } else {
                return {
                    isVerified: false
                };
            }

        } catch (error) {
            return {
                isVerified: false
            };
        }
    } else {
        return {
            isVerified: false
        };
    }

}

// customTokenVerification
const customTokenVerification = (token)=>{
    try {
        const tmp = jwt.verify(token, secretKey);
        const requestCommingFrom = tmp.iss;
        if (issService.indexOf(requestCommingFrom) != -1) {
            return {
                isVerified: true,
                data: tmp.data
            };
        } else {
            return {
                isVerified: false
            };
        }

    } catch (error) {
        return {
            isVerified: false
        };
    }
}
   
module.exports = {
    create : create,
    verify : verify,
    createCustomToken : createCustomToken,
    customTokenVerification : customTokenVerification
}