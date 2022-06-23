const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('../utils/createError');
const User = require('../models/user');
const keys = require('../config/keys');

const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            password: hash,
            name: req.body.name
        });
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (err) {
        next(err);
    }
}

const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, "User not found!"));
        const isPasswordCorrected = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrected) return next(createError(400, "Wrong password or username!"));
        const { password, isAdmin, ...other } = user._doc;
        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, keys.jwt);
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json({ ...other });
    } catch(err) {
        next(err);
    }
}

module.exports = { register, login };