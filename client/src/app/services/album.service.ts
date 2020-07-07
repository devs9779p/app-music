
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';                
import { Observable } from 'rxjs/Observable';    
import { GLOBAL } from './global';
import { Album } from 'app/models/album-model';


// +++++++++++++++++++++++++++++++++++++++++++++ SERVICIO DE ALBUM ++++++++++++++++++++++++++++++++++++++++++++
@Injectable()

export class AlbumService{
    public url: string;
                 
    constructor(private _http: Http){           
        this.url = GLOBAL.url;                  
    }

    // ++++++++++++++++++++++++++++++++++++ LISTAR ALBUMS ++++++++++++++++++++++++++++++++++++++++++++++++++
    getAlbums(token, artistId = null){  
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});

        if (artistId == null) {
            return this._http.get(this.url + 'albums/', options).map(res => res.json());
        } else {
            return this._http.get(this.url + 'albums/' + artistId, options).map(res => res.json());
        }
        
    }

    // +++++++++++++++++++++++++++++++++++++ SOLICITAR ALBUM +++++++++++++++++++++++++++++++++++++++++++++++
    getAlbum(token, id: string){
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});

        return this._http.get(this.url + 'album/' + id, options).map(res => res.json());
    }

    // ++++++++++++++++++++++++++++++++++++++ AÑADIR ALBUM +++++++++++++++++++++++++++++++++++++++++++++++++
    addAlbum(token, album: Album){       
        let params = JSON.stringify(album);
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });
                                                                        
        return this._http.post(this.url + 'register-album', params, {headers: headers}).map(res => res.json());
    }

    // ++++++++++++++++++++++++++++++++++++ EDITAR ALBUM ++++++++++++++++++++++++++++++++++++++++++++++++++
    editAlbum(token, id: string, album: Album){       
        let params = JSON.stringify(album);
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });
                                                                        
        return this._http.put(this.url + 'update-album/' + id, params, {headers: headers}).map(res => res.json());
    }

    // +++++++++++++++++++++++++++++++++++++ BORRAR ALBUM +++++++++++++++++++++++++++++++++++++++++++++++
    deleteAlbum(token, id: string){
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});

        return this._http.delete(this.url + 'delete-album/' + id, options).map(res => res.json());
    }
   

}