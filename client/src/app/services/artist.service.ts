import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';                 
import { Observable } from 'rxjs/Observable';    
import { GLOBAL } from './global';
import { Artist } from 'app/models/artist-model';


// +++++++++++++++++++++++++++++++++++++++++++++ SERVICIO DE ARTISTA ++++++++++++++++++++++++++++++++++++++++++++
@Injectable()

export class ArtistService{
    public url: string;
                 
    constructor(private _http: Http){           
        this.url = GLOBAL.url;                  
    }

    // +++++++++++++++++++++++++++++++++++++++ OBTENER TODOS LOS ARTISTAS ++++++++++++++++++++++++++++++++++++++++
    getArtists(token, page){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url + 'artists/' + page,  options).map(res => res.json());
    }

    // ++++++++++++++++++++++++++++++++++++++ OBTENER UN ARTISTA +++++++++++++++++++++++++++++++++++++++++++++++++
    getArtist(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url + 'artist/' + id,  options).map(res => res.json());
    }

    // ++++++++++++++++++++++++++++++++++++++ REGISTRAR UN ARTISTA +++++++++++++++++++++++++++++++++++++++++++++++++
    addArtist(token, artist: Artist){       
        let params = JSON.stringify(artist);
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });
        return this._http.post(this.url + 'register-artist', params, {headers: headers}).map(res => res.json());
    }

    // +++++++++++++++++++++++++++++++++++++++ ACTUALIZAR UN ARTISTA ++++++++++++++++++++++++++++++++++++++++++++++
    editArtist(token, id: string, artist: Artist){       
        let params = JSON.stringify(artist);
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });
        return this._http.put(this.url + 'update-artist/' + id, params, {headers: headers}).map(res => res.json());
    }

    // +++++++++++++++++++++++++++++++++++++++ ELIMINAR UN ARTISTA +++++++++++++++++++++++++++++++++++++++++++++++
    deleteArtist(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });
        let options = new RequestOptions({headers: headers});

        return this._http.delete(this.url + 'delete-artist/' + id,  options).map(res => res.json());
    }

}