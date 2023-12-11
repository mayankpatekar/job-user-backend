const express = require('express');
const { User } = require("../models/models.js");
const sendEmail = require('../middleware/sendEmail.js');
const crypto = require('crypto');

const router = express.Router();


const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).send({ message: "success", token });
};

const base_url = process.env.base_url

router.post('/register', async (req, res) => {
    const { email, pass } = req.body;
    console.log(email, pass);
    try {
        const user = await User.find({ email: email });
        console.log(user);

        if (user.length > 0) {
            res.json({ message: "User already exists..." });
        } else {
            const newUser = new User({
                email: email,
                pass: pass
            });

            // To save data to the database with error handling
            try {
                await newUser.save();
                sendToken(newUser, 201, res);
            } catch (err) {
                res.send(err);
            }
        }
    } catch (err) {
        console.log(err);
    }
});


router.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await User.findOne({ email: email }).select("+pass");
        // console.log(user)
        if (user) {
            const isMatch = await user.matchPasswords(pass);
            // console.log(isMatch)
            if (isMatch) {
                sendToken(user, 200, res);
            } else {
                res.status(401).send({ message: "invalid password" });
            }
        } else {
            res.status(401).send({ message: "Invalid Username" });
        }
    } catch (err) {
        console.log(err);
    }

})

router.post('/forgotpass',async(req,res,next)=>{
    const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log(email);
      return next(res.status(404).send({ message: "Email could not be send" }));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `${base_url}/resetpassword/${resetToken}`;
    const message = `<h1>Reset Password link</h1><p>click on the link to reset password</p><a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

    console.log(resetUrl);
    try {
      sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });
      res.status(200).send({ message: "Email Sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return next(res.status(500).send({ message: "Email could not be send" }));
    }
  } catch (err) {
    next(err);
  }
})


router.put("/resetpassword/:resetToken", async (req, res, next) => {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
      console.log(resetPasswordToken);
    try {
      const user = await User.findOne({
        resetPasswordToken:resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      console.log(user);
  
      if (!user) {
        return next(res.status(400).send({ message: "Invalid reset token" }));
      }
      user.pass = req.body.pass;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
  
      res.status(201).send({ message: "Password Reset Success" });
    } catch (err) {
      next(err);
    }
  });

module.exports = router
