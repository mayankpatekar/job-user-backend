const express = require('express');
const {User} = require("../models/models");
const jwt = require('jsonwebtoken');

let protect = async (req, res, next) => {
    let token = undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("User")
    ) {
        console.log(req.headers.authorization);
        let tokenId = req.headers.authorization.split(" ");
        // console.log(token);
        // console.log(tokenId)
        token = tokenId[1];
    }

    if (!token) {
        return next(res.status(401).send({ message: "unauthorized access" }));
    }

    try {
        const decoded = jwt.verify(token, "abc");
        console.log(decoded);
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(res.status(404).send({ message: "user Not Found" }));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(res.status(401).send({ message: "not authorized" }));
    }
};


module.exports = protect