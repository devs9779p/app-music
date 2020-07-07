'use strict'

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');
const jwt = require('../service/jwt');
//const jwt = require('jsonwebtoken');

const expiresIn = 60 * 30;


const loginUser = (req, res) => {
    try {
        const params = req.body;

        const email = params.email;
        const password = params.password;
    
        User.findOne({ email: email.toLowerCase()}, (err, user) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
            }else{
                if(!user){
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - USER NOT FOUND'});
                }else{
                    bcrypt.compare(password, user.password, (err, check) => {     
                        if(check){
                            if(params.gethash){
                                console.log(user);
                                res.status(200).send({ token: jwt.createToken(user) });
                            }else{
                                res.status(200).send({ user });
                            }
                        }else{
                            res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - LOGIN FAILED'});
                        }
                    });
                }
            }
        });    
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const saveUser = async (req, res) => {
    try {
        const user = new User();
        const params = req.body;

        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.image = params.image;
        user.role = 'ROLE_USER';
        
        if(params.password){
            const hash = await bcrypt.hash(params.password, 15)
            user.password = hash;

            if(params.name && params.surname && params.email){
                if(user.name != null && user.surname != null && user.email != null){
                    await user.save((err, userStored) => {
                        if(err){
                            if(err.code && err.code === 11000){
                                console.log(err);
                                res.status(400).send({ status: 'DUPLICATE VALUES', message: err.keyValue });
                            }
                        }else{
                            if(!userStored){
                                res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - USER HAS NOT REGISTERED' });
                            }else{
                                console.log(userStored);
                                res.status(200).send({ user: userStored });
                            }
                        }
                    });
                }else{
                    res.status(200).send({ status: 'ERROR', message: 'INCOMPLETE DATA PARAMS' });
                } 
            }else{
                res.status(200).send({ status: 'ERROR', message: 'INCOMPLETE DATA' });
            }
            
        }else{
            res.status(500).send({ status: 'ERROR',  message: 'ENTER A PASSWORD' });
        }
    } catch (error) {
        console.log('Error create user', error);
        res.status(500).send({ status: 'ERROR', message: error.message });
    }
};

const updateUser = (req, res) => {
    try {
        const userId = req.params.id;  
        const update = req.body;

        if(userId != req.user.sub){
           return res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR - ACCESS DENIED INVALID TOKEN TO UPDATE USER' });
        }
    
        User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR - ERROR USER UPDATED' });
            }else{
                if(!userUpdate){
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - NOT USER UPDATED' });
                }else{
                    res.status(200).send({ user: userUpdate });
                }
            }
        });
    } catch (error) {
        if(error.code && error.code === 11000){
            res.status(400).send({ status: 'DUPLICATED VALUES', message: error.keyValue });
            return;
        }
        res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR - ERROR USER UPDATE' });
    }
};

const uploadImage = (req, res) => {
    try {
        const userId = req.params.id;
        const file_name = 'Imagen No subida';  
    
        if(req.files){                           
            const file_path = req.files.image.path;  
            console.log('El path del archivo es: ', file_path);
    
            const file_split = file_path.split('\\');
            const file_name = file_split[2];
            console.log(file_name);
    
            const ext_split = file_name.split('\.');
            const file_ext = ext_split[1];
            console.log(file_ext);
    
            if(file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif'){
    
                User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                    if(err){
                        res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR - USER UPDATED' });
                    }else{
                        if(!userUpdated){
                            res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - NOT USER UPDATED' });
                        }else{
                            res.status(200).send({ 
                                image: file_name, 
                                user: userUpdated 
                            });
                        }
                    }
                });
    
            }else{
                res.status(200).send({ message: 'INVALID FILE EXTENSION, ONLY SUPPORTED PNG, JPG and GIF' });
            }
        }else{
            res.status(200).send({ message: 'YOU HAVE NOT UPLOAD ANY IMAGE' });
        }
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR - UPLOADING IMAGE' });
        console.log('Error upload image: ', e.message );
    }
};

const getImageFile = (req, res) => {
    try {
        const imageFile = req.params.imageFile;
        const path_file = './uploads/users/' + imageFile;
    
        fs.exists(path_file, (exists) => {
            if(exists){
                res.sendFile(path.resolve(path_file));
            }else{
                res.status(200).send({ message: 'THERE IS NO IMAGE' });
            }
        });
    } catch (e) {
        res.status(404).send({ message: 'BAD REQUEST - ERROR ACCESSING THE IMAGE' });
    }
};


module.exports = {
    loginUser,
    saveUser,
    updateUser,
    uploadImage,
    getImageFile
};
