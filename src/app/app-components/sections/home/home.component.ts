import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/auth/user.service';

// import { User } from '@app/_models';

@Component({ 
    // standalone: false,
    selector: 'app-home',
    templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    // users?: User[];

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        this.loading = true;
        // this.userService.getAll().pipe(first()).subscribe(users => {
        //     this.loading = false;
        //     this.users = users;
        // });
    }
}