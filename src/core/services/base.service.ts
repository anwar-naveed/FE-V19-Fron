import { INJECTOR, Injectable, Injector, inject, /*ReflectiveInjector*/ } from '@angular/core';
import { HttpHelper } from '../helper/http.helper';
import { DtoResult } from '../entities/dto-result';
import { LocalStorage } from '../helper/local.storage';
import { GlobalConfig } from '../helper/global.config';
import { HttpHeaders } from '@angular/common/http';
import { AppInjector } from "./app.injector.service";

@Injectable({
    providedIn: 'root'
  })

export abstract class BaseService<T extends any> {
    protected static headers: {[key: string]: string} = {};
    public httpHelper: HttpHelper;
    public localStorage: LocalStorage;
    customController = false;
    constructor(private controller: string) {
        // this.httpHelper = GlobalConfig.injector.get(HttpHelper);
        // this.localStorage = GlobalConfig.injector.get(LocalStorage);
        // const injector = AppInjector.getInjector();
        // const injector = inject(INJECTOR);
        this.httpHelper = inject(HttpHelper);
        this.localStorage = inject(LocalStorage);
        const token = this.localStorage.Get('token');
        // console.log(`Token From Storage: ${token}`);
        // BaseService.headers['Content-Type'] = 'application/json; charset=utf-8';
        BaseService.headers['Content-Type'] = 'application/json';
        // BaseService.headers['IsTP'] = 'true';
        BaseService.headers['Access-Control-Allow-Origin'] = '*';
        if (token && (token ?? false)) {
            BaseService.headers['Authorization'] = 'bearer ' + token;
        }
        // if (token && token !== "") {
        // }
    }

    //Start: Methods to Add and Remove Header key value.
    public static AddInHeader(key: string, value: string) {
        BaseService.headers[key] = value;
    }

    public static RemoveFromHeader(key: string) {
        delete BaseService.headers[key];
    }
    //End: Methods to Add and Remove Header key value.

    public static ClearToken() {
        // if (BaseService.headers['Authorization'] !== '') {
        //     BaseService.headers['Authorization'] = '';
            // localStorage.setItem('Authorization', '');
            localStorage.removeItem('Authorization');
            localStorage.removeItem('token');
        // }
    }

    public static UpdateToken(token: string) {
        BaseService.headers['Authorization'] = 'bearer ' + token;
        localStorage.setItem('Authorization', token);
        localStorage.setItem('token', token);
    }

    async Get(key: any) {
        // const dto = await this.get('/' + key);
        const dto = await this.get(key);
        return dto;
    }

    async GetAll() {
        const dto = await this.get();
        return dto;
    }

    async GetByPrimaryKey(id: any): Promise<DtoResult<T>> {
        const dto = await this.get('getbyprimarykey/'.concat(id));
        return dto;
    } 

    async Save(data: any, primaryKey?: number, headerValue?: any): Promise<DtoResult<any>> {
        let result;
        //Remove left right space from values.
        if (data) {
            const key = Object.keys(data);
            key.forEach(key => {
                if (typeof (data[key]) === 'number' || typeof (data[key]) === 'string') {
                    data[key] = (data[key] + "").trim();
                }
            });
            data = await this.beforeSave(data, primaryKey);
        }
        if (primaryKey) {
            result = await this.put('/'.concat('' + primaryKey), data, undefined, headerValue);
        }
        else {
            result = await this.post('', data, undefined, headerValue);
        }

        return result;
    }

    async Delete(id: any){
        const dto = await this.del('delete/' + id);
        return dto;
    }

    //Http method
    async get(method?: string, params?: any[], headers?: any): Promise<DtoResult<T>> {
        return await this.httpHelper.Get<DtoResult<T>>((await this.getUrl(method, params)), this.mergeHeaders(BaseService.headers, headers));
    }

    async post(method?: string, body? : T, params?: any[], headers?: any): Promise<DtoResult<T>> {
        return await this.httpHelper.Post<DtoResult<T>>((await this.getUrl(method, params)), this.mergeHeaders(BaseService.headers, headers), body);
    }

    async put(method?: string, body? : T, params?: any[], headers?: any): Promise<DtoResult<T>> {
        return await this.httpHelper.Put<DtoResult<T>>((await this.getUrl(method, params)), this.mergeHeaders(BaseService.headers, headers), body);
    }

    async del(method?: string, body? : DtoResult<T>, params?: any[], headers?: any): Promise<DtoResult<T>> {
        return await this.httpHelper.Delete<DtoResult<T>>((await this.getUrl(method, params)), this.mergeHeaders(BaseService.headers, headers), body);
    }

    async postFile(formData: FormData, method?: string, params?: any[], headers?: any): Promise<DtoResult<T>> {
        return await this.httpHelper.PostWithFile<DtoResult<T>>((await this.getUrl(method, params)), formData, this.mergeHeaders(BaseService.headers, headers));
    }

    async getFile(method?: string, params?: any[]): Promise<DtoResult<T>> {
        const getHeaders: {[key: string]: string} = {};
        getHeaders['Content-type'] = 'application/octet-stream';
        return await this.httpHelper.GetFile<DtoResult<T>>((await this.getUrl(method, params)), getHeaders);
    }

    public async getUrl(method?: string, parameters?: { name: string, value: any}[]): Promise<string> {
        
        let result = '/api/'.concat(this.controller).concat('/').concat(method || '');
        if (this.customController) {
            result = '/api/'.concat(method || '');
        }
        //Checking that empty parameters are not added.
        if (parameters && Array.isArray(parameters)) {
            result = result.concat(parameters.reduce((prev, cur) => {
                return (cur.value != null && cur.value !== "") ? prev.concat(cur.name.concat('=').concat(encodeURIComponent(cur.value)).concat('&')) : prev.concat("");
            }, '?'));
            if (result.lastIndexOf('&') === (result.length - 1)) {
                result = result.substring(0, result.lastIndexOf('&'));
            }
        }
        return result;
    }

    public getHeaders(headers: {}) {
        return this.httpHelper.GetHeaders(headers);
    }

    private mergeHeaders(headers: {[key: string]: string}, otherHeaders: {[key: string]: string}) {
        if (otherHeaders) {
            let copyHeader = JSON.parse(JSON.stringify(headers));
            const key = Object.keys(otherHeaders);
            key.forEach(x => copyHeader[x] = otherHeaders[x]);
            return copyHeader;
        }

        return headers
    }

    async SetConfigUrl() {
        const data = await this.httpHelper.Get<any>('assets/configs/app-settings.json');
        GlobalConfig.urls.api = data.apiUrl;
        GlobalConfig.urls.lastLoadedDate = new Date();
        GlobalConfig.themeColor = data.themeColor; 
    }

    async beforeSave(data: any, primaryKey: any) {
        //Do nothing override to use.
        return data;
    }

    public navigate(route: [string]){
        this.httpHelper.Navigate(route);
    }
}