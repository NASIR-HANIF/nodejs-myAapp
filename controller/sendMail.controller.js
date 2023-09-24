require("dotenv").config()
// pug ko call karna hey ta keh pug ke ander se render function call ker saken
const pug = require("pug");
const tokenService = require("../services/token.service")
const AWS = require("aws-sdk");
// install npm i aws-sdk

const config = {
    accessKeyId: "AKIATOUN3Z5IVN6LZQ5G",
    secretAccessKey: "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",
    region: "ap-southeast-1"

}

// mailer 
const mailer = new AWS.SES(config);

const sendEmail = async (request, response) => {
    const tokenData = await tokenService.verify(request);
    if (tokenData.isVerified) {
        const data = JSON.parse(request.body.reciept);
       
        // start mail information
        const emailInfo = {
            Destination: {
                ToAddresses: [
                    data.to,
                ]
            },
            Message: {
                Subject: {
                    Charset: "UTF-8",
                    Data: data.subject
                },
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: pug.renderFile("C:/Users/rehman/Downloads/nodejs-myAapp/views/email-template.pug",data )            //data.message {  link: data.message }
                    }
                }
            },
            Source: "nasir127sb@gmail.com"
        }
        try {
            await mailer.sendEmail(emailInfo).promise();
            response.status(200);
            response.json({
                message: "Sending Success"
            })
        } catch (error) {
            response.status(424);
            response.json({
                message: "Sending Failed"
            })
        }

    } else {
        response.status(401);
        response.json({
            message: "Permission Denied !"
        })
    }
}

module.exports = {
    sendEmail: sendEmail
}