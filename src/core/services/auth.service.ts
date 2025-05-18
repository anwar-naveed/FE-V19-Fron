import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BaseService } from './base.service';
// import { Observable } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService extends BaseService<any> {
    private jwtHelper: JwtHelperService = new JwtHelperService();
    isInitial = true;
    isLoading = false;
    subscriber
    constructor(private shared: SharedService) {
        super("Tenant");
        this.subscriber = this.shared.getApiResponse()
        .subscribe({
            next: (val) => {
                if (val && val.url && val.url.includes('TestAuth')) {
                    this.isLoading = false;
                }
        },
        error: (error) => {
            console.log(error);
        },
        complete: () => {
          //console.log('Complete');
        }});
    }

    public isAuthenticated(): boolean {
        const token = this.localStorage.Get('token');
        //Check if token is expired.
        return !this.jwtHelper.isTokenExpired(token);
    }

    public async TestAuth() {
        this.isLoading = true;
        await this.Get('TestAuth');
        this.isLoading = false;
        return true;
    }
}
