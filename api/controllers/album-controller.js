'use strict'

const path = require('path');
const fs = require('fs');
const mongoosePagination = require('mongoose-pagination');
const Artist = require('../models/artist-model');
const Album = require('../models/album-model');
const Song = require('../models/song-model');

const saveAlbum = (req, res) => {
    try {
        const album = new Album();

        const params = req.body;
    
        album.title = params.title;
        album.description = params.description;
        album.year = params.year;
        album.image = 'null';
        album.artist = params.artist;
    
        album.save((err, albumStored) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
            }else{
                if(!albumStored){
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - ALBUM NOT SAVED' });
                }else{
                    res.status(200).send({ album: albumStored });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const getAlbum = (req, res) => {
    try {
        const albumId = req.params.id;
        Album.findById(albumId).populate({ path: 'artist'}).exec((err, album) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
            }else{
                if(!album){
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - ALBUM DOES NOT EXIST' });
                }else{
                    res.status(200).send({ album: album });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const getAlbums = (req, res) => {
    try {
        const artistId = req.params.artist;

        if(!artistId){
            var find_album = Album.find({}).sort('title'); 
        }else{
            var find_album = Album.find({ artist: artistId }).sort('year');  
        }
        find_album.populate({ path: 'artist' }).exec((err, albums) => {
            if(err){
                res.status(500).send({ status: 'ERROR',  message: 'INTERNAL SERVER ERROR' });
            }else{
                if(!albums){
                    res.status(404).send({ status: 'ERROR',  message: 'BAD REQUEST - NO ALBUMS FOUND' });
                }else{
                    res.status(200).send({ albums: albums });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR',  message: e.message });
    }
};

const updateAlbum = (req, res) => {
    try {
        const albumId = req.params.id;
        const update = req.body;
    
        Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
            if (err) {
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
            } else {
                if (!albumUpdated) {
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - ALBUM NOT UPDATED' });
                } else {
                    res.status(200).send({ album: albumUpdated });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const deleteAlbum = (req, res) => {
    try {
        const albumId = req.params.id;

        Album.findByIdAndRemove( albumId, (err, albumRemove) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
            }else{
                if(!albumRemove){
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - ALBUM NOT DELETED' });
                }else{  
                    Song.find({ album: albumRemove._id }).remove((err, songRemove) => {
                        if(err){
                            res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
                        }else{
                            if(!songRemove){
                                res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST -SONG NOT DELETED' });
                            }else{
                                res.status(200).send({ album: albumRemove });
                            }
                        }
                    });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const uploadImage = (req, res) => {
    try {
        const albumId = req.params.id;
        var file_name = 'Image not uploaded';  
    
        if(req.files){                            
            const file_path = req.files.image.path;  
            console.log('El path del archivo es: ', file_path);
    
            const file_split = file_path.split('\\');
            var file_name = file_split[2];
            console.log(file_name);
    
            const ext_split = file_name.split('\.');
            const file_ext = ext_split[1];
            console.log(file_ext);
    
            if(file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif'){
    
                Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                    if(err){
                        res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR - ALBUM NOT UPDATED' });
                    }else{
                        if(!albumUpdated){
                            res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - NOT ALBUM UPDATED' });
                        }else{
                            res.status(200).send({ 
                                image: file_name, 
                                album: albumUpdated 
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
        const path_file = './uploads/albums/' + imageFile;
    
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
    saveAlbum,
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};