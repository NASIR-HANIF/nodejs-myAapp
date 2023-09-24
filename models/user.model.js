const mongo = require("mongoose");
const bcryptService = require("../services/bcrypt.service")
const { Schema } = mongo
const userSchema = new Schema({
    uid: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required:[true,"Password Field Is Required"]
    },
    token : String,
    expiresIn : Number,
    isLogged : Boolean,
    role : String,
    updateAt : {
        type : Date,
        default : Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});


//   function key word zarori hey
userSchema.pre("save", async function (next) {
    const data = this.password;
    const encryptesPassword = await bcryptService.encrypt(data);
    this.password = encryptesPassword;
    next()
})

module.exports = mongo.model("User", userSchema)