import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { common } from './../../../model/common';
import { Setting } from '../../../model/setting'; // singleton setting model
import * as jstz from 'jstz';
const timezone = jstz.determine();

const httpOptions = {
  headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'timezone': timezone.name() })
};

@Injectable()
export class ApiService {
  settingSingleton: Setting;
  constructor(private http: HttpClient, private tokenExtractor: HttpXsrfTokenExtractor) { }

  public get authHeader(): string {
    return `JWT ${localStorage.getItem('exp_token')}`;
  }

  setHeaders() {
    if (this.decodejwts()) {
      return {
        headers: new HttpHeaders().set('Authorization', this.authHeader)
        .set('Content-Type', 'application/json')
  
      };
    } else {
      return {};
    }
  }
  getRequest(url: string) {
    var character;
    let headerAbc = new HttpHeaders({'timezone':timezone.name()});
    const options = {};
    options['observe'] = 'response';
    if (this.decodejwts()) {
      options['headers'] = new HttpHeaders().set('Authorization', this.authHeader);
    }
    character = '?';
    if (url.indexOf('?') > -1) {
      character = '&';
    }
    
    return this.http.get(url+character+'timezone='+encodeURI(timezone.name()), options).map(data => {
      return data;
    });
  }
  postRequest(url: string, params: any) {
    return this.http.post(url, params, this.setHeaders()).map(data => {
      return data;
    });
  }
  putRequest(url: string, params: any) {
    return this.http.put(url, params, this.setHeaders()).map(data => {
      return data;
    });
  }
  deleteRequest(url: string, params: any) {
    const options = {};
    options['body'] = params;
    options['observe'] = 'response';
    if (this.decodejwts()) {
      options['headers'] = new HttpHeaders().set('Authorization', this.authHeader);
    }
    return this.http.delete(url, options).map(data => {
      return data;
    });
  }
  decodejwts() {
    const signedToken = localStorage.getItem('workplus_token');
    if (signedToken != null) {
      const base64Url = signedToken.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(atob(base64));
    } else {
      return false;
    }
  }
  /**@function downloadFile
   * @description function using to download file from given url
   */
  downloadFile(url) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    // headers = headers.set('Authorization', this.authHeader);
    // headers = headers.set('Access-Control-Allow-Origin', '*');
    return this.http.get(url, {headers: headers, responseType: 'blob'}).map(data => {
      return data;
    });
  }

  // singleton - Start
  init(url: string, params: any) {
    if (this.settingSingleton) {
      return Observable.of(this.settingSingleton);
    } else {
      return this.http.post(url, params)
        .map(response => this.extractData(response));
    }
  }
  extractData(response) {
    return this.settingSingleton = response;
  }
  arrayToComma(content: any) {
    return Array.prototype.map.call(content, s => s.display).toString();
  }

  uploadFile(url: string,file) {
    const httpOptionFile = {
      headers: new HttpHeaders().set('Authorization', this.authHeader)
    };
    return this.http.post(url, file, httpOptionFile).map(data => {
      return data;
    });
  }
  // singleton - End

}
