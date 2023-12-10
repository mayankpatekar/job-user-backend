const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("pass")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.pass, salt);
        this.pass = hashedPassword; // Store the hashed password in the correct field
        return next();
    } catch (error) {
        return next(error);
    }
});


userSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.pass);
};

userSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, "abc", {
        // expiresIn: process.env.JWT_EXPIRE,
        expiresIn: "2147483647",
    });
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetToken;
};





const jobSchema = new mongoose.Schema({
    Title: String,
    CompanyDetails: String,
    Tags: [{
        tag: String,
    }],
    Skills: [{
        skill: String,
    }],
    ExperienceRequired: Boolean,
    Description: String,
    Salary: Number,
    Categorie: String,
    Type: String,
});

const applicationSchema = new mongoose.Schema({
    UserId:String,
    JobId:String,
    Name:String,
    Status:String,
    Resume:String
})
const Job = mongoose.model('job', jobSchema);
const User = mongoose.model('user',userSchema);
const Application = mongoose.model('application',applicationSchema);


module.exports ={
    Job,User,Application
}