import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';                 
import { Observable } from 'rxjs/Observable';    
import { GLOBAL } from './global';
import { Artist } from 'app/models/artist-model';


// +++++++++++++++++++++++++++++++++++++++++++++ SERVICIO DE SUBIDA ++++++++++++++++++++++++++++++++++++++++++++
@Injectable()

export class UploadService{
    public url: string;
                 
    constructor(private _http: Http){           
        this.url = GLOBAL.url;                  
    }

    // +++++++++++++++++++++++++++++++++ PETICIÓN AJAX PARA SUBIR ARCHIVOS CONVENCIONALES ++++++++++++++++++++++++++++++++++++++++++++++
    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string){

        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();   

            for(var i = 0; i < files.length; i++){   
                formData.append(name, files[i], files[i].name);
            }

            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response)); 
                    }else{
                        reject(xhr.response);
                    }

                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);     
        });

    }
    
}