import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
}) 

export class AuthGaurd implements CanActivate {
    constructor (public auth: AuthService, public route: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        if (localStorage.getItem('token')) {
            if (this.auth.isInitial) {
                this.auth.isInitial = false;
                return this.auth.TestAuth();
            }
            return true;
        }
        else {
            //route to login
            // this.route.navigate(['login'], { queryParams: { returnUrl: state.url}});
            this.route.navigate(['/main-window'])
            return false;
        }
    }
}