
const tokenServices = require("../services/token.service");
const Pdf = require("pdfkit-table"); // P big elphabets
const fs = require("fs")
const crypto = require("crypto");// default function in nodejs



// creat pdf
const pdf = async (request, response) => {
    const token = await tokenServices.verify(request);
    const random = crypto.randomBytes(4).toString("hex");
    const pdfFile = "public/exports/" + random + ".pdf"
    const comingData = request.body
    const pdfData = JSON.parse(comingData.data);
    const company = token.data.companyInfo;

    if (token.isVerified) {
        const doc = new Pdf({
            margin: 30,
            page: "A4"
        })

        doc.pipe(fs.createWriteStream(pdfFile))
        // doc.pipe(fs.createWriteStream("public/exports/new.pdf"))
        doc.fontSize(20)
        doc.text(company.company, {
            align: "center"
        })
        doc.moveDown(2)
        const table = {
            title: "Students Report",
            headers: [
                {
                    label: "Name",
                    property: "name"
                },
                {
                    label: "Email",
                    property: "email"
                },
                {
                    label: "Mobile",
                    property: "mobile"
                },
                {
                    label: "Address",
                    property: "address"
                },
                {
                    label: "Joined At",
                    property: "joinedAt"
                },

            ],
            datas: []
        }
        for (let data of pdfData) {
            table.datas.push({
                name: data.studentName,
                email: data.studentEmail,
                father: data.studenFather,
                mobile: data.studentMobile,
                address: data.studentAddress,
                joinedAt: data.createdAt

            })
        }
        doc.table(table)
        doc.end()

        response.status(200)
        response.json({
            message: "success",
            filename: random + ".pdf"
        })
    } else {
        response.status(401)
        response.json({
            message: "permission denied"
        })
    }
}

// delete pdf
const deletePdf = async (request, response) => {
    const token = await tokenServices.verify(request);
    if (token.isVerified) {
        let filename = "public/exports/" + request.params.filename
        fs.unlinkSync(filename)
        response.status(200)
        response.json({
            message: `${request.params.filename} Delete Success`
        })
    } else {
        response.status(401)
        response.json({
            message: "permission denied"
        })
    }

}

module.exports = {
    pdf: pdf,
    deletePdf: deletePdf
}