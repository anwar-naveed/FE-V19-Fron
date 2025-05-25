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
        console.log("Authgaurd called at url:", state.url)
        return this.CheckToken(state);
    }

    // as null was not working therefore used this
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.CheckToken(state);
    }

    private CheckToken(route: RouterStateSnapshot) {
        const token = this.localStorage.Get('token');
        const isAuth = this.authService.isAuthenticated();
        if (token && isAuth) {
            return true;
        } else {
            return this.navigateToUrl(route, 'login');
        }
    }
    

    private navigateToUrl(route: RouterStateSnapshot, urlToRoute: string){
        //Router to save last url before navigating to login
        if (route) {
            this.localStorage.Set('lastUrl', route.url);
        }

        this.router.navigate([urlToRoute], { replaceUrl: true });
        return false;
    }
}
