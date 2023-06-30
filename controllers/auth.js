const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser =async(req,res = express.response ) => {

    const {email, password} = req.body;

    try {
        let user = await User.findOne({ email: email});

        if( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'User exists with this email'
            })
        }

        user = new User(req.body);

        //encrypt password one hash "una sola via"
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        
        await user.save();

        //Generate JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'error, call the administrator',
        })
    }
} 


const loginUser = async(req, res = express.response) => {
    
    const {email, password} = req.body;
    try {

        const  user = await User.findOne({ email: email});

        if( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'User doesn`t exist with this email'
            })
        }

        //confirm passwords
        const validatePassword = bcrypt.compareSync(password, user.password);
        
        if( !validatePassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'incorrect password'
            })
        }

        //Generate JWT , Json Web Token
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'error, call the administrator',
        })
    }
}
const revalidToken = async(req, res = express.response) => {

    const uid = req.uid;
    const name = req.name;

    try {
        //generate un new jwt and return and the request 
        const token = await generateJWT(uid, name);

        res.json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'error, call the administrator',
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    revalidToken
}