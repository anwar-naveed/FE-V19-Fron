import { 
  ApplicationConfig, 
  provideZoneChangeDetection, 
  APP_ID, 
  ErrorHandler,
  importProvidersFrom, 
  ɵɵinject,
  APP_INITIALIZER
 } from '@angular/core';
import { HttpClientModule,
  // HttpClient, HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  // BrowserAnimationsModule,
  NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule,
  //  provideClientHydration,
  } from '@angular/platform-browser';
import { AppModule } from "src/app/app.module";
import {
  provideRouter,
  Routes,
  withComponentInputBinding,
  // Scroll,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig,
  // withDebugTracing,
  // withPreloading,
  // withHashLocation,
} from "@angular/router";
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { CustomViewportScroller } from './shared/services/common/custom-viewport-scroller';
import {
  // APP_CERTIFICATE,
  // APP_CA_CERTIFICATE,
  // APP_KEY,
  // APP_ENC_KEY,
  // APP_SALT_KEY,
  // APP_API_HOSTNAME,
  // APP_API_PORT,
  // APP_SERVER_HOSTNAME,
  // APP_SERVER_PORT,
  APP_DATA_ID,
  APP_U_ID,
  APP_P_ID
} from "../core/services/app-tokens.service";
import { ComponentsRoutes } from "../app/app-components/components.routing";
import { ConfigService } from '../core/services/config.service';

// export function initApp(configService: ConfigService) {
//   return () => configService.loadConfig();
// }

const AppRoutes: Routes = [
  // {
  //   path: '',
  //   component: FullComponent,
  //   children: [
  //     // {
  //     //   path: '',
  //     //   // redirectTo: '/dashboard',
  //     //   redirectTo: '/main',
  //     //   pathMatch: 'full'
  //     // },
  //     {
  //       path: '',
  //       loadChildren:
  //         () => import('./material-component/material.module').then(m => m.MaterialComponentsModule),
  //         data: { preload: true }
  //     },
  //     {
  //       path: '',
  //       loadChildren:
  //         () => import('./main-components/main-module.module').then(m => m.MainModuleModule),
  //         data: { preload: true }
  //     },
  //     // {
  //     //   path: '',
  //     //   loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  //     // },
      {
        path: '',
        loadChildren:
          () => import('./app-components/components.module').then(m => m.ComponentsModule),
          data: { preload: true }
      }
  //     // {
  //     //   path: 'main',
  //     //   loadChildren: () => import('./app-components/components.module').then(m => m.ComponentsModule)
  //     // }
  //   ]
  // },
  // {
  //   path: '**', redirectTo: '',
  // }
];

export const AppRouteProviders = [
  importProvidersFrom(
    // RouterModule
    // .forRoot(AppRoutes, {
    //   paramsInheritanceStrategy: 'always',
    //   onSameUrlNavigation: 'reload',
    //   scrollPositionRestoration: 'disabled',
    //   initialNavigation: 'enabledBlocking',
    //   enableTracing: true,
    //   useHash: true,
    // }),
    HttpClientModule,
    AppModule,
    NoopAnimationsModule,
    BrowserModule,
    // .withServerTransition({
    //   appId: 'myApp'
    // }),
  ),
  {
    provide: APP_INITIALIZER,
    useFactory: (appConfigService : ConfigService) =>  () => appConfigService.loadConfig(),
    deps: [ConfigService],
    multi: true
  },
  // or using the new provideRouter
  provideRouter(
    AppRoutes,
    // ComponentsRoutes,
    // enableTracing: true ?where to put // <-- debugging purposes only
    //withDebugTracing(), // <-- debugging purposes only
    // withHashLocation(),
    withInMemoryScrolling({
      // scrollPositionRestoration: 'disabled',

      // anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
    withEnabledBlockingInitialNavigation(),
    withRouterConfig({
      paramsInheritanceStrategy: 'always',
      // onSameUrlNavigation: 'reload',
      urlUpdateStrategy: 'eager'
    }),
    withComponentInputBinding()
  ),
  // Setup NGRX:
  // provideStore({
  //   auth: authFeature.reducer,
  //   appdata: appDataFeature.reducer,
  //   maincomponent: mainComponentDataFeature.reducer,
  //   ngrxForms: ngrxFormsFeature.reducer,
  // }),
  // provideEffects([
  //   authFunctionalEffects,
  //   appdataFunctionalEffects,
  //   maincomponentFunctionalEffects,
  //   ngrxFormsEffects
  // ]),
  // provideStoreDevtools(storeDevConfig),

  // using ENIVRONMENT_INITIALIZER is like NgModule constructor calls
  // {
  //   provide: ENVIRONMENT_INITIALIZER,
  //   multi: true,
  //   useFactory: appFactory,
  //   deps: [Router],
  // },
  // {
  //   provide: ViewportScroller,
  //   // useFactory: () => new CustomViewportScroller('content-scroller', ɵɵinject(DOCUMENT), window, ɵɵinject(ErrorHandler))
  //   useFactory: () => new CustomViewportScroller('.mat-sidenav-content', ɵɵinject(DOCUMENT), window, ɵɵinject(ErrorHandler))
  // },
  { provide: APP_ID, useValue: '08db896c-3f9c-4f39-87ca-4148cde22d6c' },
  // { provide: APP_BASE_HREF, useValue: '/' },
  // { provide: APP_CERTIFICATE, useValue: fs.readFileSync('ssl/client.cert.crt') },
  // { provide: APP_CA_CERTIFICATE, useValue: fs.readFileSync('ssl/cacert.crt') },
  // { provide: APP_KEY, useValue: fs.readFileSync('ssl/clientkey.pem') },
  // { provide: APP_ENC_KEY, useValue: fs.readFileSync('ssl/client.cert.crt') },
  // { provide: APP_SALT_KEY, useValue: fs.readFileSync('ssl/client.cert.crt') },
  // { provide: APP_API_HOSTNAME, useValue: jsonData['apiHostName'] },
  // { provide: APP_API_PORT, useValue: jsonData['apiHostPort'] },
  // { provide: APP_SERVER_HOSTNAME, useValue: jsonData['serverHostName'] },
  // { provide: APP_SERVER_PORT, useValue: jsonData['serverPort'] },
  { provide: APP_DATA_ID, useValue: '08db896c-3f9c-4f39-87ca-4148cde22d6c' },
  { provide: APP_U_ID, useValue: '' },
  { provide: APP_P_ID, useValue: '' },

];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), AppRouteProviders]
};
