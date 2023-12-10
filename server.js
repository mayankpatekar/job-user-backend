const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
dotenv.config();

const jobroute = require("./routes/Job.js");
const userroute = require("./routes/User.js");
const applicationRoute = require('./routes/Application.js');


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.urlencoded({limit: '50mb'}));
// app.use(express.json({ limit: '20mb' }));

app.use("/api/job",jobroute);
app.use("/user",userroute);
app.use('/application',applicationRoute);


const port = process.env.PORT || 5003;


mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error("Error connecting to database:", err);
});