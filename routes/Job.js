const express = require('express');
const {Job} = require('../models/models.js');

const router = express.Router();

router.get('/',async(req,res)=>{
    try{
        const jobs = await Job.find();
        res.status(200).json({jobs:jobs});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something bad in server"});
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
    const job = await Job.findById(id);
      
    // const skills = job.Skills.map(skillObj => skillObj.skill).join(', ');
    // const tags = job.Tags.map(tagObj => tagObj.tag).join(', ');

    // const salary = job.Salary.toString();

  
      
    //   const updatedJob = {
    //     ...job.toObject(),
    //     Skills: skills,
    //     Tags: tags,
    //     Salary: salary
    //   };
  
      res.status(200).json({ job: job });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something bad in server" });
    }
  });


module.exports = router
