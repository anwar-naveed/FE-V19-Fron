import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { LocalStorage } from './local.storage';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router, private localStorage: LocalStorage){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.CheckToken(route);
    }

    // as null was not working therefore used this
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.CheckToken(route);
    }

    private CheckToken(route: ActivatedRouteSnapshot) {
        if (this.localStorage.Get('token')) {
            return true;
        }
        //Router to save last url before navigating to login
        if (route) {
            this.localStorage.Set('lastUrl', route.url);
            //console.log('ROUTE: ' + route);
        }

        this.router.navigate(['login']);
        return false;
    }
}
