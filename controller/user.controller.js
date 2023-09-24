const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");



const creatUser = async (request, response) => {
    const token = await tokenService.verify(request);
    if (token.isVerified) {
        try {
            // start autologin during signup
            console.log(token)
            const uidJson = {
                uid : token.data.uid,
                companyInfo : token.data.companyInfo

            }

            const endPoint = request.get("origin") || "http://" + request.get("host");
            const option = {
                body: uidJson,
                endPoint: endPoint,
                originalUrl: request.originalUrl,
            };
            const expiresIn = 86400;
            const newToken = await tokenService.createCustomToken(option, expiresIn);
            token.data['token']= newToken;
            token.data['expiresIn']= expiresIn;
            token.data['isLogged']= true;
            token.data['role']= "admin";

              // end autologin during signup
            const userRes = await dbService.creatRecord(token.data, 'userSchema');
            response.status(200)
            response.json({
                token : newToken,
                isUserCreated: true,
                message: "User created !"
            })

        } catch (error) {
            response.status(500)
            response.json({
                isUserCreated: false,
                message: "Internel server error"
            })
        }
    } else {
        response.status(401)
        response.json({
            message: "Permission denied"
        })
    }
}


// get password 
const getUserPassword = async (request, response) => {
    const token = await tokenService.verify(request);
    if (token.isVerified) {
        const userData = token.data;
        const query = {
            uid : userData.uid
        }
        const dataRes = await dbService.getRecordByQuery(query, "userSchema");
        if (dataRes.length > 0) {
            response.status(200);
            response.json({
                isCompanyExists: true,
                message: "Company Found",
                data: dataRes
            })

        } else {
            response.status(404);
            response.json({
                icCompanyExists: false,
                message: "Company Not Found"
            })
        }
    } else {
        response.status(401);
        response.json({ message: "Permission Denied !" })
    }
}


// creatLog 
const createLog = async (request, response) => {
    const token = await tokenService.verify(request);
    if (token.isVerified) {
        // next day work

        const query = {
            uid: token.data.uid
        }
        const data = {
            token : request.body.token,
            expiresIn: 86400,
            isLogged: true,
            updateAt: Date.now()
        }

        
          //  update data user in database
        const userRes = await dbService.upDateByQuery(query, 'userSchema', data);
        response.status(201);//update status code
        response.json({
            message: "Update Success"
        })
    } else {
        response.status(401);
        response.json({ message: "Permission Denied !" })
    }
}

module.exports = {
    creatUser,
    getUserPassword,
    createLog
}