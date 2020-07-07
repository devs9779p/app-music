'use strict'

const path = require('path');
const fs = require('fs');
const mongoosePagination = require('mongoose-pagination');
const Artist = require('../models/artist-model');
const Album = require('../models/album-model');
const Song = require('../models/song-model');


const saveArtist = (req, res) => {
    try {
        const artist = new Artist();

        const params = req.body;
        artist.name = params.name;
        artist.description = params.description;
        artist.image = 'null';
    
        artist.save((err, artistStored) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
            }else{
                if(!artistStored){
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - ARTIST NOT SAVED' });
                }else{
                    res.status(200).send({ artist: artistStored });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const getArtist = (req, res) => {
    try {
        const artistId = req.params.id;

        Artist.findById(artistId, (err, artist) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
            }else{
                if(!artist){
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - ARTIST DOES NOT EXIST' });
                }else{
                    res.status(200).send({ artist });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const getArtists = (req, res) => {
    try {

        if(req.params.page){
            var page = req.params.page;
        }else{
            var page = 1;
        }
        
        const itemsPerPage = 3;
    
        Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total_items) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
            }else{
                if(!artists){
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - NOT ARTISTS' });
                }else{
                    return res.status(200).send({
                        total_items: total_items,
                        artists: artists
                    });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
}; 

const updateArtist = (req, res) => {
    try {
        const artistId = req.params.id;
        const update = req.body;
    
        Artist.findByIdAndUpdate(artistId, update, (err, artistUpdate) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
            }else{
                if(!artistUpdate){
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - UPDATING ARTIST' });
                }else{
                    res.status(200).send({ artist: artistUpdate });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const deleteArtist =  (req, res) => {
    try {
        const artistId = req.params.id;

        Artist.findByIdAndRemove(artistId, (err, artistRemove) => {
            if(err){
                res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR' });
            }else{
                if(!artistRemove){
                    res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - ARTIST NOT REMOVED'});
                }else{
                    Album.find({ artist: artistRemove._id }).remove((err, albumRemove) => {
                        if(err){
                            res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR - DELETING ALBUM' });
                        }else{
                            if(!albumRemove){
                                res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - ALBUM NOT REMOVED'});
                            }else{  
                                Song.find({ album: albumRemove._id }).remove((err, songRemove) => {
                                    if(err){
                                        res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR - DELETING SONG' });
                                    }else{
                                        if(!songRemove){
                                            res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - SONG NOT REMOVED'});
                                        }else{
                                            res.status(200).send({ artist: artistRemove });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message});
    }
};

const uploadImage = (req, res) => {
    try {
        const artistId = req.params.id;
        const file_name = 'Image not uploaded';  
    
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
    
                Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdate) => {
                    if(err){
                        res.status(500).send({ status: 'ERROR', message: 'INTERNAL SERVER ERROR - ARTIST NOT UPDATED' });
                    }else{
                        if(!artistUpdate){
                            res.status(404).send({ status: 'ERROR', message: 'BAD REQUEST - NOT ARTIST UPDATED ' });
                        }else{
                            res.status(200).send({ 
                                image: file_name, 
                                artist: artistUpdate 
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
        const path_file = './uploads/artists/' + imageFile;
    
        fs.exists(path_file, (exists) => {
            if(exists){
                res.sendFile(path.resolve(path_file));
            }else{
                res.status(200).send({ message: 'THERE IS NOT IMAGE' });
            }
        });
    } catch (e) {
        res.status(404).send({ message: 'BAD REQUEST - ERROR ACCESSING THE IMAGE' });
    }
};


module.exports = { 
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};
