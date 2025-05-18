import {ApplicationRef, Injectable, InjectionToken, TransferState, inject, PLATFORM_ID, Inject} from '@angular/core';
import { CacheManagerStore, createCache } from 'cache-manager';
import { isPlatformServer } from "@angular/common";
import { delay, from, map } from 'rxjs';
import * as appConfigJson from "public/config/app-settings.json";

// export const USER_PROFILE = new InjectionToken<object>('app certificate');
export const APP_CERTIFICATE = new InjectionToken<object>('app certificate');
export const APP_CA_CERTIFICATE = new InjectionToken<object>('app root certificate');
export const APP_INTER_CA_CERTIFICATE = new InjectionToken<object>('app inter certificate');
export const APP_KEY = new InjectionToken<object>('app certificate key');
export const APP_ENC_KEY = new InjectionToken<object>('app certificate encrypted key');
export const APP_SALT_KEY = new InjectionToken<object>('app certificate encrypted key salt');
export const APP_API_HOSTNAME = new InjectionToken<object>('app api host name');
export const APP_API_PORT = new InjectionToken<object>('app api port');
export const APP_SERVER_HOSTNAME = new InjectionToken<object>('app server host name');
export const APP_SERVER_PORT = new InjectionToken<object>('app server port');
export const APP_DATA_ID = new InjectionToken<string>('app data id');
export const APP_U_ID = new InjectionToken<string>('app U id');
export const APP_P_ID = new InjectionToken<string>('app P id');
// export const APP_MEMORY_CACHE = new InjectionToken<MemoryCache>('app memory cache');
export let memoryCach: CacheManagerStore;


// // const mem = () => {
//  const cachin = caching('memory', {
//       // max: jsonData['maxentries'],
//       max: 50,
//       // ttl: 10 * 1000 /*milliseconds*/,
//       // ttl: jsonData['pagettl'] /*milliseconds*/,
//       ttl: 86400000 /*milliseconds*/,
//     })
// // ).pipe(map(res => {return res}))}
// .then(cach => {console.log("cache at tokens: \n",cach);memoryCache = cach});
// //}

// const APP_MEMORY_CACHE_FACTORY = () => {

//   // if (memoryCache && (memoryCache ?? false)) {
//   //   console.log("present cache: \n",memoryCache);
//   //   return memoryCache;
//   // }
//   // else {
//   //   // mem();
//   //   let count: number = 0;
//   //   const jsonData: any = appConfigJson;
//   //   caching('memory', {
//   //     // max: jsonData['maxentries'],
//   //     max: 50,
//   //     // ttl: 10 * 1000 /*milliseconds*/,
//   //     // ttl: jsonData['pagettl'] /*milliseconds*/,
//   //     ttl: 86400000 /*milliseconds*/,
//   //   })
//   //   // ).pipe(map(res => {return res}))}
//   //   .then(cach => {
//   //     console.log("cache: \n",cach);
//   //     memoryCache = cach;
//   //   });
//   //   // while (memoryCache === undefined) {
//   //   //   count++;
//   //   //   console.log("counter: ", count);
//   //   // }
//   //   console.log("new cache: \n",memoryCache);
//     return memoryCache;
//   //}
// }
// export const APP_MEMORY_CACHE = new InjectionToken<MemoryCache>('app memory cache',
// {
//   factory: APP_MEMORY_CACHE_FACTORY,
//   providedIn: 'root',
// });

export const APP_TRANSFER_STATE = new InjectionToken('app transfer state', {
  factory: () => {
    // const appRef = inject(ApplicationRef);
    let state: TransferState;
    // appRef.isStable.pipe(map(res => {
    //   if (res === true) {
        state = inject(TransferState);
    // }}))
    return state;
  },
  providedIn: 'root'
});


// @Injectable({
//   providedIn: 'root'
// })
// export class AppMemoryService {
//   memoryCache: CacheManagerStore
//   constructor(@Inject(PLATFORM_ID) private platformId, ) {
//     // if (isPlatformServer(this.platformId)) {
//     //   this.CreateMemory();
//     // }
//   }


//   CacheManagerStore()
//  CreateMemory(){
//   const jsonData: any = appConfigJson;
//   caching('memory', {
//     max: jsonData['maxentries'],
//     // max: 50,
//     // ttl: 10 * 1000 /*milliseconds*/,
//     ttl: jsonData['pagettl'] /*milliseconds*/,
//     // ttl: 86400000 /*milliseconds*/,
//   })
//   // ).pipe(map(res => {return res}))}
//   .then(cach => {
//     // console.log("cache at tokens: \n",cach);
//     this.memoryCache = cach; memoryCach = cach});
//  }
// }

