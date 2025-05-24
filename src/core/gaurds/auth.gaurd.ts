import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { LocalStorage } from '../helper/local.storage';
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router, 
        private localStorage: LocalStorage,
        private authService: AuthService
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.CheckToken(state);
    }

    // as null was not working therefore used this
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.CheckToken(state);
    }

    private CheckToken(route: RouterStateSnapshot) {
        if (this.localStorage.Get('token')) {
            if (this.authService.isAuthenticated()){
                return true;
            }
            else {
                return this.navigateToUrl(route, 'login');
            }
        }
        else {
            return this.navigateToUrl(route, 'login');
        }
    }

    private navigateToUrl(route: RouterStateSnapshot, urlToRoute: string){
        //Router to save last url before navigating to login
        if (route) {
            this.localStorage.Set('lastUrl', route.url);
            //console.log('ROUTE: ' + route);
        }

        this.router.navigate([urlToRoute]);
        return false;
    }
}
