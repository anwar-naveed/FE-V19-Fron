import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
  HttpHeaders
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  Observable,
  finalize,
  delay,
  catchError,
  retryWhen,
  take,
  throwError } from 'rxjs';
import { Router } from "@angular/router";
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { SpinnerService } from './spinner.service';
// import * as jsonFileData from "public/config/proxy.conf.json";
import * as jsonFileData from "public/config/app-settings.json";
import { Request } from 'express';
import * as fs from "fs";
// import { GlobalConfig } from "src/core/helper/global.config";
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ConfigService } from 'src/core/services/config.service';


interface UniqueRequest {
  uniqueRequestIdentifier: number;
  req: HttpRequest<any>;
}

@Injectable()
export class InterceptorService implements HttpInterceptor {
  private readonly DEFAULT_PORT = 9000;
  // private readonly PORT = process.env['PORT'] || this.DEFAULT_PORT;
  private readonly PORT = this.DEFAULT_PORT;
  private jsonData: any = jsonFileData;
  // private request: any;
  constructor(
    @Inject(PLATFORM_ID) private platformId,
    @Optional() @Inject(REQUEST) private request,
    // @Inject(REQUEST) private request: Request,
    // Injector.get(REQUEST) private request: Request,
    private service: SpinnerService,
    private router: Router,
    private configService: ConfigService 
  ) {
      // this.request = GlobalConfig.injector.get(REQUEST)
    }
  inProgressRequests: UniqueRequest[] = [];
  uniqueRequestIdentifier: number = 0;

  removeRequest(modifiedReq: UniqueRequest) {
    let areRequestsPending: boolean = false;
    let reqIndex = this.inProgressRequests.findIndex(
      (x) =>
        x.req.url === modifiedReq.req.url &&
        x.req.method === modifiedReq.req.method &&
        x.uniqueRequestIdentifier === modifiedReq.uniqueRequestIdentifier
    );
    if (reqIndex > -1) {
      this.inProgressRequests.splice(reqIndex, 1);
    }
    areRequestsPending = this.inProgressRequests.length > 0;
    this.service.toggleLoadingSpinner(areRequestsPending);
    // this.service.show();
  }

  getBaseUrl(req: HttpRequest<any> | null | undefined, api: boolean = false): string {
    // Check if 'req' is null or undefined before accessing headers
    if (!req) {
      console.warn('HttpRequest object is null or undefined');
      return '';  // Or return some default base URL if needed
    }
  
    const apiTarget = req.headers.get('x-api-target');  // Get the 'x-api-target' header
    let baseUrl = '';
    // Check if 'api' flag is true and if we have the required JSON data
    if (api && this.jsonData) {
      switch (apiTarget) {
        case 'admin':
          // baseUrl = this.jsonData['apiUrls'].admin || '';  // Fallback to empty string if undefined
          baseUrl = this.configService.getSetting('Data').apiUrls.admin || '';  // Fallback to empty string if undefined
          break;
        case 'file':
          // baseUrl = this.jsonData['apiUrls'].file || '';  // Fallback to empty string if undefined
          baseUrl = this.configService.getSetting('Data').apiUrls.file || '';  // Fallback to empty string if undefined
          break;
        default:
          baseUrl = '';  // Default to empty if no matching 'apiTarget'
      }
  
      // If baseUrl is set, return it immediately
      if (baseUrl) return baseUrl;
    }
  
    // If 'api' is not true or 'jsonData' is missing, construct the base URL using a fallback
    if (this.jsonData) {
      // Assuming 'jsonData' contains `hostname` and `port` for the server
      const hostname = this.jsonData['hostname'] || 'localhost';  // Fallback to localhost if not provided
      const port = this.jsonData['port'] || '3000';  // Fallback to port 3000 if not provided
      const protocol = 'https';
      return `${protocol}://${hostname}:${port}`;  // Construct URL based on `jsonData`
    } else {
      // Fallback to default base URL format (when 'jsonData' is missing)
      const hostname = 'localhost';  // Default hostname
      const port = this.PORT ? this.PORT : '3000';  // Use PORT from the class or default to 3000
      return `http://${hostname}:${port}`;
    }
  }
  

  private handleUnknownError(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      retryWhen(errors => {
        // console.log(`request url: ${request.url}`)
        errors.subscribe(x => {
          //console.log(request.headers.getAll('Access-Control-Allow-Origin'))
          //console.log(request.headers.getAll('Access-Control-Allow-Headers'))
          console.log(`status in response: ${x.status}`)
          console.log(`Url of request: ${x.url}`)
          console.log(`Message of request: ${x.message}`)
        })

        return errors.pipe(
          delay(2000),
          take(1));
      })
    );
  }

  addRequest(modifiedReq: UniqueRequest) {
    this.inProgressRequests.push(modifiedReq);
    this.service.toggleLoadingSpinner(true);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
  HttpEvent<any>
  | HttpSentEvent
  | HttpHeaderResponse
  | HttpProgressEvent
  | HttpResponse<any>
  | HttpUserEvent<any>
  | any
  > {
    
    if (!req) {
      console.warn('Request object is null or undefined in the interceptor');
      return next.handle(req); // Proceed with an empty request or an error message
  }

    this.uniqueRequestIdentifier = this.uniqueRequestIdentifier + 1;
    let modifiedReq = {
      ...{ uniqueRequestIdentifier: this.uniqueRequestIdentifier },
      ...{ req: req },
    };
    this.addRequest(modifiedReq);
    // if (isPlatformServer(this.platformId)) {
    //   if (req.url && (req.url ?? false)){
    //     console.log(`Method Start req url: ${req.url}`)
        if (req.url.startsWith('https://localhost:4200/assets')) {
          // const baseUrl = this.getBaseUrl(this.request);
          const baseUrl = this.getBaseUrl(req);
          req = req.clone({
            url: `${baseUrl}/${req.url.replace('https://localhost:4200/assets','assets')}`
          });
        }
        else if (req.url.startsWith('/api')) { //This method is called
          // const baseUrl = this.getBaseUrl(this.request, true);
          const baseUrl = this.getBaseUrl(req, true);
        //   if (isPlatformServer(this.platformId)) {
        //     const serverHttps = require('https') //error here unable to build because it cannot find it
        //   var cert = fs.readFileSync('ssl/client.cert.crt');
        //   var key = fs.readFileSync('ssl/clientkey.pem');
        //   //https://livebook.manning.com/book/angular-development-with-typescript-second-edition/chapter-12/1
        //   const headers = new HttpHeaders({
        //         // 'Authorization': 'token 123',
        //         'Content-Type': "application/json",
        //         // 'Accept': 'application/json, text/plain, */*',
        //         // 'Accept-Encoding': 'gzip, deflate, br',
        //         // 'Connection': 'keep-alive',
        //         // 'host': 'localhost:4200',
        //         // 'Referer': 'https://localhost:4200',
        //         // 'Pragma': 'no-cache',
        //         // 'Cache-Control': 'no-cache',
        //         // 'X-Requested-With': 'XMLHttpRequest',
        //         // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        //         // 'Access-Control-Allow-Origin': 'https://localhost:4200',
        //         // 'Origin': 'https://localhost:4200',
        //         // 'X-SSL-Certificate': encodeURIComponent(cert.toString('base64')),
        //         // 'X-SSL-Certificate': encodeURIComponent(cert.toString('base64')),
        //         // 'X-SSL-Certificate': this.request.header('set-cookie')
        //         // 'X-SSL-CERT': encodeURIComponent(cert.toString())
        //       });
        //   // const baseUrl = this.getBaseUrl(req, true);
        //   // console.log('X-SSL-CERT')
        //   // console.log(headers.get('X-SSL-CERT'))
        //   console.log(headers.get('Content-Type'))
        //   console.log("Request Body: ", JSON.stringify(req.body))
        //   let newUrl = `${baseUrl}${req.url.replace('/api','')}`;
        //   const reqData = JSON.stringify(req.body);
        //   // var data = Buffer.byteLength(reqData);
        //   // if (newUrl.endsWith('/')) {
        //   //   newUrl = newUrl.slice(0,newUrl.length-1);
        //   // }
        //   // const method = req.method;
        //   // const reqBody = req.body;
        //   // const reqparams = req.params;
        //   console.log(newUrl)
        //   console.log(this.request.hostname)
        //   const options = {
        //     agent: new serverHttps.Agent({
        //           key: fs.readFileSync('ssl/clientkey.pem'),
        //           cert: fs.readFileSync('ssl/client.cert.crt'),
        //           maxSockets: 100,
        //           keepAlive: true,
        //           maxFreeSockets: 10,
        //           keepAliveMsecs: 100000,
        //           timeout: 6000000,      // <-- this is for the agentkeepalive
        //           freeSocketTimeout: 90000,

        //       }),
        //       ca: fs.readFileSync('ssl/cacert.crt'),
        //     // cert:  encodeURIComponent(cert.toString()),
        //     //cert:  cert,
        //     // key: encodeURIComponent(key.toString()),
        //     //key: key,
        //     // url: newUrl,
        //     // host: 'localhost:4200',
        //     host: this.request.hostname, //only shows domain without protocol and port and this should be fetched from proxy.conf.json
        //     port: 7002, // this should be fetched from proxy.conf.json
        //     // path: '/api/login',
        //     path: req.url,
        //     method: req.method,
        //     // headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        //     headers: {
        //       'Content-Type': 'application/json',
        //       // 'Content-Length': data,
        //       // 'Content-Length': reqData.length,
        //       'Content-Length': Buffer.byteLength(JSON.stringify(req.body))
        //     },
        //     // body: JSON.stringify(req.body), //not working although above console shows filled json
        //     // body: {"Login":"YWRtaW4=","Password":"YWRtaW4="},
        //     // headers: headers,
        //     params: req.params
        //   };

        //   // options.agent = new serverHttps.Agent(options);

        //   const requ = serverHttps.request(options, (res) => {
        //     console.log('statusCode:', res.statusCode);
        //     console.log('response headers:', res.headers);
        //     // console.log('request headers:', req.headers);
        //     let response = ''
        //     res.on('data', (chunk) => {
        //         response += chunk
        //         process.stdout.write(chunk);
        //     });
        //     res.on('end', ()=>{
        //         console.log(`Result: ${response}`)
        //     });
        //     // req.end();
        //   });

        //   requ.on('error', (e) => {
        //     console.error(e);
        //   });
        //   requ.write(JSON.stringify(req.body));
        //   requ.end();
        //   // req = req.clone({
        //   //   url: newUrl,
        //   //   headers: headers,
        //   //   method: method,
        //   //   body: reqBody,
        //   //   params: reqparams,
        //   //   agent : new https.Agent({
        //   //     cert: encodeURIComponent(cert.toString()),
        //   //     // key: CREDENTIALS.key
        //   //   })
        //   //   })
        //   // console.log('X-SSL-Certificate')
        //   // console.log(headers.get('X-SSL-Certificate'))
        //   // let newUrl = `${baseUrl}${req.url.replace('/api','')}`;
        //   // // if (newUrl.endsWith('/')) {
        //   // //   newUrl = newUrl.slice(0,newUrl.length-1);
        //   // // }
        //   // const method = req.method;
        //   // const reqBody = req.body;
        //   // const reqparams = req.params;
        //   // req = req.clone({
        //   //   url: newUrl,
        //   //   // headers: headers,
        //   //   method: method,
        //   //   body: reqBody,
        //   //   params: reqparams
        //   // });
        // }
        // else if (req.url.startsWith('https://localhost:4200//api')) {
        //   const baseUrl = this.getBaseUrl(this.request, true);
        //   // const baseUrl = this.getBaseUrl(req, true);
        //   // var https = require('https');
        //   // var fs  = require('fs');

        //   // var options = {
        //   //   // hostname: 'example.com',
        //   //   body: req.body,
        //   //   hostname: 'localhost',
        //   //   // port: 83,
        //   //   port: 7002,
        //   //   // path: '/v1/api?a=b',
        //   //   path: '/api/login',
        //   //   // method: 'GET',
        //   //   method: 'PUT',
        //   //   key: fs.readFileSync('ssl/client.cert.crt'),
        //   //   cert: fs.readFileSync('ssl/clientkey.pem'),
        //   //   // passphrase: 'password'
        //   // };

        //   // var newreq = https.request(options, function(res) {
        //   // console.log(res.statusCode);
        //   // res.on('data', function(d) {
        //   //   process.stdout.write(d);
        //   //   });
        //   // });

        //   // newreq.end()
        //   const headers = new HttpHeaders({
        //     // 'Authorization': 'token 123',
        //     // 'Content-Type': 'application/json'
        //     'Origin': 'https://localhost:4200'
        //   });
        //   let newUrl = `${baseUrl}${req.url.replace('https://localhost:4200//api','/api')}`;
        //   if (newUrl.endsWith('/')) {
        //     newUrl = newUrl.slice(0,newUrl.length-1);
        //   }
        //   console.log(`New Url : ${newUrl}`);
        //   req = req.clone({
        //     // url: `${baseUrl}${req.url.replace('/api','')}`
        //     url: newUrl,
        //     headers: headers,
        //     method: 'PUT'
        //   });
        //   console.log(`New Request Url : ${req.url}`);
        // }
        // else {
        //   const baseUrl = this.getBaseUrl(this.request);
        //   // const baseUrl = this.getBaseUrl(req);
        //   // req.withCredentials// to add cookies by default
        //   if (this.request.url.length > 1) {
        //   console.log("protocol: %j",this.request.protocol)
        //   console.log("hostname: %j",this.request.hostname)
        //   console.log("Route: %j",this.request.route)
        //   console.log("baseurl: %j",this.request.baseUrl)
        //   console.log("originalUrl: %j",this.request.originalUrl)
        //   console.log("path: %j",this.request.path)
        //   console.log("url: %j",this.request.url)

        //   let newUrl = `${baseUrl}${req.url.replace('https://localhost:4200/api','/api')}`;
        //   if (newUrl.endsWith('/')) {
        //     newUrl = newUrl.slice(0,newUrl.length-1);
        //   }
        //   console.log(`New Url at next method : ${newUrl}`);

        //     req = req.clone({
        //       // url: `${baseUrl}/${req.url.split('https://localhost:4200/')[1]}`
        //       // url: `${baseUrl}${this.request.url}`,
        //       url: newUrl,

        //     });
        //     console.log(`New Request Url at next method : ${req.url}`);
        //   }
        //   // else {
        //   //   req = req.clone({
        //   //     // url: `${baseUrl}/${req.url.split('https://localhost:4200/')[1]}`
        //   //     // url: `${baseUrl}`
        //   //     url: ""
        //   //   });
        //   // }
          req = req.clone({
            // url: `${baseUrl}/${req.url.split('https://localhost:4200/')[1]}`
            // url: `${baseUrl}${this.request.path}`
            url: `${baseUrl}${req.url.replace('/api','')}`,
            headers: req.headers.delete('x-api-target') // remove custom header
          });
        // }
        }
    // }
    return next.handle(req).pipe(
      // delay(10000),
      catchError(err => {
            if (err instanceof HttpErrorResponse) {
              console.log("Error: ",err);
              // console.log("Error status: ",err.status);
              // console.log("Error status Text: ",err.statusText);
              // console.log("Error Error: ",err.error);
              // console.log("Error url: ",err.url);


              switch (err.status) {
                // case 401:
                //   return this.handle401Error(request, next);
                case 0:
                  return this.handleUnknownError(req, next);
                default:
                  return this.router.navigate(['system-error']);
              }
            } else {
              return throwError(err);
            }
          }),
          finalize(() => {
            //error or success : remove the request
            this.removeRequest(modifiedReq);
          })
    );
  }
}
