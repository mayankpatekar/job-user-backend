const express = require('express');
const { cloudinary, upload } = require('../middleware/cloudinary');
const {Application ,Job} = require("../models/models");
const protect = require('../middleware/protect');
const sendEmail = require('../middleware/sendEmail');

const router = express.Router();

router.post('/apply',protect, upload.single('resume'), async (req, res) => {
    const user = req.user;
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'auto' // Treat the uploaded file as raw data
      });
      const {name,jobId} = req.body;
    //   console.log(req.file);

      const application = new Application({
        UserId:user._id,
        JobId:jobId,
        Name:name,
        Status:"Applied",
        Resume:result.secure_url
      })

      await application.save();

      sendEmail({
        to: user.email,
        subject: 'application submited succesfully',
        text: '<p>Your application is submited succesfully<br/>wait for further process,check your dashboard on regular basic<br/><bold>Your regards</bold><br/><bold>abc Pvt.lmt.</bold></p>'
      })
  
      // Save the file URL or perform any other actions with the uploaded file here
      console.log('Uploaded File URL:', result.secure_url);
  
      res.status(200).send('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
    }
  });


router.get('/get',protect,async(req,res)=>{
    try{
        const user = req.user;
        const applications = await Application.find({UserId:user._id})
        .populate('JobId');;
        
        res.status(200).json({applications:applications});
    }catch(err){
      res.status(500).send('Error getting applications');
    }
})

module.exports = router