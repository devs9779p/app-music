import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';                 
import { Observable } from 'rxjs/Observable';    
import { GLOBAL } from './global';


@Injectable()
// +++++++++++++++++++++++++++++++++++++++++++++ SERVICIO DE USUARIO +++++++++++++++++++++++++++++++++++++++++++++++ 
export class UserService{
    public url: string;
    public identity;
    public token;
                         
    constructor(private _http: Http){           
        this.url = GLOBAL.url;
    }

    // +++++++++++++++++++++++++++++++++++++++++++++  METODO PARA LOGUEARSE  +++++++++++++++++++++++++++++++++++++++++++++++
    signup(user_to_login, gethash = null){
        if(gethash != null){
            user_to_login.gethash = gethash; 
        }
        
        let json = JSON.stringify(user_to_login);         
        let params = json;
        let headers = new Headers({'Content-Type': 'application/json'});  

        return this._http.post(this.url + 'login', params, { headers: headers }).map(res => res.json());
    }

    // ++++++++++++++++++++++++++++++++++++++++++ METODO PARA REGISTRARSE +++++++++++++++++++++++++++++++++++++++++++++++++++
    register(user_to_register){
        let json = JSON.stringify(user_to_register);
        let params = json;

        let headers = new Headers({'Content-Type': 'application/json'});

        return this._http.post(this.url + 'register', params, { headers: headers }).map(res => res.json());
    }

    // +++++++++++++++++++++++++++++++++++++++++ METODO PARA ACTUALIZAR USUARIO +++++++++++++++++++++++++++++++++++++++++++
    updateUser(user_to_update){
        let params = JSON.stringify(user_to_update);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()  
        });

        return this._http.put(this.url + 'update-user/' + user_to_update._id, params, { headers: headers }).map(res => res.json());
    }

    // +++++++++++++++++++++++++   MÉTODOS PAR ACCEDER AL LOCALSTORAGE + CONSEGUIR ELEMENTO DESEAO + DEVOLVERLO PROCESADO  +++++++++++++++++++++++++++++++++
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');

        if (token != 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    };
}


