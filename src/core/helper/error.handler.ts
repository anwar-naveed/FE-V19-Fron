import { ErrorHandler, Injectable, Injector, Inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()

export class GlobalErrorHandler implements ErrorHandler {
    private router!: Router;
    constructor (@Inject(Injector) private injector: Injector, @Inject(NgZone) private ngZone: NgZone) {}

    handleError(error: any): void {
        if (!this.router) {
            this.router = this.injector.get(Router);
        }
        if (error.message === 'Un Authorized' || error.message === 'Session Expired') {
            this.ngZone.run(() => {
                this.router.navigate(['login'], { skipLocationChange: true});
            })
        }
        else {
            console.error(error);
        }
        const chunkFailedMessage = /Loading chunck [\d] + failed/;
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        }
    }
}