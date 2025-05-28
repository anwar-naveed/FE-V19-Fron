import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject,Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
// import { GlobalConfig } from "src/core/helper/global.config";
import {
    APP_CA_CERTIFICATE,
    APP_CERTIFICATE,
    APP_KEY,
    APP_API_HOSTNAME,
    APP_API_PORT,
    APP_INTER_CA_CERTIFICATE,
 } from '../services/app-tokens.service';
import * as serverHttps from 'https';
import { RequestOptions } from 'https';

@Injectable({
    providedIn: 'root'
})

export class HttpHelper {

    private clientCert;
    private clientKey;
    private clientCA;
    private clientInterCA;
    private apiHostName;
    private apiHostPort;

    constructor(@Inject(PLATFORM_ID) private platformId, private http: HttpClient, private route: Router, private shared: SharedService, private injector: Injector) {
        if (isPlatformServer(this.platformId)){
            // this.clientCert = GlobalConfig.injector.get(APP_CERTIFICATE).toString();
            // this.clientKey = GlobalConfig.injector.get(APP_KEY).toString();
            // this.clientCA = GlobalConfig.injector.get(APP_CA_CERTIFICATE).toString();
            // this.apiHostName = GlobalConfig.injector.get(APP_API_HOSTNAME).toString();
            // this.apiHostPort = GlobalConfig.injector.get(APP_API_PORT).toString();
            this.clientCert = this.injector.get(APP_CERTIFICATE).toString();
            this.clientKey = this.injector.get(APP_KEY).toString();
            this.clientCA = this.injector.get(APP_CA_CERTIFICATE).toString();
            this.clientInterCA = this.injector.get(APP_INTER_CA_CERTIFICATE).toString();
            this.apiHostName = this.injector.get(APP_API_HOSTNAME).toString();
            this.apiHostPort = this.injector.get(APP_API_PORT).toString();
        }
    }

    private async ServerRequest(
        connectionKeepAlive: boolean,
        connectionKeepAliveTimeMsecs: number,
        agentKeepAlive: number,
        freeSocketsTimeOut: number,
        requestPath: string,
        requestMethod: string,
        requestHeaders: any,
        requestBody?: any,
        requestParams?: any) {
            try {
                // console.log('Request path:', requestPath); //shutdown later or create a log file node has option
                // console.log('Request method:', requestMethod); //shutdown later or create a log file node has option
                let bodyString;
                if (requestBody && (requestBody ?? false)) {
                    bodyString = Buffer.from(JSON.stringify(requestBody, (key, value) =>
                        typeof value === "bigint" ? value.toString() : value,
                      ), 'utf-8').toString();
                }
                // console.log('After request body string creation'); //shutdown later or create a log file node has option

                // const serverHttps = require('https');
                const requestOptions: RequestOptions = {
                    // serverHttps.RequestOptions = {
                    agent: new serverHttps.Agent({
                        cert: this.clientCert,
                        key: this.clientKey,
                        maxSockets: 100,
                        keepAlive: connectionKeepAlive,
                        maxFreeSockets: 10,
                        keepAliveMsecs: connectionKeepAliveTimeMsecs,
                        timeout: agentKeepAlive,      // <-- this is for the agentkeepalive
                        // freeSocketTimeout: freeSocketsTimeOut,
                    }),
                    ca: [
                      this.clientCA,
                      this.clientInterCA
                      ],
                    // ca: this.clientCA,
                    host: this.apiHostName,
                    port: this.apiHostPort,
                    path: requestPath,
                    method: requestMethod,
                    // headers: requestHeaders,
                    // param: requestParams
                }
                // console.log('Request is starting for:', requestPath); //shutdown later or create a log file node has option
                // console.log('Request body:', bodyString); //shutdown later or create a log file node has option
                return new Promise((resolve, reject) => {
                    const request = serverHttps.request(requestOptions, (res) => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            // console.log('statusCode:', res.statusCode); //shutdown later or create a log file node has option
                            // console.log('response headers:', res.headers); //shutdown later or create a log file node has option
                            return reject(new Error(`Http status code: ${res.statusCode} for ${requestPath}`));
                        }
                        // console.log('statusCode:', res.statusCode); //shutdown later or create a log file node has option
                        // console.log('response headers:', res.headers); //shutdown later or create a log file node has option
                        let response = ''
                        res.on('data', (chunk) => {
                            response += chunk
                            // process.stdout.write(chunk);
                        });
                        res.on('end', ()=>{
                            // console.log(`Result: ${response}`)
                            // process.stdout.write(`Result: \n${response}\n`)
                            if (!res.complete) 
                            process.stdout.write(
                                'The connection was terminated while the message was still being sent');
                            // console.error(
                            // 'The connection was terminated while the message was still being sent');
                            let reqResponse = {
                                body: JSON.parse(response, (key, value) => typeof value === "string" ? value.toString() : value),
                                ok: true,
                                status: res.statusCode
                            }
                            
                            if (res.statusCode == 200) {
                                reqResponse.ok = true;
                            }
                            else {
                                reqResponse.ok = false;
                            }
                            //Later do add errors also
                            resolve(this.handleResponse(reqResponse));
                        });
                    });

                    request.on('timeout', () => {
                        //console.log(`Request time out for ${requestPath}`)
                        request.destroy();
                        reject(new Error(`Request time out for ${requestPath}`));
                    });

                    request.on('error', (err) => {
                        console.log(`Error: ${err}`)
                        reject(err);
                    });

                    Array.from(requestHeaders.entries()).forEach(o => {
                        request.setHeader(o[0], o[1]);
                    })

                    if (bodyString && (bodyString ?? false)) {
                        request.write(bodyString);
                    }

                    // console.log('Request is ending for:', requestPath); //shutdown later or create a log file node has option
                    request.end();
                });
            }
            catch (e) {
                console.log((e as Error).message);
                // Return a rejected promise to ensure that all code paths return a value.
                return Promise.reject(new Error("An error occurred while processing the request."));
            }
        }

    private async Request(url: string, method: string, headers?: any, body?: any): Promise<any> {
        const options: any = <any>{};
        if (body) {
            options.body = JSON.stringify(body, (key, value) =>
                typeof value === "bigint" ? value.toString() : value,
              );
        }

        if (method) {
            options.method = method;
        }

        if (headers) {
            options.headers = headers;
        }

        options.observe = "response";

        if (isPlatformServer(this.platformId) && url.startsWith("/api")) {
            const newHeader = new Map();
            headers.keys().forEach(key => {
                newHeader.set(key, headers.get(key));
            });
            if (body && (body ?? false)) {
                //headers.append('Content-Length', (Buffer.byteLength(JSON.stringify(body))).toString())
                newHeader.set('Content-Length', Buffer.byteLength(JSON.stringify(body, (key, value) =>
                    typeof value === "bigint" ? value.toString() : value,
                  )));
                newHeader.set('Accept', 'application/json, text/plain, */*');
                newHeader.set('Accept-Encoding', 'gzip, deflate, br');
                newHeader.set('Accept-Charset', 'UTF-8');
            }
            // let headString = JSON.stringify(Object.fromEntries(newHeader.entries())), (key, value) =>
            // typeof value === "string" ? utf8.encode(value) : value)

            let headString = Buffer.from(JSON.stringify(Object.fromEntries(newHeader.entries())), 'utf-8').toString();

            // console.log("request headers: ", headString);
            return await this.ServerRequest(
                true,
                10000,
                60000,
                12000,
                url,
                method,
                // headString,
                newHeader,
                body)
        } else {
            return await new Promise<any>((resolve, reject) =>
            this.http.request(method, url, options)
            .subscribe({
                next: (response) => {
                    // console.log(response);
                    resolve(this.handleResponse(response));
            },
            error: (error) => {
                // console.log(error);
                resolve(this.handleResponse(error));
            },
            complete: () => {
            console.log('Request complete');
            }
            }));
        }
    }

    private async RequestFile(url: string, formData: FormData, headers?: any): Promise<any> {
        return await new Promise<any>((resolve, reject) =>
        this.http.post(url, formData, { headers })
        .subscribe({
            next: (response) => {
                resolve(this.handleResponse(response));
        },
        error: (error) => {
            resolve(this.handleResponse(error));
        },
        complete: () => {
          console.log('Request complete');
        }
      }));
    }

    async Get<T>(url: string, headers?: any): Promise<any>{
        return await this.Request(url, 'Get', this.GetHeaders(headers));
    }

    async Post<T>(url: string, headers?: any, body?: any): Promise<any>{
        return await this.Request(url, 'Post',  this.GetHeaders(headers), body);
    }

    async Put<T>(url: string, headers?: any, body?: any): Promise<any>{
        return await this.Request(url, 'Put', this.GetHeaders(headers), body);
    }

    async Delete<T>(url: string, headers?: any, body?: any): Promise<any>{
        return await this.Request(url, 'Delete', this.GetHeaders(headers), body);
    }

    async PostWithFile<T>(url: string, formData: FormData, headers?: any, noDefAuth?: any): Promise<T> {
        return await new Promise<any>((resolve, reject) => {
            const xml = new XMLHttpRequest();
            xml.open('POST', url, true);
            const token = localStorage.getItem('token');
            if (!noDefAuth) {
                xml.setRequestHeader('Authorization', 'bearer ' + token);
            }
            const that = this;
            xml.onload = function () {
                resolve(that.handleJsonResponse(xml))
            }
            xml.onerror = function () {
                resolve(that.handleJsonResponse(xml))
            }
            xml.send(formData);
        })
    }

    async GetFile<Blob>(url: string, headers?: any): Promise<Blob> {
        return await new Promise<any>((resolve, reject) => {
            this.http.get(url, { headers: this.GetHeaders(headers), responseType: "arraybuffer"})
        //Old way having subscribe deprecated error but should be working
        // .subscribe(response => {
        //     resolve(this.handleFileResponse(response));
        // }, error => {
        //     resolve(this.handleResponse(error));
        // }));


        .subscribe({
            next: (response) => {
                resolve(this.handleFileResponse(response));
        },
        error: (error) => {
            resolve(this.handleResponse(error));
        },
        complete: () => {
          console.log('Request complete');
        }
        })
        });
    }

    private handleResponse(fullResponse: any): any {
        const response = fullResponse.body;
        type ResponseObject = {
            Data: string | null,
            IsSuccessful: boolean,
            Errors: string | null,
            StatusCode: undefined | number,
            Headers: HttpHeaders
        }
        // console.log(`Response Data: \n${response}\n`);
        //Old way
        // const respObj = {
        //     Data: null,
        //     IsSuccessful: false,
        //     Errors: null,
        //     StatusCode: undefined,
        //     Headers: fullResponse.headers
        // }

        const respObj = {} as ResponseObject;

        if (!fullResponse.ok) {
        // if (fullResponse.status != 200 ) {
            respObj.Errors = fullResponse.error ? fullResponse.error.errors : fullResponse.error;
            respObj.IsSuccessful = false;
            respObj.StatusCode = fullResponse.status;
            if (fullResponse.status === 401 && this.route.url.indexOf('login') < 0) {
                this.shared.setApiResponse(fullResponse);
                throw new Error("Un Auhorized");
            }
            else if (fullResponse.status === 403) {
                respObj.Errors = "You have no rights for this action.";
            }
            else if (fullResponse.error && fullResponse.error.errors) {
                if (respObj.Errors == "Session Expired" ) {
                    throw new Error("Session Expired");
                }
                respObj.Errors = fullResponse.error.errors;
            }
            else if (respObj.StatusCode === 504)  {
                respObj.Errors = "Connection Error.";
            }
        }
        else {
            respObj.IsSuccessful = true;
            respObj.StatusCode = 200;
            respObj.Data = response;
        }

        return respObj;
    }

    private handleFileResponse(response: ArrayBuffer) {

        const respObj = {
            Data: response,
            IsSuccessful: true,
            Errors: null,
            StatusCode: 200,
        }

        return respObj;
    }

    private handleJsonResponse(xhr: XMLHttpRequest) {

        type ResponseObject = {
            Data: string | null,
            IsSuccessful: boolean,
            Errors: string | null,
            StatusCode: undefined | number,
            Headers: HttpHeaders
        }
        const respObj = {} as ResponseObject;
        if (xhr.status === 200) {
            let jsonResponse = null;
            if (typeof (xhr.response) === "string") {
                jsonResponse = JSON.parse(xhr.response);
            }
            respObj.IsSuccessful = true;
            respObj.StatusCode = 200;
            respObj.Data = jsonResponse;
        }
        else if (xhr.status === 500) {
            respObj.IsSuccessful = false;
            respObj.StatusCode = xhr.status;
            respObj.Data = "Server Error";
        }
        else {
            respObj.IsSuccessful = false;
            respObj.StatusCode = xhr.status;
            respObj.Data = xhr.responseText;
        }
        return respObj;
    }

    public GetHeaders(headers: {[key: string]: string} | null | undefined) {
        let result: HttpHeaders = new HttpHeaders();

        if (headers) {
            const keys = Object.keys(headers);
            keys.forEach(x => {
                if (headers[x] !== null) {
                    result = result.set(x, headers[x]);
                }
            });
        }

        return result;
    }

    public Navigate(route: [string]){
        this.route.navigate(route);
    }
}
