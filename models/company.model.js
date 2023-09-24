const mongo = require("mongoose");
const { Schema } = mongo
const companySchema = new Schema({
    company: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    mobile: Number,
    isEmailVerified: {
        type: String,
        default: false
    },
    isLogo : {
        type: Boolean,
        default: false
    },
    logoUrl : String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// vealidation dublicate unique from company // mongoose pre define veladition
//      function key word zarori hey
companySchema.pre("save", async function (next) {
    const query = {
        company: this.company
    }
    const lenght = await mongo.model("Company").countDocuments(query);
    if (lenght > 0) {
        const cmpError = {
            label : "Company Name is already exists !",
            field : "company-name"
        }

        throw next(cmpError)
    } else {
        next();
    }
})
// email unique veledation
companySchema.pre("save", async function (next) {
    const query = {
        email: this.email
    }
    const lenght = await mongo.model("Company").countDocuments(query);
    if (lenght > 0) {
        const emailError = {
            label : "company email is already exists !",
            field : "company-email"
        }
        throw next(emailError)
    } else {
        next();
    }
})

module.exports = mongo.model("Company", companySchema)